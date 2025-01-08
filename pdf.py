from flask import Flask, request, jsonify
import PyPDF2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def compare_pdfs(pdf1_text, pdf2_text):
    if pdf1_text == pdf2_text:
        return "The PDFs are identical."
    else:
        return "The PDFs are not identical."

@app.route('/compare-pdfs', methods=['POST'])
def compare_pdfs_endpoint():
    pdf1 = request.files.get('pdf1')
    pdf2 = request.files.get('pdf2')

    if not pdf1 or not pdf2:
        return jsonify({"error": "Both PDF files are required"}), 400

    pdf1_text = extract_text_from_pdf(pdf1)
    pdf2_text = extract_text_from_pdf(pdf2)

    result = compare_pdfs(pdf1_text, pdf2_text)
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)
