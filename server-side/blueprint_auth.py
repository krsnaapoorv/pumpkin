from flask import Flask
from flask import Blueprint
from flask import request, make_response, jsonify
import base64
import json
import hashlib
import os
import jwt
from flask_mysqldb import MySQL

auth = Blueprint("auth", __name__)
app = Flask(__name__)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Kushal#025'
app.config['MYSQL_DB'] = 'pumpkin'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

def md5_hash(string):
    hash = hashlib.md5()
    hash.update(string.encode('utf-8'))
    return hash.hexdigest()

def generate_salt():
    salt = os.urandom(16)
    return base64.b64encode(salt)

def check_duplicate(email):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT COUNT(uid) FROM users WHERE email = %s """,(email,)
    )
    email_count = cursor.fetchone()['COUNT(uid)']
    cursor.close()
    return {"email_count": email_count}


@auth.route('/signup', methods = ['POST'])
def admin_creation():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    username = request.json['username']
    user_type = request.json['user_type']
    check = check_duplicate(email)
    cursor = mysql.connection.cursor()
    try:
        if check['email_count'] >= 1:
            return {"message": "Email Already exist"}
        else:
            salt = str(generate_salt())
            pass_string = salt+password
            new_pass = ""
            for i in range(15):
                new_pass = md5_hash(pass_string)
                pass_string = new_pass
            cursor.execute(
                """INSERT INTO users(name,email,username,password,salt,user_type)
                VALUES(%s, %s, %s, %s, %s, %s) """, (name,email,username,new_pass,salt,user_type)
                )
            mysql.connection.commit()
            return {"message": "user created"}
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@auth.route('/signin', methods = ['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT salt FROM users where username = %s """,(username,)
    )
    salt = cursor.fetchone()
    if salt is None:
        return jsonify({"message": "Username Doesn't Exist"})
    else:
        cursor.execute(
        """SELECT salt FROM users where username = %s """,(username,)
        )
        salt_check = cursor.fetchone()['salt']
        pass_string = salt_check+password
        new_pass = ""
        for i in range(15):
            new_pass = md5_hash(pass_string)
            pass_string = new_pass
        cursor.execute(
            """SELECT password FROM users where username = %s """,(username,)
        )
        password_data = cursor.fetchone()['password']
        if pass_string == password_data:
            cursor.execute(
            """SELECT uid FROM users where username = %s """,(username,)
            )
            uid = cursor.fetchone()['uid']
            cursor.execute(
            """SELECT name FROM users where username = %s """,(username,)
            )
            name = cursor.fetchone()['name']
            cursor.execute(
            """SELECT user_type FROM users where username = %s """,(username,)
            )
            user_type = cursor.fetchone()['user_type']
            encode_data = jwt.encode({"uid": uid}, 'masai', algorithm='HS256')
            return jsonify({"token": str(encode_data),"message": "Login Successful","name":name,"user_type":user_type})
        else:
            return jsonify({"message": "Wrong Credentials"})
    cursor.close()