from flask import Blueprint, jsonify, request
from app import App

get_documents_bp = Blueprint('get-documents-api', __name__)

@get_documents_bp.route('/get-documents-api', methods=['POST'])
def get_documents():

    print("request", request.form)

    if 'user_id' not in request.form:
        return jsonify({'error': 'Not found user id to get docs!'}), 400
    
    app = App.get_instance()
    app_data = app.get_app_data()
    user_id = request.form['user_id']

    if user_id != app_data.current_user:
        return jsonify({
            'error': f"'{user_id}' is not login!"
        }), 400
    
    docs = app.get_docs()
    docs_data = []
    for doc in docs:
        docs_data.append(doc.get_dict())
    
    return jsonify({
        "message": "get all docs success!",
        "docs_data": docs_data
    }), 201
    
    
