"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Alejandro"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    user_duplicates = User.query.filter_by(email=email, password=password).first()
    
    if user_duplicates:
        return jsonify({"error": "User already exists"}), 400

    new_user = User(
        name=name,
        email=email,
        password=password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Error email or password"}), 400

    user = User.query.filter_by(email=email, password=password).first()

    if not user:
        return jsonify({"error": "Unauthorized access"}), 401

    token = create_access_token(identity=user.email)

    return jsonify({'token': token}), 200

@api.route('/private', methods=['GET'])
@jwt_required()
def private():    
    current_user = get_jwt_identity()
    return jsonify({"logged": current_user}), 200
