from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import base64, json, os
import numpy as np
import cv2
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ======================
# ROOT ROUTE (IMPORTANT)
# ======================
@app.route("/")
def home():
    return "🚀 Python Face API is LIVE on Render"

# ======================
# FILE STORAGE
# ======================
USERS_FILE = "users.json"
ATTENDANCE_FILE = "attendance.json"

# Ensure files exist
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w") as f:
        json.dump([], f)

if not os.path.exists(ATTENDANCE_FILE):
    with open(ATTENDANCE_FILE, "w") as f:
        json.dump([], f)


def load_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)


def save_users(data):
    with open(USERS_FILE, "w") as f:
        json.dump(data, f)


def load_attendance():
    with open(ATTENDANCE_FILE, "r") as f:
        return json.load(f)


def save_attendance(data):
    with open(ATTENDANCE_FILE, "w") as f:
        json.dump(data, f)


# ======================
# IMAGE CONVERT
# ======================
def base64_to_image(base64_str):
    img_data = base64.b64decode(base64_str.split(",")[1])
    np_arr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)


# ======================
# FACE EMBEDDING
# ======================
def get_embedding(image):
    try:
        result = DeepFace.represent(
            image,
            model_name="Facenet",
            detector_backend="opencv",
            enforce_detection=False
        )
        return result[0]["embedding"]
    except Exception as e:
        print("Embedding error:", e)
        return None


# ======================
# USER REGISTER
# ======================
@app.route("/user/register", methods=["POST"])
def user_register():
    data = request.json
    users = load_users()

    for u in users:
        if u["email"] == data["email"]:
            return jsonify({"error": "User already exists"}), 400

    users.append(data)
    save_users(users)

    return jsonify({"message": "Registered successfully"})


# ======================
# USER LOGIN
# ======================
@app.route("/user/login", methods=["POST"])
def user_login():
    data = request.json
    users = load_users()

    for u in users:
        if u["email"] == data["email"] and u["password"] == data["password"]:
            return jsonify({"message": "Login success", "user": u})

    return jsonify({"error": "Invalid credentials"}), 401


# ======================
# ADMIN LOGIN
# ======================
@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    if data["email"] == "admin@gmail.com" and data["password"] == "admin123":
        return jsonify({"message": "Admin login success"})

    return jsonify({"error": "Invalid admin"}), 401


# ======================
# MARK ATTENDANCE
# ======================
@app.route("/attendance", methods=["POST"])
def mark_attendance():
    try:
        data = request.json
        image = base64_to_image(data["image"])
        name = data["name"]

        embedding = get_embedding(image)

        if embedding is None:
            return jsonify({"error": "Face not detected"}), 400

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        record = {
            "name": name,
            "time": timestamp,
            "image": data["image"]
        }

        attendance = load_attendance()
        attendance.append(record)
        save_attendance(attendance)

        return jsonify({"message": "Attendance saved"})

    except Exception as e:
        print("Attendance error:", e)
        return jsonify({"error": "Server error"}), 500


# ======================
# FETCH ATTENDANCE
# ======================
@app.route("/attendance/all", methods=["GET"])
def get_attendance():
    return jsonify(load_attendance())


# ======================
# RUN APP
# ======================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)