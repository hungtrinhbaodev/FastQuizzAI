import os
import uuid
from app import App
from data.user_data import User_Data
from flask import Blueprint, jsonify, request, send_from_directory
from const import APP_STATE

create_account_bp = Blueprint('create_account_api', __name__)

# --- Database Helper Functions (using a simple JSON file) ---
AVATAR_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'avatars')

# --- API Endpoints ---
@create_account_bp.route('/create-account-api', methods=['POST'])
def create_account():
    """
    Creates a new user account. Expects 'userName' and 'avatar' in a multipart/form-data request.
    """

    if 'userName' not in request.form or 'avatar' not in request.files:
        return jsonify({"error": "Missing userName or avatar"}), 400

    app = App.get_instance()
    users = app.get_users()

    userName = request.form['userName']
    avatar_file = request.files['avatar']

    if userName in users:
        return jsonify({"error": f"User '{userName}' already exists"}), 409

    user_id = str(uuid.uuid4())
    os.makedirs(AVATAR_FOLDER, exist_ok=True)
    _, f_ext = os.path.splitext(avatar_file.filename)
    avatar_filename = f"{user_id}{f_ext or '.jpg'}"
    avatar_file.save(os.path.join(AVATAR_FOLDER, avatar_filename))
    avatar_url = f"/api/assets/avatars/{avatar_filename}"

    new_user = User_Data(i_id=str(user_id), i_name=userName, i_avatar=avatar_url)
    app.add_user(new_user)

    app_data = app.get_app_data()
    app_data.app_state = APP_STATE.IDLE.value
    app_data.current_user = new_user.id
    app.save_app_data()

    return jsonify({
        "app_data": app_data.get_dict(),
        "current_user": new_user.get_dict() 
    }), 201

@create_account_bp.route('/assets/avatars/<path:filename>', methods=['GET'])
def get_avatar(filename):
    return send_from_directory(AVATAR_FOLDER, filename)