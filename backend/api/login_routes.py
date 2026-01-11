from flask import Blueprint, jsonify
from app import App
from const import APP_STATE, VIEW_EXAM_DETAIL_MODE

login_bp = Blueprint('login_api', __name__)

@login_bp.route('/login-api', methods=['GET'])
def handle_login():

    app = App.get_instance()
    app_data = app.get_app_data()
    current_user = app.get_current_user()

    login_data = {
            "app_data": app_data.get_dict(),
            "current_user": current_user.get_dict()
        }
    
    if app_data.app_state == APP_STATE.EXEMING.value:
        examing_data = app.get_examing_data()
        exam_detail = app.get_detail_exam(examing_data.exam_id)
        login_data["examing_data"] = examing_data.get_dict()
        login_data["exam_detail"] = exam_detail.get_dict(detail_mode=VIEW_EXAM_DETAIL_MODE.DOING.value)
    

    if app_data.app_state != APP_STATE.EXEMING.value:
        return jsonify(login_data), 201