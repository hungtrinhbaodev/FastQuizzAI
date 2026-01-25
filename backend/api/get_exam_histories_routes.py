from flask import Blueprint, jsonify, request
from app import App
from const import VIEW_EXAM_DETAIL_MODE


get_exam_histories_bp = Blueprint("get_exam_histories_api", __name__)


@get_exam_histories_bp.route("/get-exam-histories-api", methods=["POST"])
def get_exam_histories():
    if "user_id" not in request.form:
        return jsonify({"error": "Missing user_id"}), 400

    user_id = request.form["user_id"]
    app = App.get_instance()
    app_data = app.get_app_data()

    if user_id != app_data.current_user:
        return jsonify({
            "error": f"'{user_id}' is not login!"
        }), 400

    exam_histories = app.get_exam_histories()
    exam_histories_data = []
    for exam_history in exam_histories:
        exam_histories_data.append(exam_history.get_dict())

    return jsonify({
        'exam_histories_data': exam_histories_data
    }), 201


@get_exam_histories_bp.route("/get-history-detail-api", methods=["POST"])
def get_history_detail():

    if "user_id" not in request.form:
        return jsonify({"error": "Missing user_id"}), 400

    user_id = request.form["user_id"]
    app = App.get_instance()

    if user_id != app.get_current_user().id:
        return jsonify({
            "error": f"'{user_id}' is not login!"
        }), 400

    history = app.get_exam_history_by(request.form["exam_history_id"])

    if history is None:
        return jsonify({"error": "History not found"}), 404

    exam_detail = app.get_detail_exam(history.exam_id)
    exam_detail_data = exam_detail.get_dict(VIEW_EXAM_DETAIL_MODE.FULL.value)

    return jsonify({
        "exam_detail": exam_detail_data
    }), 200


@get_exam_histories_bp.route("/remove-exam-history-api", methods=["POST"])
def remove_exam_history():
    if "user_id" not in request.form:
        return jsonify({"error": "Missing user_id"}), 400

    user_id = request.form["user_id"]
    app = App.get_instance()

    if user_id != app.get_current_user().id:
        return jsonify({
            "error": f"'{user_id}' is not login!"
        }), 400

    history_exam = app.get_exam_history_by(request.form["exam_history_id"])

    if history_exam is None:
        return jsonify({"error": "History not found"}), 404

    app.remove_history_exam_by(history_exam.id)

    return jsonify({
        "message": "remove exam success!"
    }), 200
