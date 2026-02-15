import { useState, useEffect } from 'react';

const DebugLogin = () => {
  const [logs, setLogs] = useState([]);
  const [apiUrl, setApiUrl] = useState('');

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    setLogs((prev) => [...prev, logEntry]);
  };

  useEffect(() => {
    // Check environment variables
    const envApiUrl = import.meta.env.VITE_API_BASE_URL;
    const fallbackUrl = 'http://localhost:5001/api';
    const finalUrl = envApiUrl || fallbackUrl;

    setApiUrl(finalUrl);
    addLog(`Environment API URL: ${envApiUrl || 'NOT SET'}`);
    addLog(`Using API URL: ${finalUrl}`);
    addLog(`Import.meta.env: ${JSON.stringify(import.meta.env, null, 2)}`);
  }, []);

  const testDirectAxios = async () => {
    addLog('=== Testing Direct Axios Call ===');
    try {
      const axios = (await import('axios')).default;

      addLog(`Making request to: ${apiUrl}/auth/login`);
      addLog(
        `Payload: ${JSON.stringify({
          email: 'admin@bitedash.com',
          password: 'qwerty123456',
        })}`
      );

      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: 'admin@bitedash.com',
        password: 'qwerty123456',
      });

      addLog(`SUCCESS: ${JSON.stringify(response.data, null, 2)}`, 'success');
    } catch (error) {
      addLog(`ERROR: ${error.message}`, 'error');
      addLog(
        `Response: ${JSON.stringify(error.response?.data, null, 2)}`,
        'error'
      );
      addLog(`Status: ${error.response?.status}`, 'error');
    }
  };

  const testAuthContext = async () => {
    addLog('=== Testing AuthContext Login ===');
    try {
      const { useAuth } = await import('../context/AuthContext');
      // This will test through the AuthContext
      addLog('AuthContext test would go here', 'warning');
    } catch (error) {
      addLog(`AuthContext Error: ${error.message}`, 'error');
    }
  };

  const testBackendConnection = async () => {
    addLog('=== Testing Backend Connection ===');
    try {
      const axios = (await import('axios')).default;

      // Test basic connection
      addLog(`Testing connection to: ${apiUrl.replace('/api', '')}`);
      const response = await axios.get(`${apiUrl.replace('/api', '')}`);
      addLog(`Backend Status: ${response.status}`, 'success');
      addLog(`Backend Response: ${response.data}`, 'success');
    } catch (error) {
      addLog(`Backend Connection Error: ${error.message}`, 'error');
      addLog(`Status: ${error.response?.status}`, 'error');
    }
  };

  return (
    <div
      style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px' }}
    >
      <h1>🔍 Login Debug Console</h1>

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
        }}
      >
        <strong>Current API URL:</strong> {apiUrl}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testBackendConnection}
          style={{ margin: '5px', padding: '10px' }}
        >
          Test Backend Connection
        </button>
        <button
          onClick={testDirectAxios}
          style={{ margin: '5px', padding: '10px' }}
        >
          Test Direct API Call
        </button>
        <button
          onClick={() => setLogs([])}
          style={{ margin: '5px', padding: '10px' }}
        >
          Clear Logs
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#1e1e1e',
          color: '#fff',
          padding: '15px',
          borderRadius: '5px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '12px',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#4CAF50' }}>Debug Logs:</h3>
        {logs.length === 0 ? (
          <p style={{ color: '#888' }}>
            No logs yet. Click a test button above.
          </p>
        ) : (
          logs.map((log, index) => {
            let color = '#fff';
            if (log.includes('SUCCESS')) color = '#4CAF50';
            else if (log.includes('ERROR')) color = '#f44336';
            else if (log.includes('WARNING')) color = '#ff9800';

            return (
              <div key={index} style={{ marginBottom: '5px', color }}>
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DebugLogin;
