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
from const import APP_CONF

import subprocess
import threading

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

open_frontend = None
subs_process = []

if APP_CONF['BUILD_MODE'] == 'Live':
    open_frontend = subprocess.Popen([
        'npx',
        'serve'
    ], shell=True)
    subs_process.append(open_frontend)

threading.Thread(target=manage_ping, args=(
    [subs_process]), daemon=True).start()

# 4. Run the server on port 8000
if __name__ == '__main__':
    debug = True
    if APP_CONF['BUILD_MODE'] == 'Live':
        debug = False
    app.run(port=8000, debug=debug)
