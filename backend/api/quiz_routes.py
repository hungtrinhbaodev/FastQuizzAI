from flask import Blueprint, jsonify, request
from ai import genai
import json
import os

# 1. Create a Blueprint.
# The first argument, 'quiz_api', is the name of the blueprint.
# The second, __name__, helps Flask locate the blueprint's resources.
quiz_bp = Blueprint('quiz_api', __name__)

# 2. Create the API endpoint on the blueprint.
# The URL will be relative to the prefix we set in main.py
@quiz_bp.route('/generate-quiz', methods=['POST'])
def handle_generate_quiz():
    data = request.get_json()
    file_path = data.get('filePath')

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": f"File not found or filePath not provided: {file_path}"}), 400

    # Get the absolute path to the 'backend' directory
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    save_path = os.path.join(backend_dir, "assets", "respone_gennai", "law_quiz.json")

    try:
        # Call your existing function to generate and save the quiz
        genai.generate_quiz_from_law_doc(file_path=file_path, save_name=save_path)

        # Read the generated quiz file and return its content
        with open(save_path, 'r', encoding='utf-8') as f:
            quiz_data = json.load(f)
        
        return jsonify(quiz_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500