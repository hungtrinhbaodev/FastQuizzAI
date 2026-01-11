from flask import Blueprint, request, jsonify
from app import App
from const import APP_STATE, VIEW_EXAM_DETAIL_MODE
import utils


do_exam_bp = Blueprint("do_exam_api", __name__)

@do_exam_bp.route("/do-exam-api", methods=["POST"])
def do_exam():

    if "user_id" not in request.form:
        return jsonify({"error": "Missing user_id"}), 400
    
    if "exam_id" not in request.form:
        return jsonify({"error": "Missing exam_id"}), 400
    
    app = App.get_instance()
    app_data = app.get_app_data()

    if app_data.app_state == APP_STATE.EXEMING.value:
        return jsonify("error: App still in examing phase"), 400
    
    if app_data.app_state == APP_STATE.NO_LOGIN.value:
        return jsonify("error: App not login"), 400
    
    user_id = request.form["user_id"]

    if user_id != app_data.current_user:
        return jsonify({
            "error": f"'{user_id}' is not login!"
        }), 400

    exam_id = request.form["exam_id"]
    exam = app.get_exam_by(exam_id)

    if exam is None:
        return jsonify({"error": "Exam not found"}), 404
    
    if exam.user_id != user_id:
        return jsonify({"error": "You do not have permission to do this exam"}), 403
    
    app.update_examing_data(exam_id)
    app_data.app_state = APP_STATE.EXEMING.value
    app.save_app_data()

    exam_detail = app.get_exam_info(exam_id)
    examing_data = app.get_examing_data()

    return jsonify({
        "exam_detail": exam_detail.get_dict(detail_mode=VIEW_EXAM_DETAIL_MODE.DOING.value),
        "examing_data": examing_data.get_dict()
    }), 201

@do_exam("/chosen_anwser-api", methods=["POST"])
def chosen_anwser():

    if 'user_id' not in request.form:
        return jsonify({"error": "Missing user_id"})
    
    app = App.get_instance()
    app_data = app.get_app_data()
    user_id = request.form['user_id']

    if user_id != app_data.current_user:
        return jsonify({
            'error': f"'{user_id}' is not login!"
        }), 400
    
    if app_data.app_state != APP_STATE.EXEMING.value:
        return jsonify({"error": "App not in examing phase"}), 400

    index_question = request.form['index_question']
    answer = request.form['answer']

    examing_data = app.get_examing_data()

    if examing_data.get_remaining_time() <= 0:

        exam_history = app.process_finish_exam()

        if not exam_history is None:
            return jsonify({
                "app_state": app_data.app_state,
                "exam_history": exam_history.get_dict()
            }), 201
        
        return jsonify({
            "error": "Fail to get result exam when end time !"
        }), 401

    examing_data.update_anwser(index_question, answer)

    return jsonify({
        "app_state": app_data.app_state,
        "message": "Update answer successfully"
    }), 201

@do_exam.route("/submit-exam-api", methods=["POST"])
def submit_exam():

    if 'user_id' not in request.form:
        return jsonify({"error": "Missing user_id"})
    
    app = App.get_instance()
    app_data = app.get_app_data()
    user_id = request.form['user_id']

    if user_id != app_data.current_user:
        return jsonify({
            'error': f"'{user_id}' is not login!"
        }), 400
    
    exam_history = app.process_finish_exam(utils.get_currrent_millisecond())

    if not exam_history is None:
        return jsonify({
            "app_state": app_data.app_state,
            "exam_history": exam_history.get_dict()
        }), 201
    
    return jsonify({
        "error": "Fail to get result exam when end time !"
    }), 401

    

