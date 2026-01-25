from flask import Blueprint, jsonify
import os
import signal

shutdown_api_bp = Blueprint("shutdown_api", __name__)


@shutdown_api_bp.route("/shutdown-api", methods=["GET"])
def showdown():
    os.kill(os.getpid(), signal.SIGINT)
    return
