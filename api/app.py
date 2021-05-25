import mysql.connector
from typing import List, Dict
from flask import Flask, make_response, jsonify, request
from flask_cors import CORS
import time
import json
import string
import random
import re

#! init
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}}) #Alt: Allow single path CORS with @cross_origin()
# config for db
config = {
    'user': 'root',
    'password': 'root',
    'host': 'mysql5_7',
    'database': 'localdb_57'
}
# for validating an Email
regex_email = '^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$'

#! utils
def convertToJson(_value):
    return json.dumps(_value, indent=4, sort_keys=True, default=str)

#! Database
# get ==
def get_messageInfo():
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM message_info')
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return convertToJson(results)

# set ==
def insert_messageInfo( email, name, comment):
    try:
        if not email or not re.search(regex_email, email) or len(email) > 128:
            raise Exception("Email failed")
        elif len(name) > 32:
            raise Exception("Name failed")
        elif len(comment) > 255:
            raise Exception("Comment failed")

        connection = mysql.connector.connect(**config)
        cursor = connection.cursor(dictionary=True)
        sample_response = {}
        time_ms = str(time.time_ns())
        random_5chr_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        _genMessageId = time_ms + random_5chr_string
        _genMessageInfoId = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

        sql1 = "insert into message(message_id) value(%s)"
        data1 = (_genMessageId,)
        cursor.execute(sql1, data1)

        sql2 = "insert into message_info(message_info_id, message_id, email, name, comment) value(%s, %s, %s, %s, %s)"
        data2 =  (_genMessageInfoId, _genMessageId, email, name, comment)
        cursor.execute(sql2, data2)

        connection.commit()   # commit the changes

        cursor.close()
        connection.close()
        sample_response = {
            "result": 'sucess'
        }
    except Exception as e:
        sample_response = {
            "result": 'failed',
            "error": str(e)
        }
    return sample_response
#! Routes
@app.route('/api/v1.0/get_message_info')
def get_message_info():
    sample_response = get_messageInfo()

    # JSONify response
    response = make_response(jsonify(sample_response))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/api/v1.0/insert_message_info', methods=['GET', 'POST', 'PUT'])
def insert_message_info():
    if request.method=='POST':
        input = request.json
        _email =  input['email']
        _name =  input['name']
        _comment =  input['comment']
        sample_response = insert_messageInfo(_email, _name, _comment)
    else:
        sample_response = {"result": 'failed'}
    # JSONify response
    response = make_response(jsonify(sample_response))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/api/v1.0/test', methods=['GET'])
def test_response():
    """Return a sample JSON response."""
    sample_response = {
        "items": [
            { "id": 1, "name": 'apples',  "price": "$2" },
            { "id": 2, "name": "Peaches", "price": "$5" }
        ]
    }
    response = make_response(jsonify(sample_response))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/json'
    return response

#! process
if __name__ == '__main__':
    app.run(host='0.0.0.0')