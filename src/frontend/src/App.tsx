import React, { useState } from 'react';
import './App.css';
import { getGreeting } from './services/api';

function App() {
  const [name, setName] = useState<string>('');
  const [greeting, setGreeting] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getGreeting(name);
      setGreeting(response);
    } catch (err) {
      setError('Failed to fetch greeting. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>PhysiqubeRunning</h1>
        <div className="greeting-form">
          <h2>Enter Your Name</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="name-input"
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Get Greeting'}
              </button>
            </div>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          
          {greeting && (
            <div className="greeting-result">
              <h3>Response from Server:</h3>
              <p>{greeting}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
