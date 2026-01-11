from flask import Blueprint, jsonify, request
from data.exam_data import Exam_Data
from app import App
from ai import genai
import uuid
import os
from const import DOCUMENTS_FOLDER, EXAM_FOLDER, DOCUMENT_TAG
import json

def get_document_path(doc_url):
    return os.path.join(DOCUMENTS_FOLDER, os.path.basename(doc_url))

create_exam_bp = Blueprint('create_exam_api', __name__)

@create_exam_bp.route('/create-exam-api', methods=['POST'])
def create_exam():

    if 'user_id' not in request.form:
        return jsonify({'error': 'Not found user id to create exam!'}), 400
    
    app = App.get_instance()
    app_data = app.get_app_data()
    user_id = request.form['user_id']

    if user_id != app_data.current_user:
        return jsonify({
            'error': f"'{user_id}' is not login!"
        }), 400
    
    exam_data = Exam_Data()
    exam_data.id = str(uuid.uuid4())
    exam_data.user_id = request.form['user_id']
    exam_data.name = request.form['exam_name']
    exam_data.document_ids = json.loads(request.form.get('document_ids'))
    exam_data.number_question = request.form['number_question']
    exam_data.exam_duration = request.form['exam_duration']

    # Gen quiz by data here
    doc_urls = []
    doc_categories = []
    for doc_id in exam_data.document_ids:
        doc_data = app.get_doc_by(doc_id=doc_id)
        if (doc_data):
            doc_urls.append(get_document_path(doc_data.url))
            doc_categories.append(
                DOCUMENT_TAG.get_tag_name(doc_data.tag)
            )

    path_asset = os.path.join(EXAM_FOLDER, str(uuid.uuid4()) + ".json")
    genai.generate_quiz_from_docs(
        doc_urls,
        doc_categories,
        exam_data.number_question,
        path_asset
    )
    exam_data.exam_path = path_asset

    app.add_exam(exam_data)

    return jsonify({
        "message": "create exam success!",
        "exam_data": exam_data.get_dict()
    }), 201

@create_exam_bp.route('/remove-exam-api', methods=['POST'])
def remove_exam():

    print("Go here 1")

    if 'user_id' not in request.form or 'exam_id' not in request.form:
        return jsonify({'error': 'Not found user id to remove exam!'}), 400
    
    if 'exam_id' not in request.form:
        return jsonify({'error': 'Not found exam id to remove exam!'}), 400

    app = App.get_instance()
    exam_id = request.form['exam_id']
    exam = app.get_exam_by(exam_id)

    if exam is None:
        return jsonify({'error': 'Not found exam!'}), 400
    
    user_id = request.form['user_id']

    if exam.user_id != user_id:
        return jsonify({
            'error': f"'{user_id}' is not login!"
        }), 400

    try:
        if os.path.exists(exam.exam_path):
            os.remove(exam.exam_path)
    except Exception as e:
        print(f"Error removing file: {e}")
    
    app.remove_exam(exam_id)

    return jsonify({
        "message": "remove exam success!"
    }), 201

