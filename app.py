from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import io

app = Flask(__name__)
CORS(app)
@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.json.get('code')
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()

    try:
        exec(code)
        output = sys.stdout.getvalue()
    except Exception as e:
        output = str(e)
    finally:
        sys.stdout = old_stdout

    return jsonify({'output': output})

if __name__ == '__main__':
    app.run(debug=True)
