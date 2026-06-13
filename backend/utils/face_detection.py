"""
Face detection utility for the Acne Severity Classification System.
Uses OpenCV's DNN-based face detector (ResNet SSD) for high-accuracy
face detection. Much more reliable than Haar Cascades — dramatically
fewer false positives on non-face images.
"""

import os
import cv2
import numpy as np
from PIL import Image
import io


# ── DNN Model paths ──
_MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
_PROTOTXT = os.path.join(_MODELS_DIR, "deploy.prototxt")
_CAFFEMODEL = os.path.join(_MODELS_DIR, "res10_300x300_ssd_iter_140000.caffemodel")

# Minimum confidence for DNN face detection (0–1 scale)
# Higher = stricter, fewer false positives
DNN_CONFIDENCE_THRESHOLD = 0.60

# Load the DNN model once at module import
_face_net = None

def _load_face_net():
    """Lazy-load the DNN face detector model."""
    global _face_net
    if _face_net is not None:
        return _face_net
    
    if os.path.exists(_PROTOTXT) and os.path.exists(_CAFFEMODEL):
        _face_net = cv2.dnn.readNetFromCaffe(_PROTOTXT, _CAFFEMODEL)
        print("[+] DNN face detector loaded successfully.")
    else:
        print(f"[-] DNN model files not found at: {_MODELS_DIR}")
        print("[!] Face detection will be unavailable.")
    
    return _face_net


def detect_face(file_storage):
    """
    Detect whether the uploaded image contains a human face using
    OpenCV's DNN-based ResNet SSD face detector.
    
    This detector is far more accurate than Haar Cascades:
    - Very low false-positive rate on non-face images
    - Works well across lighting conditions and angles
    - Returns a confidence score for each detection
    
    Args:
        file_storage: Flask FileStorage object from request.files
        
    Returns:
        tuple: (has_face: bool, face_count: int, message: str)
        
    Raises:
        ValueError: If the file cannot be read as an image
    """
    try:
        # Read image bytes (seek to start in case it was read before)
        file_storage.seek(0)
        image_bytes = file_storage.read()
        file_storage.seek(0)  # Reset for downstream processing
        
        # Convert to numpy array via PIL for reliable format handling
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image = pil_image.convert("RGB")
        img_array = np.array(pil_image)
        
        # Convert RGB to BGR (OpenCV format)
        img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        (h, w) = img_bgr.shape[:2]
        
        # ── Try DNN-based detection (primary, high accuracy) ──
        net = _load_face_net()
        
        if net is not None:
            # Prepare the image blob for the DNN
            # ResNet SSD expects 300x300 input with specific mean subtraction
            blob = cv2.dnn.blobFromImage(
                cv2.resize(img_bgr, (300, 300)),
                scalefactor=1.0,
                size=(300, 300),
                mean=(104.0, 177.0, 123.0),
                swapRB=False,
                crop=False
            )
            
            net.setInput(blob)
            detections = net.forward()
            
            # Count faces that meet the confidence threshold
            face_count = 0
            best_confidence = 0.0
            
            for i in range(detections.shape[2]):
                confidence = float(detections[0, 0, i, 2])
                if confidence > DNN_CONFIDENCE_THRESHOLD:
                    face_count += 1
                    best_confidence = max(best_confidence, confidence)
            
            if face_count == 0:
                return False, 0, (
                    "No human face detected in the image. "
                    "Please upload a clear photo of your face for accurate acne analysis."
                )
            
            return True, face_count, (
                f"Face detected successfully "
                f"({face_count} face(s), confidence: {best_confidence:.0%})."
            )
        
        # ── Fallback: Haar Cascade (if DNN model files are missing) ──
        print("[!] Falling back to Haar Cascade face detection.")
        return _haar_cascade_fallback(img_bgr)
        
    except Exception as e:
        raise ValueError(f"Face detection failed: {str(e)}")


def _haar_cascade_fallback(img_bgr):
    """
    Fallback face detection using Haar Cascade.
    Only used if the DNN model files are not available.
    Uses strict parameters to minimize false positives.
    """
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)
    
    if face_cascade.empty():
        # If cascade also fails, allow through with a warning
        return True, 0, "Face detection unavailable — proceeding with analysis."
    
    # Very strict parameters to reduce false positives
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.05,
        minNeighbors=8,
        minSize=(80, 80),
        flags=cv2.CASCADE_SCALE_IMAGE
    )
    
    face_count = len(faces)
    
    if face_count == 0:
        return False, 0, (
            "No human face detected in the image. "
            "Please upload a clear photo of your face for accurate acne analysis."
        )
    
    return True, face_count, f"Face detected ({face_count} face(s) found)."
