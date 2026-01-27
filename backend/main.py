from flask import Flask
from flask_cors import CORS
import logging

# Import the blueprint from our new routes file
from api.quiz_routes import quiz_bp
from api.login_routes import login_bp
from api.create_account_routes import create_account_bp
from api.add_document_routes import add_document_bp
from api.get_documents import get_documents_bp
from api.create_exam_routes import create_exam_bp
from api.get_exams_routers import get_exams_bp
from api.test_api_routes import test_api_bp
from api.do_exam_routes import do_exam_bp
from api.get_exam_histories_routes import get_exam_histories_bp
from api.ping_routes import ping_api_bp, manage_ping
from const import APP_CONF, DEFAUL_PATH_PROJECT

import threading
import http.server
import socketserver
import os
import webbrowser

# 1. Set up Flask App
app = Flask(__name__)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# 2. Configure CORS to allow requests from your React app
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# 3. Register the blueprint
# All routes defined in quiz_bp will now be accessible under the /api prefix.
app.register_blueprint(quiz_bp, url_prefix='/api')
app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(create_account_bp, url_prefix='/api')
app.register_blueprint(add_document_bp, url_prefix='/api')
app.register_blueprint(get_documents_bp, url_prefix='/api')
app.register_blueprint(get_exams_bp, url_prefix='/api')
app.register_blueprint(create_exam_bp, url_prefix='/api')
app.register_blueprint(test_api_bp, url_prefix='/api')
app.register_blueprint(do_exam_bp, url_prefix='/api')
app.register_blueprint(get_exam_histories_bp, url_prefix='/api')
app.register_blueprint(ping_api_bp, url_prefix='/api')

def serve_frontend():
    # Change the directory to where your index.html is
    os.chdir(DEFAUL_PATH_PROJECT)
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    # allow_reuse_address is important so you don't get "Port in use" errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", 3000), Handler) as httpd:
        print(f"Frontend serving at http://localhost:{3000}")
        httpd.serve_forever()

# 4. Run the server on port 8000
if __name__ == '__main__':
    debug = True
    if APP_CONF['BUILD_MODE'] == 'Live':
        debug = False
        threading.Thread(target=serve_frontend, daemon=True).start()
        threading.Thread(target=manage_ping, daemon=True).start()
        
        url = "http://localhost:3000"
        print("Auto open frontend", url)
        webbrowser.open(url)

    # Now start your Backend code here...
    print("Backend starting...")
    app.run(port=8000, debug=debug)

