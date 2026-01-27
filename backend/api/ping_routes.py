from flask import Blueprint, jsonify
import time
import threading
import os
import signal

last_ping = time.time()


def manage_ping():
    global last_ping
    while True:
        time.sleep(1)
        if time.time() - last_ping > 10:
            os.kill(os.getpid(), signal.SIGINT)


ping_api_bp = Blueprint("ping_api", __name__)


@ping_api_bp.route("/ping-api", methods=["GET"])
def ping():
    global last_ping
    last_ping = time.time()
    return jsonify({"message": "pong"}), 200
