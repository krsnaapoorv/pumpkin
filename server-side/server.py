from flask import Flask
from flask import request, make_response, jsonify
from blueprint_auth import auth
from flask_mysqldb import MySQL
from werkzeug.datastructures import ImmutableMultiDict
import json
import jwt

app =Flask(__name__)
app.register_blueprint(auth, url_prefix = "/auth")

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Kushal#025'
app.config['MYSQL_DB'] = 'pumpkin'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)


def check_download(upid):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT total_downloads FROM uploads WHERE upid = %s""",(upid,)
    )
    total_downloads = cursor.fetchone()['total_downloads']
    cursor.close()
    return {"total_downloads": total_downloads}

def getCategoryCount(category):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT COUNT(upid) FROM uploads join category on uploads.cid = category.cid WHERE category.cname= %s""",(category,)
    )
    page_count = cursor.fetchone()['COUNT(upid)']
    cursor.close()
    return {"page_count": page_count}

@app.route("/getCategory", methods = ["GET"])
def categories():
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT * FROM category"""
        )
        results = cursor.fetchall()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"categories":items})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()
    

@app.route('/downloaded', methods = ['PUT'])
def download():
    upid = request.json['upid']
    check = check_download(upid)
    update_no_of_download = check['total_downloads']+1
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """UPDATE uploads SET total_downloads = %s WHERE upid = %s""",(update_no_of_download,upid,)
        )
        mysql.connection.commit()
        return {"message": "Downloaded"}
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route("/categoryFilter", methods = ["POST"])
def filter_based_on_category():
    category = request.json['category']
    clickVal = request.json['clickVal']
    geteach = clickVal*2
    cursor = mysql.connection.cursor()
    try:
        if category == "all":
            cursor.execute(
                """SELECT COUNT(upid) FROM uploads"""
            )
            page_count = cursor.fetchone()['COUNT(upid)']
            cursor.execute(
                """SELECT users.name, category.cname,uploads.upid, uploads.iname, uploads.image, uploads.total_downloads from uploads join users on uploads.uid = users.uid join category on uploads.cid = category.cid  LIMIT %s,2""",(geteach,)
            )
        else:
            val = getCategoryCount(category)
            page_count = val["page_count"]
            cursor.execute(
                """SELECT users.name, category.cname,uploads.upid, uploads.iname, uploads.image, uploads.total_downloads from uploads join users on uploads.uid = users.uid join category on uploads.cid = category.cid WHERE category.cname = %s  LIMIT %s,2""",(category,geteach,)
            )
        results = cursor.fetchall()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"pictures":items,"page_count":page_count})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route("/upload", methods = ["POST"])
def imageUploader():
    data = dict(request.form)
    cid = str(data['cid'][0])
    iname = str(data['iname'][0])
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    val = str(decode_data['uid'])
    f = request.files['picture']
    # print(f.filename) 
    location = "/home/apoorva/pumpkin/client-side/public/images/" + f.filename
    img_url = "/" + f.filename
    f.save(location)
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """INSERT INTO uploads(iname,cid,uid,image,total_downloads) VALUES(%s, %s, %s, %s, %s)""",(iname,cid,val,img_url,0)
        )
        mysql.connection.commit()
        return {"message": "Image Uploaded"}
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()

@app.route("/myReport", methods = ["POST"])
def ShowMyReport():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    val = str(decode_data['uid'])
    clickVal = request.json['clickVal']
    geteach = clickVal*2
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT COUNT(upid) FROM uploads WHERE uid = %s""",(val)
        )
        page_count = cursor.fetchone()['COUNT(upid)']
        cursor.execute(
            """SELECT users.name, category.cname,uploads.upid, uploads.iname, uploads.image, uploads.total_downloads from uploads join users on uploads.uid = users.uid join category on uploads.cid = category.cid  WHERE uploads.uid = %s LIMIT %s,2""",(val,geteach)
        )
        results = cursor.fetchall()
        items = []
        for i in results:
            items.append(i)
        return jsonify({"report":items,"page_count":page_count})
    except Exception as e:
        print(e)
        return jsonify({"error":"check"})
    finally:
        cursor.close()
