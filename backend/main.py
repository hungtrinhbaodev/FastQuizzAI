from flask import Flask
from flask_cors import CORS

# Import the blueprint from our new routes file
from api.quiz_routes import quiz_bp
from api.login_routes import login_bp
from api.create_account_routes import create_account_bp
from api.add_document_routes import add_document_bp
from api.get_documents import get_documents_bp
from api.create_exam_routes import create_exam_bp
from api.get_exams_routers import get_exams_bp


# 1. Set up Flask App
app = Flask(__name__)

# 2. Configure CORS to allow requests from your React app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# 3. Register the blueprint
# All routes defined in quiz_bp will now be accessible under the /api prefix.
app.register_blueprint(quiz_bp, url_prefix='/api')
app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(create_account_bp, url_prefix='/api')
app.register_blueprint(add_document_bp, url_prefix='/api')
app.register_blueprint(get_documents_bp, url_prefix='/api')
app.register_blueprint(get_exams_bp, url_prefix='/api')
app.register_blueprint(create_exam_bp, url_prefix='/api')

# 4. Run the server on port 8000
if __name__ == '__main__':
    app.run(port=8000, debug=True)
