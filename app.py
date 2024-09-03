from cs50 import SQL
from dotenv import load_dotenv
from flask import Flask, redirect, render_template, request, session, jsonify
from flask_mail import Mail, Message
from flask_session import Session
import os
import random

from helpers import apology, login_required

# Configure application
app = Flask(__name__)
app.secret_key = 'X3H38-RQ09T-65BV0-TSSZU-QVB8N'

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Flask-Mail configuration
load_dotenv()

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)

otp = None

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///users.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Index Page"""
    users = db.exeucute("SELECT * FROM users WHERE id = ?", session['user_id'])

    if len(users) == 0:
        return redirect("/logout")

    return render_template("index.html", user=users[0])


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """Register user"""
    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Login user"""
    return render_template("login.html")


@app.route("/email_exists", methods=["POST"])
def email_exists():
    """Check if email exists"""
    data = request.get_json()
    email = data.get("email")

    if db.execute("SELECT * FROM users WHERE email = ?", email):
        return jsonify({"email_exists": True})

    return jsonify({"email_exists": False})


@app.route("/send_otp", methods=["POST"])
def send_otp():
    """Send OTP to email"""
    data = request.get_json()
    email = data.get("email")
    print(email)

    global otp
    otp = random.randint(100000, 999999)

    if app.config['MAIL_USERNAME'] and email:
        msg = Message('OTP Verification', sender=app.config['MAIL_USERNAME'], recipients=[email])
        msg.body = f'Your OTP is: {otp}'
        try:
            mail.send(msg)
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)})
    else:
        return jsonify({"success": False, "error": "Invalid email or sender"})



@app.route("/verify_otp", methods=["POST"])
def verify_otp():
    """Verify OTP"""
    try:
        entered_otp = request.form.get("otp")

        if otp and int(entered_otp) == otp:
            return jsonify({"success": True})

        return jsonify({"success": False})

    except:
        return jsonify({"success": False})


@app.route("/logout")
def logout():
    """Logout User"""
    session.clear()
    return redirect("/login")


if __name__ == "__main__":
    app.run(debug=True)