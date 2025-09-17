
import React, { useState } from 'react';
// FIX: Update react-router-dom imports for v6 compatibility.
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AgentInputForm: React.FC = () => {
  const { handleAgentSubmit } = useAppContext();
  // FIX: Replaced useHistory with useNavigate for v6 compatibility.
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.md')) {
        setFile(selectedFile);
        setText(''); // Clear textarea if a file is chosen
        setError(null);
      } else {
        setError('Please upload a text-based file (e.g., .txt, .md).');
        setFile(null);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (file) {
      setFile(null); // Clear file if user starts typing
    }
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = ''; // Reset the file input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const processSubmit = (content: string) => {
        if (content && content.trim()) {
            // FIX: Use navigate for navigation in v6.
            handleAgentSubmit(content, navigate);
        } else {
            setError('The provided content is empty.');
        }
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        processSubmit(event.target?.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      };
      reader.readAsText(file);
    } else if (text.trim()) {
      processSubmit(text);
    }
  };

  const isSubmitDisabled = !text.trim() && !file;

  return (
    <div className="bg-background-secondary p-8 rounded-lg border border-border-color shadow-md animate-fade-in">
      <h2 className="text-2xl font-bold text-accent mb-2">Analyse Customer Requirements</h2>
      <p className="text-text-secondary mb-6">
        Upload an RFQ, tender, or meeting notes document. Alternatively, you can paste the text directly below. The AI will analyse it and pre-fill the questionnaire.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="file-upload" className="w-full cursor-pointer flex items-center justify-center gap-3 bg-background hover:bg-border-color text-text-primary font-bold py-3 px-6 rounded-lg text-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            <span>Upload Document</span>
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".txt,.md,text/plain" />
        </div>

        {file && (
          <div className="mb-4 flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span className="font-medium text-text-primary">{file.name}</span>
            </div>
            <button type="button" onClick={removeFile} className="text-text-secondary hover:text-red-600" aria-label="Remove file">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            </button>
          </div>
        )}
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-border-color"></div></div>
          <div className="relative flex justify-center"><span className="bg-background-secondary px-3 text-sm font-medium text-text-secondary">OR</span></div>
        </div>

        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Paste text here... e.g., 'The client needs a conference room setup with 3 laptop inputs...'"
          className="w-full h-48 p-3 bg-input-bg border border-border-color rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-colors mb-4 resize-y text-text-primary"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="button"
            // FIX: Use navigate for navigation in v6.
            onClick={() => navigate('/')}
            className="bg-background hover:bg-border-color text-text-primary font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-3 px-6 rounded-lg text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Parse Requirements
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentInputForm;
