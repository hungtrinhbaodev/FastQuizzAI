from flask import Blueprint, jsonify
from app import App
from const import APP_STATE

login_bp = Blueprint('login_api', __name__)

# --- API Endpoints ---

@login_bp.route('/login-api', methods=['GET'])
def handle_login():
    """
    Handles the initial login check. For now, it assumes no user is logged in.
    A real implementation would check a session token.
    """
    app = App.get_instance()
    app_data = app.get_app_data()
    current_user = app.get_current_user()

    return jsonify({
        "app_data": app_data.get_dict(),
        "current_user": current_user.get_dict()
    }), 201