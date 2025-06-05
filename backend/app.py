from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
from datetime import datetime
import jwt
import os
from functools import wraps

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key')

# Mock database (replace with actual database in production)
users_db = {}
products_db = {}
reviews_db = {}
chats_db = {}
notifications_db = {}

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = users_db.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# Auth endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if data['email'] in users_db:
        return jsonify({'message': 'User already exists'}), 400
    
    user_id = str(len(users_db) + 1)
    users_db[data['email']] = {
        'id': user_id,
        'email': data['email'],
        'password': data['password'],  # In production, hash the password
        'created_at': datetime.utcnow().isoformat()
    }
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    user = users_db.get(data['email'])
    if not user or user['password'] != data['password']:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode(
        {'user_id': user['id']},
        app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )
    
    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email']
        }
    })

# Product endpoints
@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(list(products_db.values()))

@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    product = products_db.get(product_id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404
    return jsonify(product)

@app.route('/api/products', methods=['POST'])
@token_required
def create_product(current_user):
    data = request.get_json()
    if not data or not data.get('title') or not data.get('price'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    product_id = str(len(products_db) + 1)
    product = {
        'id': product_id,
        'title': data['title'],
        'description': data.get('description', ''),
        'price': data['price'],
        'seller_id': current_user['id'],
        'created_at': datetime.utcnow().isoformat()
    }
    products_db[product_id] = product
    
    return jsonify(product), 201

# Review endpoints
@app.route('/api/products/<product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    reviews = [r for r in reviews_db.values() if r['product_id'] == product_id]
    return jsonify(reviews)

@app.route('/api/products/<product_id>/reviews', methods=['POST'])
@token_required
def create_review(current_user, product_id):
    data = request.get_json()
    if not data or not data.get('rating') or not data.get('comment'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    review_id = str(len(reviews_db) + 1)
    review = {
        'id': review_id,
        'product_id': product_id,
        'user_id': current_user['id'],
        'rating': data['rating'],
        'comment': data['comment'],
        'created_at': datetime.utcnow().isoformat()
    }
    reviews_db[review_id] = review
    
    return jsonify(review), 201

# Notification endpoints
@app.route('/api/notifications', methods=['GET'])
@token_required
def get_notifications(current_user):
    notifications = [n for n in notifications_db.values() if n['user_id'] == current_user['id']]
    return jsonify(notifications)

@app.route('/api/notifications/<notification_id>/read', methods=['PUT'])
@token_required
def mark_notification_as_read(current_user, notification_id):
    notification = notifications_db.get(notification_id)
    if not notification or notification['user_id'] != current_user['id']:
        return jsonify({'message': 'Notification not found'}), 404
    
    notification['read'] = True
    return jsonify(notification)

# WebSocket events
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_auction')
def handle_join_auction(data):
    room = f"auction_{data['auction_id']}"
    socketio.join_room(room)

@socketio.on('leave_auction')
def handle_leave_auction(data):
    room = f"auction_{data['auction_id']}"
    socketio.leave_room(room)

@socketio.on('new_bid')
def handle_new_bid(data):
    room = f"auction_{data['auction_id']}"
    socketio.emit('bid_update', data, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000) 