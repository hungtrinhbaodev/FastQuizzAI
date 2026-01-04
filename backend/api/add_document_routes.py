import os
import uuid
from app import App
from flask import Blueprint, jsonify, request, send_from_directory
from data.document_data import Document_Data
import time

add_document_bp = Blueprint('add_docuement_api', __name__)

DOCUMENTS_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'documents')

# --- API Endpoints ---
@add_document_bp.route('/add-document-api', methods=['POST'])
def add_document():

    if 'user_id' not in request.form or 'document' not in request.files:
        return jsonify({"error": "Missing user_id or document"}), 400
    
    if 'doc_name' not in request.form or 'doc_tag' not in request.form:
        return jsonify({"error": "Missing doc_name or doc_tag"}), 400

    app = App.get_instance()
    app_data = app.get_app_data()
    user_id = request.form['user_id']
    document_file = request.files['document']

    if user_id != app_data.current_user:
        return jsonify({"error": f"User '{user_id}' is not logged in"}), 401

    doc_id = str(uuid.uuid4())
    os.makedirs(DOCUMENTS_FOLDER, exist_ok=True)
    _, f_ext = os.path.splitext(document_file.filename)
    document_filename = f"{doc_id}{f_ext or '.pdf'}"
    document_file.save(os.path.join(DOCUMENTS_FOLDER, document_filename))
    document_url = f"/api/assets/documents/{document_filename}"
    created_time = time.time_ns() // 1_000_000

    document = Document_Data(
        name=request.form['doc_name'],
        user_id=user_id,
        id=doc_id,
        tag=request.form['doc_tag'],
        url=document_url,
        created_time=created_time
    )
    app.add_doc(document)

    return jsonify({
        "message": "Document added successfully",
        "doc_data": document.get_dict()
    }), 201
    
@add_document_bp.route('/assets/documents/<path:filename>', methods=['GET'])
def get_avatar(filename):
    return send_from_directory(DOCUMENTS_FOLDER, filename)


@add_document_bp.route('/remove-document-api', methods=['POST'])
def remove_document():
    
    if 'user_id' not in request.form or 'doc_id' not in request.form:
        return jsonify({"error": "Missing user_id or doc_id"}), 400

    user_id = request.form['user_id']
    doc_id = request.form['doc_id']

    app = App.get_instance()
    doc = app.get_doc_by(doc_id)
    
    if doc is None:
        return jsonify({"error": "Document not found"}), 404
    
    if doc.belong_to != user_id:
        return jsonify({"error": "You do not have permission to remove this document"}), 403
    
    try:
        file_name = os.path.basename(doc.url)
        file_path = os.path.join(DOCUMENTS_FOLDER, file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Error removing file: {e}")

    app.remove_doc(doc_id)

    return jsonify({
        "message": "Document removed successfully"
    }), 201
