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
#^ is a rough and dirty way of getting a parsable JSON string
def convertToJson(_value):
    return json.dumps(_value, indent=4, sort_keys=True, default=str)

#! Database
#^ The idea was to receive given comments information
#^ Then Generate an ID (message_id) with time.time()+random_string --> (insert_message_info)
#^ This method gives a sortable table that makes it easy to detect new message
#^ It also gives an advantage with cursor based pagination (since OFFSET can become slow)

# get ==
def get_from_init(limit):
    try:
        if not limit:
            raise Exception("No limit")
        #- connect
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor(dictionary=True)
        #- execute
        sql1 = "SELECT * FROM message ORDER BY message_id DESC LIMIT %s OFFSET 0"
        data1 = (limit,)
        cursor.execute(sql1, data1)

        results = cursor.fetchall()
        sample_response = { 
            "result" : 'success',
            "value": convertToJson(results)
        }
        #- close
        cursor.close()
        connection.close()
    except Exception as e:
        sample_response = {
            "result": 'failed',
            "error": str(e)
        }
    return sample_response

def get_from_top(curr_deep_first):
    try:
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor(dictionary=True)

        if not curr_deep_first:
            sql1 = "SELECT message_id FROM message WHERE message_id < %s ORDER BY message_id DESC"
            data1 = (curr_deep_first,)
        else:
            sql1 = "SELECT message_id FROM message WHERE message_id"
            data1 = ('',)

        cursor.execute(sql1, data1)

        results = cursor.fetchall()
        sample_response = { 
            "result" : 'success',
            "value": convertToJson(results)
        }

        cursor.close()
        connection.close()
    except Exception as e:
        sample_response = {
            "result": 'failed',
            "error": str(e)
        }
    return sample_response
#--> https://en.gravatar.com/site/implement/images/python/
#x def get_gravatar(email):{
#x 
#x }
# set ==
def insert_message_info( email, name, comment):
    try:
        if not email or not re.search(regex_email, email) or len(email) > 128:
            raise Exception("Email failed")
        elif len(name) > 32:
            raise Exception("Name failed")
        elif len(comment) > 255:
            raise Exception("Comment failed")
        #- connect
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor(dictionary=True)
        #- init
        sample_response = {}
        time_ms = str(time.time_ns())
        random_5chr_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        _genMessageId = time_ms + random_5chr_string
        _genMessageInfoId = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        #- execute
        sql1 = "insert into message(message_id) value(%s)"
        data1 = (_genMessageId,)
        cursor.execute(sql1, data1)

        sql2 = "insert into message_info(message_info_id, message_id, email, name, comment) value(%s, %s, %s, %s, %s)"
        data2 =  (_genMessageInfoId, _genMessageId, email, name, comment)
        cursor.execute(sql2, data2)

        connection.commit()   #- commit the changes
        #- close
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
@app.route('/api/v1.0/get_from_init', methods=['GET', 'POST', 'PUT'])
def get_from_init_route():
    if request.method=='POST':
        input = request.json
        _limit =  input['limit']
        sample_response = get_from_init(_limit)
    else:
        sample_response = {"result": 'failed'}
    # JSONify response
    response = make_response(jsonify(sample_response))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/api/v1.0/get_from_top', methods=['GET', 'POST', 'PUT'])
def get_from_top_route():
    if request.method=='POST':
        input = request.json
        _currDeepFirst =  input['curr_deep_First']
        sample_response = get_from_top(_currDeepFirst)
    else:
        sample_response = {"result": 'failed'}
    # JSONify response
    response = make_response(jsonify(sample_response))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/api/v1.0/insert_message_info', methods=['GET', 'POST', 'PUT'])
def insert_message_info_route():
    if request.method=='POST':
        input = request.json
        _email =  input['email']
        _name =  input['name']
        _comment =  input['comment']
        sample_response = insert_message_info(_email, _name, _comment)
    else:
        sample_response = {"result": 'failed'}
    # JSONify response
    response = make_response(jsonify(sample_response))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/json'
    return response

@app.route('/api/v1.0/test', methods=['GET'])
def test_response_route():
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