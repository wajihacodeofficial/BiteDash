import { useState } from 'react';
import axios from 'axios';

const SimpleLoginTest = () => {
  const [email, setEmail] = useState('admin@bitedash.com');
  const [password, setPassword] = useState('qwerty123456');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testSimpleLogin = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      console.log('=== SIMPLE LOGIN TEST ===');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log(
        'API URL:',
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'
      );

      // Use direct axios call (bypassing AuthContext)
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const fullUrl = `${apiUrl}/auth/login`;

      console.log('Making request to:', fullUrl);

      const response = await axios.post(fullUrl, {
        email: email,
        password: password,
      });

      console.log('✅ SUCCESS! Response:', response.data);

      // Try to store in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setResult(`✅ SUCCESS! 
Token: ${response.data.token.substring(0, 50)}...
User: ${JSON.stringify(response.data.user, null, 2)}

Stored in localStorage:
- token: ${response.data.token.substring(0, 20)}...
- user: ${response.data.user.email}`);
    } catch (error) {
      console.error('❌ ERROR:', error);
      console.error('Response:', error.response);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);

      setResult(`❌ ERROR: ${error.message}

Status: ${error.response?.status}
Data: ${JSON.stringify(error.response?.data, null, 2)}

Full Error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testStoredData = () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      setResult(
        (prev) =>
          prev +
          `\n\n=== STORED DATA ===\nToken: ${token?.substring(
            0,
            50
          )}...\nUser: ${user}`
      );
    } catch (error) {
      setResult((prev) => prev + `\n\n❌ LocalStorage Error: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
      }}
    >
      <h1>🧪 Simple Login Test</h1>
      <p>This test bypasses AuthContext and uses direct axios calls.</p>

      <div style={{ marginBottom: '20px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: '10px', padding: '8px', width: '300px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginLeft: '10px', padding: '8px', width: '300px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testSimpleLogin}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '16px',
          }}
        >
          {loading ? 'Testing...' : '🚀 Test Simple Login'}
        </button>

        <button
          onClick={testStoredData}
          style={{
            padding: '12px 24px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          🔍 Check Stored Data
        </button>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          border: '1px solid #dee2e6',
          maxHeight: '400px',
          overflow: 'auto',
        }}
      >
        <h3>📊 Result:</h3>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: '12px',
            margin: 0,
          }}
        >
          {result || 'Click "Test Simple Login" to start...'}
        </pre>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e7f3ff',
          borderRadius: '5px',
        }}
      >
        <h4>📋 Instructions:</h4>
        <ol>
          <li>Open browser console (F12) to see detailed logs</li>
          <li>Click "Test Simple Login" - this bypasses AuthContext</li>
          <li>
            If this works but regular login doesn't, the issue is in AuthContext
          </li>
          <li>If this fails too, there's an API/CORS issue</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleLoginTest;
