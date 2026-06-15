"""
Flask Backend for Acne Severity Classification System
======================================================

A production-ready REST API that serves predictions from a TensorFlow/Keras
acne severity classification model.

Endpoints:
    POST /predict  - Upload an image for acne severity analysis
    GET  /health   - Health check endpoint

Author: SKIN AI
"""

import os
import traceback
from datetime import datetime
import uuid
import io
from dotenv import load_dotenv
load_dotenv()
from werkzeug.utils import secure_filename

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail
import numpy as np

# Import utilities
from utils.preprocessing import preprocess_image
from utils.recommendations import (
    SEVERITY_CLASSES,
    get_recommendation,
    get_severity_index
)
from utils.face_detection import detect_face

# Import Database and Routes
from models import db
from routes.auth import auth_bp
from routes.history import history_bp


# ──────────────────────────────────────────────
# App Configuration
# ──────────────────────────────────────────────

app = Flask(__name__)

# Enable CORS for all routes (allows frontend on different port)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "acne2812022.h5")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size
CONFIDENCE_THRESHOLD = 70.0  # Minimum confidence (%) to accept a prediction
MARGIN_THRESHOLD = 15.0      # Min gap (%) between top-1 and top-2 predictions

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///app.db")
if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
    app.config["SQLALCHEMY_DATABASE_URI"] = app.config["SQLALCHEMY_DATABASE_URI"].replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "super-secret-development-key-for-jwt")

# SMTP Server Configuration for Real Email sending (SendGrid)
app.config["MAIL_SERVER"] = os.environ.get("MAIL_SERVER", "smtp.sendgrid.net")
app.config["MAIL_PORT"] = int(os.environ.get("MAIL_PORT", 587))
app.config["MAIL_USE_TLS"] = os.environ.get("MAIL_USE_TLS", "True").lower() == "true"
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME", "apikey")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD") # Read from environment variable or .env file
app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_DEFAULT_SENDER", "pg2253890@gmail.com")
app.config["GOOGLE_CLIENT_ID"] = os.environ.get("GOOGLE_CLIENT_ID")

mail = Mail(app)

# Initialize Database
db.init_app(app)

with app.app_context():
    db.create_all()

# Register Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(history_bp)

# Ensure uploads directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ──────────────────────────────────────────────
# Model Loading (once at startup)
# ──────────────────────────────────────────────

model = None

def load_ml_model():
    """Load the TensorFlow/Keras model at startup."""
    global model
    try:
        from tensorflow.keras.models import load_model
        if os.path.exists(MODEL_PATH):
            model = load_model(MODEL_PATH, compile=False)
            print(f"[+] Model loaded successfully from: {MODEL_PATH}")
            print(f"[+] Model input shape: {model.input_shape}")
        else:
            print(f"[-] Model file not found at: {MODEL_PATH}")
            print("[!] Server will run without model. /predict will return mock results.")
    except Exception as e:
        print(f"[-] Failed to load model: {str(e)}")
        print("[!] Server will run without model. /predict will return mock results.")

# Load the model at startup (runs for both direct execution and WSGI)
load_ml_model()


# ──────────────────────────────────────────────
# Helper Functions
# ──────────────────────────────────────────────

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_mock_prediction():
    """Generate a mock prediction when the model is not available."""
    import random
    class_idx = random.randint(0, len(SEVERITY_CLASSES) - 1)
    confidence = round(random.uniform(70, 99), 2)
    predicted_class = SEVERITY_CLASSES[class_idx]
    
    return predicted_class, confidence


# ──────────────────────────────────────────────
# API Endpoints
# ──────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint.
    
    Returns:
        JSON: Server status and model availability.
    """
    return jsonify({
        "status": "running",
        "model_loaded": model is not None,
        "timestamp": datetime.utcnow().isoformat()
    }), 200


@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict acne severity from an uploaded image.
    
    Expects:
        - Form-data with key 'image' containing the image file.
    
    Returns:
        JSON: {
            "predicted_class": str,
            "confidence": float,
            "severity_index": int,
            "recommendation": dict,
            "timestamp": str
        }
    
    Status Codes:
        200: Successful prediction
        400: Bad request (no file, invalid format)
        500: Internal server error
    """
    try:
        # ── Validate request ──
        if "image" not in request.files:
            return jsonify({
                "error": "No image file provided",
                "message": "Please upload an image file with the key 'image'."
            }), 400
        
        file = request.files["image"]
        
        if file.filename == "":
            return jsonify({
                "error": "No file selected",
                "message": "Please select an image file to upload."
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                "error": "Invalid file format",
                "message": f"Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400
            
        # ── Save image for future training ──
        image_bytes = file.read()
        unique_filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        with open(filepath, 'wb') as f:
            f.write(image_bytes)
        
        # ── Face detection validation ──
        # Use a BytesIO stream since the original file stream was read
        has_face, face_count, face_msg = detect_face(io.BytesIO(image_bytes))
        if not has_face:
            return jsonify({
                "error": "No face detected",
                "error_type": "no_face",
                "message": face_msg
            }), 400
        
        # ── Process and predict ──
        if model is not None:
            # Preprocess the image
            processed_image = preprocess_image(io.BytesIO(image_bytes))
            
            # Run prediction
            prediction = model.predict(processed_image, verbose=0)
            
            # Extract results (handle multi-output models where prediction is a list)
            probs = prediction[0] if isinstance(prediction, list) else prediction
            
            # probs shape is (1, num_classes)
            prob_array = probs[0]
            sorted_indices = np.argsort(prob_array)[::-1]  # descending
            class_idx = int(sorted_indices[0])
            confidence = round(float(prob_array[class_idx] * 100), 2)
            
            # Top-2 margin: gap between highest and second-highest probability
            second_confidence = round(float(prob_array[sorted_indices[1]] * 100), 2)
            margin = confidence - second_confidence
            
            # Entropy of the distribution (high entropy = model is confused)
            # For 4 classes, max entropy = log2(4) = 2.0
            entropy = -float(np.sum(prob_array * np.log2(prob_array + 1e-10)))
            max_entropy = np.log2(len(prob_array))
            normalized_entropy = entropy / max_entropy  # 0=certain, 1=uniform
            
            # ── Rejection checks ──
            # The model can't reliably classify this image if:
            #   1. Confidence is below threshold (model not sure about ANY class)
            #   2. Margin is too small (model is torn between classes = likely OOD)
            #   3. Entropy is too high (probabilities are spread too evenly)
            rejection_reason = None
            if confidence < CONFIDENCE_THRESHOLD:
                rejection_reason = (
                    f"The model's confidence ({confidence}%) is too low to make "
                    f"a reliable prediction. This image may not contain recognizable "
                    f"acne patterns."
                )
            elif margin < MARGIN_THRESHOLD:
                rejection_reason = (
                    f"The model could not clearly distinguish between acne severity "
                    f"levels (top two predictions are too close: {confidence}% vs "
                    f"{second_confidence}%). This image may not be suitable for analysis."
                )
            elif normalized_entropy > 0.85:
                rejection_reason = (
                    "The prediction probabilities are too evenly spread across all "
                    "classes, indicating the image does not match any known acne pattern."
                )
            
            if rejection_reason:
                return jsonify({
                    "error": "Unable to classify",
                    "error_type": "low_confidence",
                    "message": (
                        "I can't predict the acne severity for this image. "
                        + rejection_reason + " "
                        "Please upload a clear, close-up photo of facial acne."
                    ),
                    "confidence": confidence
                }), 200
            
            # Ensure we don't go out of bounds if model has fewer classes than our list
            class_idx = min(class_idx, len(SEVERITY_CLASSES) - 1)
            predicted_class = SEVERITY_CLASSES[class_idx]
        else:
            # Mock prediction when model is unavailable
            predicted_class, confidence = generate_mock_prediction()
        
        # Get recommendation based on severity
        recommendation = get_recommendation(predicted_class)
        severity_index = get_severity_index(predicted_class)
        
        # ── Return results ──
        return jsonify({
            "predicted_class": predicted_class,
            "confidence": confidence,
            "severity_index": severity_index,
            "recommendation": recommendation,
            "image_filename": unique_filename,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except ValueError as e:
        return jsonify({
            "error": "Image processing error",
            "message": str(e)
        }), 400
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred during prediction."
        }), 500


# ──────────────────────────────────────────────
# Error Handlers
# ──────────────────────────────────────────────

@app.errorhandler(413)
def file_too_large(e):
    """Handle file size exceeding limit."""
    return jsonify({
        "error": "File too large",
        "message": "Maximum file size is 16MB."
    }), 413


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors."""
    return jsonify({
        "error": "Not found",
        "message": "The requested endpoint does not exist."
    }), 404


@app.errorhandler(405)
def method_not_allowed(e):
    """Handle method not allowed errors."""
    return jsonify({
        "error": "Method not allowed",
        "message": "This HTTP method is not supported for this endpoint."
    }), 405


# ──────────────────────────────────────────────
# Entry Point
# ──────────────────────────────────────────────

if __name__ == "__main__":
    # Run the Flask development server
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
