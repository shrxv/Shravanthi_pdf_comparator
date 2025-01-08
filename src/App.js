import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { ClipLoader } from 'react-spinners'; 

function App() {
  const [pdf1, setPdf1] = useState(null);
  const [pdf2, setPdf2] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.name === 'pdf1') {
      setPdf1(e.target.files[0]);
    } else if (e.target.name === 'pdf2') {
      setPdf2(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdf1 || !pdf2) {
      alert('Please upload both PDF files.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf1', pdf1);
    formData.append('pdf2', pdf2);

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/compare-pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.result);
    } catch (error) {
      console.error('Error comparing PDFs:', error);
      setResult('There was an error comparing the PDFs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Compare Two PDFs</h1>
      </header>
      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="pdf1">Choose the first PDF:</label>
            <input
              type="file"
              id="pdf1"
              name="pdf1"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pdf2">Choose the second PDF:</label>
            <input
              type="file"
              id="pdf2"
              name="pdf2"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <ClipLoader size={15} color={"#ffffff"} /> : 'Compare PDFs'}
            </button>
          </div>
        </form>

        {result && (
          <div className="result">
            <h2>Result:</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
