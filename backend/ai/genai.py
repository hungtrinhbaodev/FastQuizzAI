from google import genai
import time
import os
from pathlib import Path
import uuid
from google.genai import types
from const import APP_CONF

client = genai.Client(api_key=APP_CONF['DEFAUL_API_KEY'])

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

def generate_quiz_from_docs(file_paths, categories, num_questions = 5, save_name = "./assets/respone_gennai/law_quiz.json"):

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
            upload_doc = client.files.upload(file=file_path, config={"display_name": doc_name})
            while upload_doc.state.name == "PROCESSING":
                print(f"Processing upload file {doc_name}")
                time.sleep(1)
            uploaded_docs.append(upload_doc)
        else:
            uploaded_doc = get_doc(doc_name)
            uploaded_docs.append(uploaded_doc)

        doc_names.append(doc_name)

    prompt = f"""
            You are a quiz generator. I have uploaded documents: {", ".join(doc_names)}.
            Categories: {", ".join(categories)}.

            TASK:
            1. Generate {num_questions} questions based strictly on the uploaded content.
            2. The 'question_text' and 'options' must be in the same language as the document.
            3. The 'explanation_vi' must be in Vietnamese (Tiếng Việt).
            4. Each question must have exactly 4 distinct options.

            OUTPUT FORMAT:
            Return ONLY a valid JSON object.
            Structure:
            {{
            "quiz_results": [
                {{
                "doc_source": "string",
                "category": "string",
                "question_text": "string",
                "options": ["option 1", "option 2", "option 3", "option 4"],
                "correct_answer": "string",
                "explanation_vi": "string"
                }}
            ]
            }}
            """

    response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
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

