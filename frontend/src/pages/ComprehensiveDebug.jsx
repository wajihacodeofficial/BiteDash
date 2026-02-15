import { useState, useEffect } from 'react';

const ComprehensiveDebug = () => {
  const [results, setResults] = useState({});
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const log = `[${timestamp}] ${type}: ${message}`;
    console.log(log);
    setLogs((prev) => [...prev, log]);
  };

  useEffect(() => {
    addLog('Comprehensive Login Debug Started');
    runAllTests();
  }, []);

  const runAllTests = async () => {
    // Test 1: Environment Variables
    await testEnvironment();

    // Test 2: Backend Connection
    await testBackendConnection();

    // Test 3: API Endpoint
    await testAPIEndpoint();

    // Test 4: Direct Login Test
    await testDirectLogin();

    // Test 5: AuthContext Import
    await testAuthContext();

    // Test 6: LocalStorage Test
    await testLocalStorage();
  };

  const testEnvironment = async () => {
    addLog('Testing Environment Variables...', 'info');
    try {
      const envVars = {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        NODE_ENV: import.meta.env.NODE_ENV,
        all_env: Object.keys(import.meta.env).filter((key) =>
          key.startsWith('VITE_')
        ),
      };

      setResults((prev) => ({ ...prev, environment: envVars }));
      addLog(
        `Environment vars: ${JSON.stringify(envVars, null, 2)}`,
        'success'
      );
    } catch (error) {
      addLog(`Environment Error: ${error.message}`, 'error');
      setResults((prev) => ({
        ...prev,
        environment: { error: error.message },
      }));
    }
  };

  const testBackendConnection = async () => {
    addLog('Testing Backend Connection...', 'info');
    try {
      const axios = (await import('axios')).default;
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
      const baseUrl = apiUrl.replace('/api', '');

      const response = await axios.get(baseUrl, { timeout: 5000 });
      setResults((prev) => ({
        ...prev,
        backend: { status: response.status, data: response.data },
      }));
      addLog(`Backend connected: ${response.status}`, 'success');
    } catch (error) {
      addLog(`Backend Error: ${error.message}`, 'error');
      setResults((prev) => ({
        ...prev,
        backend: { error: error.message, status: error.response?.status },
      }));
    }
  };

  const testAPIEndpoint = async () => {
    addLog('Testing API Endpoint...', 'info');
    try {
      const axios = (await import('axios')).default;
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

      // Test with a simple GET first
      const testResponse = await axios.get(`${apiUrl}/auth/test-endpoint`, {
        timeout: 5000,
      });
      setResults((prev) => ({
        ...prev,
        apiEndpoint: { testResponse: testResponse.data },
      }));
      addLog('API endpoint test successful', 'success');
    } catch (error) {
      // This is expected to fail since /test-endpoint doesn't exist
      addLog(
        `API endpoint test (expected failure): ${error.message}`,
        'warning'
      );
      setResults((prev) => ({
        ...prev,
        apiEndpoint: { note: 'Endpoint test completed (404 expected)' },
      }));
    }
  };

  const testDirectLogin = async () => {
    addLog('Testing Direct Login...', 'info');
    try {
      const axios = (await import('axios')).default;
      const apiUrl =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

      addLog(`Making request to: ${apiUrl}/auth/login`, 'info');
      addLog(
        `Payload: email=admin@bitedash.com, password=qwerty123456`,
        'info'
      );

      const response = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email: 'admin@bitedash.com',
          password: 'qwerty123456',
        },
        { timeout: 10000 }
      );

      setResults((prev) => ({
        ...prev,
        directLogin: {
          success: true,
          token: response.data.token?.substring(0, 50) + '...',
          user: response.data.user,
        },
      }));
      addLog('Direct login SUCCESS!', 'success');

      // Test if token is valid
      if (response.data.token) {
        addLog('Testing token validity...', 'info');
        const verifyResponse = await axios.get(`${apiUrl}/auth/verify`, {
          headers: { Authorization: `Bearer ${response.data.token}` },
        });
        addLog('Token verification successful', 'success');
        setResults((prev) => ({
          ...prev,
          directLogin: {
            ...prev.directLogin,
            tokenValid: true,
          },
        }));
      }
    } catch (error) {
      addLog(`Direct Login Error: ${error.message}`, 'error');
      addLog(`Response status: ${error.response?.status}`, 'error');
      addLog(`Response data: ${JSON.stringify(error.response?.data)}`, 'error');
      setResults((prev) => ({
        ...prev,
        directLogin: {
          error: error.message,
          status: error.response?.status,
          data: error.response?.data,
        },
      }));
    }
  };

  const testAuthContext = async () => {
    addLog('Testing AuthContext...', 'info');
    try {
      const { AuthProvider } = await import('../context/AuthContext');
      setResults((prev) => ({ ...prev, authContext: { loaded: true } }));
      addLog('AuthContext loaded successfully', 'success');
    } catch (error) {
      addLog(`AuthContext Error: ${error.message}`, 'error');
      setResults((prev) => ({
        ...prev,
        authContext: { error: error.message },
      }));
    }
  };

  const testLocalStorage = async () => {
    addLog('Testing LocalStorage...', 'info');
    try {
      // Test localStorage access
      localStorage.setItem('test', 'value');
      const testValue = localStorage.getItem('test');
      localStorage.removeItem('test');

      setResults((prev) => ({
        ...prev,
        localStorage: {
          working: true,
          testValue,
        },
      }));
      addLog('LocalStorage working', 'success');
    } catch (error) {
      addLog(`LocalStorage Error: ${error.message}`, 'error');
      setResults((prev) => ({
        ...prev,
        localStorage: { error: error.message },
      }));
    }
  };

  return (
    <div
      style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '1200px' }}
    >
      <h1>🔍 Comprehensive Login Debug</h1>

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#e8f5e8',
          borderRadius: '5px',
        }}
      >
        <strong>Status:</strong> All tests completed. Check results below.
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        {/* Test Results */}
        <div>
          <h3>📊 Test Results</h3>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '5px',
              fontSize: '12px',
              maxHeight: '500px',
              overflow: 'auto',
            }}
          >
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>

        {/* Debug Logs */}
        <div>
          <h3>📝 Debug Logs</h3>
          <div
            style={{
              backgroundColor: '#2d2d2d',
              color: '#fff',
              padding: '15px',
              borderRadius: '5px',
              maxHeight: '500px',
              overflowY: 'auto',
              fontSize: '11px',
            }}
          >
            {logs.length === 0 ? (
              <p style={{ color: '#888' }}>No logs yet...</p>
            ) : (
              logs.map((log, index) => {
                let color = '#fff';
                if (log.includes('SUCCESS')) color = '#4CAF50';
                else if (log.includes('ERROR')) color = '#f44336';
                else if (log.includes('WARNING')) color = '#ff9800';
                else if (log.includes('Testing')) color = '#2196F3';

                return (
                  <div key={index} style={{ marginBottom: '3px', color }}>
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={runAllTests}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Re-run All Tests
        </button>
        <button
          onClick={() => setLogs([])}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
};

export default ComprehensiveDebug;
