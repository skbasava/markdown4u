from flask import Flask, request, jsonify
import os
import tempfile
from werkzeug.utils import secure_filename
import sys

# Add the cloned repository to the Python path
sys.path.append('/app/markitdown')

from markitdown.convert import convert_to_markdown

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    file_ext = os.path.splitext(filename)[1].lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
        file.save(temp_file.name)
        temp_file_path = temp_file.name

    try:
        markdown = convert_to_markdown(temp_file_path)
        return jsonify({'markdown': markdown})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        os.unlink(temp_file_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

