from flask import Blueprint, request, jsonify
import json
from models import db, History
from utils.auth_middleware import token_required

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('/', methods=['GET'])
@token_required
def get_history(current_user):
    """Get all history records for the authenticated user"""
    try:
        histories = History.query.filter_by(user_id=current_user.id).order_by(History.timestamp.desc()).all()
        return jsonify([h.to_dict() for h in histories]), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch history', 'message': str(e)}), 500

@history_bp.route('/', methods=['POST'])
@token_required
def save_history(current_user):
    """Save a new scan result to history"""
    data = request.get_json()
    
    required = ['predicted_class', 'confidence', 'severity_index', 'recommendation']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing data', 'message': 'Incomplete history payload.'}), 400
        
    try:
        new_history = History(
            user_id=current_user.id,
            image_filename=data.get('image_filename'),
            predicted_class=data['predicted_class'],
            confidence=float(data['confidence']),
            severity_index=int(data['severity_index']),
            recommendation_json=json.dumps(data['recommendation'])
        )
        
        db.session.add(new_history)
        db.session.commit()
        
        return jsonify({
            'message': 'History saved successfully',
            'history': new_history.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to save history', 'message': str(e)}), 500
