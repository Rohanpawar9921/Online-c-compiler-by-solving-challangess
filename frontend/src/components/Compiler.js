import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Compiler = () => {
  const [code, setCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [allPassed, setAllPassed] = useState(false);

  const navigate = useNavigate();
  const { challengeId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchChallenge = async () => {
      try {
        const res = await axios.get(`/api/challenges/${challengeId}`);
        setChallenge(res.data);
        setCode(res.data.starterCode || '');
      } catch (err) {
        console.error('Failed to load challenge:', err);
        setChallenge({ title: 'Error loading challenge', description: '' });
      }
    };

    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId, navigate]);

  const compileCode = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await axios.post(
        'http://localhost:5000/compile',
        { code, stdin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Response from server:', response.data); // Log the response for debugging

      setOutput(response.data.stdout);
      setError(response.data.stderr || '');
    } catch (err) {
      console.error('Compilation error:', err); // Log the error
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.stderr || 'Compilation failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const runTestCases = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!challenge?.testCases) return;

    const results = [];
    let passed = true;

    for (const testCase of challenge.testCases) {
      if (testCase.hidden) continue;

      try {
        const response = await axios.post(
          'http://localhost:5000/compile',
          { code, stdin: testCase.input },
          { headers: { Authorization: `Bearer ${token}` } }
        );  

        console.log('Test case response:', response.data); // Log test case response for debugging

        const actual = (response.data.stdout || '').trim();
        const expected = (testCase.output || '').trim();
        const pass = actual === expected;

        if (!pass) passed = false;

        results.push({ input: testCase.input, expected, actual, pass });
      } catch (err) {
        console.error('Test case compilation error:', err); // Log error for test case
        results.push({
          input: testCase.input,
          expected: testCase.output,
          actual: 'Error',
          pass: false,
        });
        passed = false;
      }
    }

    setTestResults(results);
    setAllPassed(passed);
  };

  return (
    <div className="compiler-container">
      {challenge && (
        <div className="challenge-info">
          <h2>{challenge.title}</h2>
          <p>{challenge.description}</p>
          <span className={`difficulty ${challenge.difficulty}`}>
            {challenge.difficulty}
          </span>
        </div>
      )}

      <div className="editor-section">
      <Editor
        height="75vh" // Increased from 60vh
        defaultLanguage="c"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || '')}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 16, // Increase font size
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          automaticLayout: true, // Helps with resizing
        }}
      />
      </div>

      <div className="io-section">
        <div className="input-group">
          <h3>Input (stdin):</h3>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter program input..."
          />
        </div>

        <button
          onClick={compileCode}
          disabled={isLoading}
          className={`compile-btn ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Compiling...' : 'Compile & Run'}
        </button>

        <button
          onClick={runTestCases}
          className="submit-btn"
        >
          Submit Challenge
        </button>

        <div className="output-group">
          <h3>Output:</h3>
          <pre className={`output ${error ? 'error' : ''}`}>
            {error || output || 'Your output will appear here...'}
          </pre>
        </div>

        {testResults.length > 0 && (
          <div className="test-results">
            <h3>Test Case Results:</h3>
            {testResults.map((res, index) => (
              <div
                key={index}
                className={`test-case ${res.pass ? 'pass' : 'fail'}`}
              >
                <p><strong>Input:</strong> {res.input}</p>
                <p><strong>Expected:</strong> {res.expected}</p>
                <p><strong>Actual:</strong> {res.actual}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={res.pass ? 'pass' : 'fail'}>
                    {res.pass ? '✅ Passed' : '❌ Failed'}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {allPassed && (
          <div className="success-banner">
            🎉 All test cases passed! Challenge Completed!
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;
