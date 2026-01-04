from google import genai
import time
import os

client = genai.Client(api_key="AIzaSyB-lejPT7UDg_KAb0i-pme_XB10g-cFbd4")

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

def generate_quiz_from_law_doc(file_path, num_questions = 5, save_name = "./assets/respone_gennai/law_quiz.json"):
    
    # Kiểm tra xem file có tồn tại không
    if not os.path.exists(file_path):
        print(f"❌ Lỗi: Không tìm thấy file tại {file_path}")
        return

    # 1. Upload the local PDF/Document
    law_doc = None
    if need_upload_file(file_path):
      print("Đang tải tài liệu...")
      law_doc = client.files.upload(file=file_path, config={'display_name': file_path})

      # 2.1. Wait for the file to be processed (Legal PDFs can be heavy)
      while law_doc.state.name == "PROCESSING":
          print("Đang xử lý tài liệu...")
          time.sleep(2)
          law_doc = client.files.get(name=law_doc.name)
    else:
      # 2.2. if it's already there
      law_doc = get_doc(file_path)
      print(f"✅ Tài liệu tại {file_path} đã được tải lên.")

    # 3. Prompt Gemini to create a quiz based ONLY on this file
    prompt = f"""Dựa trên tài liệu luật này, hãy tạo {num_questions} câu hỏi trắc nghiệm bằng tiếng Việt. " \
             "Gửi kèm đáp án và giải thích chi tiết trích dẫn từ điều luật trong tài liệu."""

    print("Đang tạo câu hỏi...")
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=[law_doc, prompt],
        config={"response_mime_type": "application/json"}
    )

    # 4. Save locally
    with open(save_name, "w", encoding="utf-8") as f:
        f.write(response.text)
    
    print("✅ Đã tạo xong quiz từ tài liệu luật của bạn!")

