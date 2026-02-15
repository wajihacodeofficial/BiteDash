import { useState } from 'react';
import axios from 'axios';

const LoginTest = () => {
  const [email, setEmail] = useState('admin@bitedash.com');
  const [password, setPassword] = useState('qwerty123456');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      console.log('Attempting login to:', `${baseUrl}/auth/login`);
      console.log('Payload:', { email, password });

      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });

      console.log('Response:', response);
      setResult(`SUCCESS: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      console.error('Error:', error);
      setResult(
        `ERROR: ${error.message} - ${JSON.stringify(
          error.response?.data,
          null,
          2
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Connection Test</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <button
        onClick={testLogin}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Testing...' : 'Test Login'}
      </button>

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
        }}
      >
        <h3>Result:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {result}
        </pre>
      </div>
    </div>
  );
};

export default LoginTest;
