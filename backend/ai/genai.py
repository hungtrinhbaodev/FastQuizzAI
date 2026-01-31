from google import genai
import time
import os
from pathlib import Path
import uuid
from google.genai import types
from const import APP_CONF

client = genai.Client(api_key=APP_CONF['DEFAUL_API_KEY'])


def show_all_models():
    models = client.models.list()
    for m in models:
        print(f"Name: {m.name}")


def list_my_uploaded_files():
    print("--- Current Files on Gemini Servers ---")
    files = client.files.list()
    for f in files:
        print(f"Display Name: {f.display_name}")
        print(f"File Name (ID): {f.name}")
        print(f"Status: {f.state.name}")
        print("-" * 30)


def need_upload_file(file_path):
    # 1. Check if it's already there
    existing_files = client.files.list()
    for f in existing_files:
        if f.display_name == file_path:
            return False
    return True


def get_doc(file_path):
    # 1. Check if it's already there
    existing_files = client.files.list()
    for f in existing_files:
        if f.display_name == file_path:
            return f
    return f


def generate_quiz_from_docs(file_paths, categories, num_questions=5, save_name="./assets/respone_gennai/law_quiz.json"):

    # check all files need to be uploaded is exist
    for file_path in file_paths:
        if not os.path.exists(file_path):
            print(f"❌ Error can't not found file in local: {file_path}")
            return (False, f"Not found file name:  {file_path}")

    # 1. Upload all files from assets folder to cloude
    uploaded_docs = []
    doc_names = []
    for file_path in file_paths:

        doc_name = os.path.basename(file_path)

        if need_upload_file(file_path):
            print(f"Uploading file name {doc_name}")
            upload_doc = client.files.upload(
                file=file_path, config={"display_name": doc_name})
            while upload_doc.state.name == "PROCESSING":
                print(f"Processing upload file {doc_name}")
                time.sleep(1)
            uploaded_docs.append(upload_doc)
        else:
            uploaded_doc = get_doc(doc_name)
            uploaded_docs.append(uploaded_doc)

        doc_names.append(doc_name)

    prompt = f"""
        You are an expert Educational Assessment Specialist. Your goal is to generate high-quality multiple-choice questions (MCQs) that accurately test deep understanding.

        DOCUMENTS: {", ".join(doc_names)}
        CATEGORIES: {", ".join(categories)}

        TASK:
        1. Generate EXACTLY {num_questions} questions.
        2. SOURCE GROUNDING: Every question MUST be based directly on facts found in the provided documents. Do not use outside knowledge.
        3. LANGUAGE:
        - 'question_text' and 'options': Must be in the same language as the source document.
        - 'explanation_vi': Must be in Vietnamese (Tiếng Việt).
        4. DISTRIBUTION RULE (CRITICAL): You must distribute questions evenly across ALL provided documents. 
        - Every document in the list {", ".join(doc_names)} MUST have at least one question.
        - For each question, look for unique facts in a specific document that haven't been used yet.
        5. OPTION QUALITY (CRITICAL):
        - Provide exactly 4 options.
        - ONLY ONE option must be correct.
        - DISTRACTOR RULES: The 3 incorrect options (distractors) must be PLAUSIBLE. They should represent common misconceptions, related but incorrect concepts from the text, or logical errors. 
        - AVOID: Do not simply add "not" to a correct statement. Avoid "always", "never", "all of the above", or "none of the above".
        6. EXPLANATION: The 'explanation_vi' must explain WHY the correct answer is right and WHY the specific distractors are wrong based on the document.
        7. doc_source key must be have value is name of doc in DOCUMENTS input 

        OUTPUT FORMAT:
        Return ONLY a valid JSON object. Do not include markdown blocks or extra text.
        Structure:
        {{
        "quiz_results": [
            {{
            "doc_source": "string",
            "category": "string",
            "question_text": "string",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "the exact text of the correct option",
            "explanation_vi": "Detailed explanation in Vietnamese"
            }}
        ]
        }}
        """

    response = client.models.generate_content(
        model="models/gemini-3-flash-preview",
        contents=[*uploaded_docs, prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    folder_path = os.path.dirname(save_name)
    if not os.path.exists(folder_path):
        folder = Path(folder_path)
        folder.mkdir(parents=True, exist_ok=True)

    with open(save_name, "w", encoding="utf-8") as f:
        f.write(response.text)
