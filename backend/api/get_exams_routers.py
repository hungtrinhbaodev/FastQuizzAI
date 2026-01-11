from flask import Blueprint, request, jsonify
from app import App

get_exams_bp = Blueprint("get_exams_api", __name__)

@get_exams_bp.route("/get-exams-api", methods=["POST"])
def get_exams():

    if "user_id" not in request.form:
        return
    
    user_id = request.form["user_id"]
    app = App.get_instance()

    if user_id != app.get_current_user().id:
        return  jsonify({
            "error": f"'{user_id}' is not login!"
        }), 400
    
    exams = app.get_exams()
    exams_data = []
    for exam in exams:
        exams_data.append(exam.get_dict())

    print(exams_data)

    return jsonify({
        "message": "get all exams success!",
        "exams_data": exams_data
    }), 201