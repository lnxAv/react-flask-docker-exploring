import mysql.connector
from typing import List, Dict
from flask import Flask, make_response, jsonify
import json
#! init
app = Flask(__name__)
# config for db
config = {
    'user': 'root',
    'password': 'root',
    'host': 'mysql5_7',
    'database': 'localdb_57'
}

#! utils
def convertToJson(_value):
    return json.dumps(_value, indent=4, sort_keys=True, separators=(',', ': '), default=str)

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

#! Routes
@app.route('/api/v1.0/get_message_info')
def index() -> str:
    sample_response = get_messageInfo()
        # JSONify response
    response = make_response(jsonify(sample_response))
    # Access-Control-Allow-Origin header to allow cross-site request
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
    # JSONify response
    response = make_response(jsonify(sample_response))
    # Access-Control-Allow-Origin header to allow cross-site request
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Content-Type'] = 'application/json'
    return response

#! process
if __name__ == '__main__':
    app.run(host='0.0.0.0')