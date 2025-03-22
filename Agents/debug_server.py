from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "success"})

if __name__ == '__main__':
    print("Starting debug server on http://localhost:4000")
    app.run(debug=True, host='0.0.0.0', port=4000) 