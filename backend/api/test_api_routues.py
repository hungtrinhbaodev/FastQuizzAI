from flask import Blueprint, request, jsonify
import random
from app import App
from const import VIEW_EXAM_DETAIL_MODE

test_api_bp = Blueprint("test_api", __name__)

@test_api_bp.route("/test-question-api", methods=['GET'])
def get_random_question():
    app = App.get_instance()
    exams = app.get_exams()

    if len(exams) <= 0:
        return jsonify({"error": "not have exam to get random question"}), 400
    
    exam = exams[0]
    exam_detail = app.get_detail_exam(exam.id)

    if exam_detail is None:
        return jsonify({"error": "can load random exam detail"}), 400
    
    questions = exam_detail.get_questions()
    rand_question = questions[0]

    return jsonify({
        "question_data": rand_question.get_dict(VIEW_EXAM_DETAIL_MODE.FULL.value),
        "detail_view_mode": VIEW_EXAM_DETAIL_MODE.FULL.value
    }), 201
    

    