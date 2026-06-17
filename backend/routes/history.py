from flask import Blueprint, request, jsonify
import json
import datetime
from models import histories_collection, serialize_doc
from utils.auth_middleware import token_required

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('/', methods=['GET'])
@token_required
def get_history(current_user):
    """Get all history records for the authenticated user"""
    try:
        # Sort by timestamp descending
        cursor = histories_collection.find({'user_id': current_user['id']}).sort('timestamp', -1)
        histories = [serialize_doc(doc) for doc in cursor]
        
        # Ensure recommendation is parsed if it was stored as string
        for h in histories:
            if isinstance(h.get('recommendation_json'), str):
                h['recommendation'] = json.loads(h['recommendation_json'])
                del h['recommendation_json']
                
        return jsonify(histories), 200
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
        new_history = {
            'user_id': current_user['id'],
            'image_url': data.get('image_url'), # Using URL for cloudinary
            'predicted_class': data['predicted_class'],
            'confidence': float(data['confidence']),
            'severity_index': int(data['severity_index']),
            'recommendation_json': json.dumps(data['recommendation']),
            'timestamp': datetime.datetime.utcnow().isoformat()
        }
        
        result = histories_collection.insert_one(new_history)
        new_history['id'] = str(result.inserted_id)
        del new_history['_id']
        
        # Format for response
        new_history['recommendation'] = json.loads(new_history['recommendation_json'])
        del new_history['recommendation_json']
        
        return jsonify({
            'message': 'History saved successfully',
            'history': new_history
        }), 201
    except Exception as e:
        return jsonify({'error': 'Failed to save history', 'message': str(e)}), 500
