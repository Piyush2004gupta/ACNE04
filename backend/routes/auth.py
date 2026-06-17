from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt
import jwt
import datetime
import os
import random
import uuid
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from bson.objectid import ObjectId

from models import users_collection, serialize_doc

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
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'error': 'Conflict', 'message': 'Email already registered.'}), 409
    if users_collection.find_one({'phone': data['phone']}):
        return jsonify({'error': 'Conflict', 'message': 'Phone number already registered.'}), 409
        
    # Hash password
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Create user document
    new_user = {
        'name': data['name'],
        'email': data['email'],
        'phone': data['phone'],
        'gender': data['gender'],
        'age': int(data['age']),
        'password_hash': hashed_pw,
        'created_at': datetime.datetime.utcnow().isoformat()
    }
    
    try:
        result = users_collection.insert_one(new_user)
        user_id = str(result.inserted_id)
        
        # Add id to dict for response
        new_user['id'] = user_id
        del new_user['_id']
        
        # Generate token automatically so they are logged in
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': new_user
        }), 201
    except Exception as e:
        return jsonify({'error': 'Server error', 'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing credentials', 'message': 'Please provide email and password.'}), 400
        
    email = data.get('email')
    password = data.get('password')
    
    # Try finding user by email
    user_doc = users_collection.find_one({'email': email})
    
    if not user_doc or not bcrypt.check_password_hash(user_doc['password_hash'], password):
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid credentials.'}), 401
        
    user = serialize_doc(user_doc)
    
    # Generate token
    token = jwt.encode({
        'user_id': user['id'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'message': 'Logged in successfully',
        'token': token,
        'user': user
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Missing data', 'message': 'Email address is required.'}), 400
        
    user_doc = users_collection.find_one({'email': email})
    if not user_doc:
        pass
        
    # Generate 4-digit OTP
    otp = str(random.randint(1000, 9999))
    
    # Store OTP (expires in 10 minutes)
    otp_store[email] = {
        'otp': otp,
        'expires_at': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    }
    
    # Check if RESEND_API_KEY is set to send real email
    import resend
    
    resend_api_key = os.environ.get("RESEND_API_KEY")
    resend.api_key = resend_api_key
    
    print(f"[DEBUG] Using Resend for email. API key configured: {bool(resend_api_key)}", flush=True)
    if resend_api_key:
        try:
            params = {
                "from": "Acne AI <onboarding@resend.dev>",
                "to": [email],
                "subject": "SKIN AI — Your Password Reset OTP",
                "html": (
                    f"<p>Hello,</p>"
                    f"<p>You have requested to reset your password for your SKIN AI account.</p>"
                    f"<p>Your one-time password (OTP) is: <strong>{otp}</strong></p>"
                    f"<p>This code will expire in 10 minutes.</p>"
                    f"<p>If you did not request this, please ignore this email.</p>"
                    f"<br>"
                    f"<p>Best regards,<br>SKIN AI Team</p>"
                )
            }
            resend.Emails.send(params)
            print(f"[+] Real email sent successfully via Resend to {email}", flush=True)
        except Exception as e:
            print(f"[-] Failed to send real email via Resend: {str(e)}", flush=True)
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
        
    user_doc = users_collection.find_one({'email': email})
    if not user_doc:
        return jsonify({'error': 'Not found', 'message': 'User not found.'}), 404
        
    # Update password
    hashed_pw = bcrypt.generate_password_hash(new_password).decode('utf-8')
    users_collection.update_one({'_id': user_doc['_id']}, {'$set': {'password_hash': hashed_pw}})
    
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
        google_client_id = current_app.config.get("GOOGLE_CLIENT_ID") or os.environ.get("GOOGLE_CLIENT_ID")
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), google_client_id)
        
        email = idinfo.get('email')
        name = idinfo.get('name')
        
        if not email:
            return jsonify({'error': 'Invalid token', 'message': 'Google token did not contain an email address.'}), 400
            
        user_doc = users_collection.find_one({'email': email})
        
        if not user_doc:
            return jsonify({
                'error': 'Unauthorized',
                'message': 'This Google account is not registered. Please sign up first using the registration form.'
            }), 401
            
        user = serialize_doc(user_doc)
            
        jwt_token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'Logged in successfully with Google',
            'token': jwt_token,
            'user': user
        }), 200
        
    except ValueError as e:
        return jsonify({'error': 'Unauthorized', 'message': f'Invalid Google token: {str(e)}'}), 401
    except Exception as e:
        return jsonify({'error': 'Server error', 'message': str(e)}), 500
