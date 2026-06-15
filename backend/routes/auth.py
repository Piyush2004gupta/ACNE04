from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt
import jwt
import datetime
from models import db, User
import random
import uuid
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
bcrypt = Bcrypt()

# Temporary in-memory storage for OTPs (In production, use Redis or DB)
# Format: { 'phone_number': { 'otp': '1234', 'expires_at': timestamp } }
otp_store = {}

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Required fields
    required = ['name', 'email', 'phone', 'gender', 'age', 'password']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing data', 'message': 'All fields are required.'}), 400
        
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Conflict', 'message': 'Email already registered.'}), 409
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'error': 'Conflict', 'message': 'Phone number already registered.'}), 409
        
    # Hash password
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Create user
    new_user = User(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        gender=data['gender'],
        age=int(data['age']),
        password_hash=hashed_pw
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token automatically so they are logged in
        token = jwt.encode({
            'user_id': new_user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing credentials', 'message': 'Please provide email and password.'}), 400
        
    email = data.get('email')
    password = data.get('password')
    
    # Try finding user by email only
    user = User.query.filter_by(email=email).first()
    
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid credentials.'}), 401
        
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'message': 'Logged in successfully',
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Missing data', 'message': 'Email address is required.'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        # Don't reveal if user exists or not for security, but we return a generic success
        pass
        
    # Generate 4-digit OTP
    otp = str(random.randint(1000, 9999))
    
    # Store OTP (expires in 10 minutes)
    otp_store[email] = {
        'otp': otp,
        'expires_at': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    }
    
    # Check if SMTP credentials are set to send real email
    from flask_mail import Message
    from app import mail
    
    mail_username = current_app.config.get("MAIL_USERNAME")
    mail_password = current_app.config.get("MAIL_PASSWORD")
    
    print(f"[DEBUG] mail_username: {mail_username}, mail_password: {mail_password}", flush=True)
    if mail_username and mail_password:
        try:
            msg = Message(
                subject="SKIN AI — Your Password Reset OTP",
                recipients=[email],
                body=(
                    f"Hello,\n\n"
                    f"You have requested to reset your password for your SKIN AI account.\n"
                    f"Your one-time password (OTP) is: {otp}\n\n"
                    f"This code will expire in 10 minutes.\n\n"
                    f"If you did not request this, please ignore this email.\n\n"
                    f"Best regards,\n"
                    f"SKIN AI Team"
                )
            )
            mail.send(msg)
            print(f"[+] Real email sent successfully to {email}", flush=True)
        except Exception as e:
            print(f"[-] Failed to send real email: {str(e)}", flush=True)
            print(f"\n[{datetime.datetime.utcnow()}] EMAIL MOCK -> Sent OTP {otp} to {email}\n", flush=True)
    else:
        # MOCK SENDING EMAIL (Local Dev Fallback):
        print(f"\n[{datetime.datetime.utcnow()}] EMAIL MOCK -> Sent OTP {otp} to {email}\n", flush=True)
    
    return jsonify({
        'message': 'If the email is registered, an OTP has been sent.'
    }), 200

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({'error': 'Missing data', 'message': 'Email and OTP are required.'}), 400
        
    stored_data = otp_store.get(email)
    if not stored_data:
        return jsonify({'error': 'Invalid request', 'message': 'No OTP requested for this email.'}), 400
        
    if datetime.datetime.utcnow() > stored_data['expires_at']:
        del otp_store[email]
        return jsonify({'error': 'Expired', 'message': 'OTP has expired. Please request a new one.'}), 400
        
    if stored_data['otp'] != otp:
        return jsonify({'error': 'Invalid OTP', 'message': 'The OTP entered is incorrect.'}), 400
        
    # OTP is valid. In a real app, generate a temporary reset token here.
    return jsonify({'message': 'OTP verified successfully.'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('newPassword')
    
    if not all([email, otp, new_password]):
        return jsonify({'error': 'Missing data', 'message': 'Email, OTP, and new password are required.'}), 400
        
    # Verify OTP again
    stored_data = otp_store.get(email)
    if not stored_data or stored_data['otp'] != otp or datetime.datetime.utcnow() > stored_data['expires_at']:
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid or expired OTP.'}), 401
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Not found', 'message': 'User not found.'}), 404
        
    # Update password
    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()
    
    # Cleanup OTP
    del otp_store[email]
    
    return jsonify({'message': 'Password has been reset successfully.'}), 200

@auth_bp.route('/google', methods=['POST'])
def google_auth():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Missing token', 'message': 'Google credential token is required.'}), 400
        
    try:
        # Verify the Google ID token
        # Get Client ID from config (or environment variable directly)
        google_client_id = current_app.config.get("GOOGLE_CLIENT_ID") or os.environ.get("GOOGLE_CLIENT_ID")
        
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), google_client_id)
        
        # ID token is valid. Extract user info:
        email = idinfo.get('email')
        name = idinfo.get('name')
        
        if not email:
            return jsonify({'error': 'Invalid token', 'message': 'Google token did not contain an email address.'}), 400
            
        # Check if user exists in database
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Create a new user since they signed up with Google for the first time
            random_pw = uuid.uuid4().hex
            hashed_pw = bcrypt.generate_password_hash(random_pw).decode('utf-8')
            
            user = User(
                name=name or email.split('@')[0],
                email=email,
                phone=f"google_{uuid.uuid4().hex[:10]}",
                gender="prefer_not_to_say",
                age=25,
                password_hash=hashed_pw
            )
            db.session.add(user)
            db.session.commit()
            message = 'Google account registered successfully'
        else:
            message = 'Logged in successfully with Google'
            
        # Generate JWT session token
        jwt_token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': message,
            'token': jwt_token,
            'user': user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': 'Unauthorized', 'message': f'Invalid Google token: {str(e)}'}), 401
    except Exception as e:
        return jsonify({'error': 'Server error', 'message': str(e)}), 500
