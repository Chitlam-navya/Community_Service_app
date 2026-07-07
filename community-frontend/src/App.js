import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regMessage, setRegMessage] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = () => {
    axios.get('http://localhost:8080/api/issues')
      .then(response => setIssues(response.data))
      .catch(error => console.error("Error fetching data:", error));
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    
    const newIssue = { 
      title, 
      description, 
      location, 
      status: "PENDING",
      reportedBy: currentUser ? currentUser.username : "Anonymous Resident"
    };

    axios.post('http://localhost:8080/api/issues', newIssue)
      .then(() => {
        setTitle(''); setDescription(''); setLocation('');
        fetchIssues();
      })
      .catch(error => console.error("Error saving issue:", error));
  };

  // This magic function sends the update request to our backend endpoint!
  const handleCompleteIssue = (id) => {
    axios.put("http://localhost:8080/api/issues/" + id + "/complete")
      .then(() => {
        fetchIssues(); // Refresh the list to show the status update live!
      })
      .catch(error => console.error("Error updating issue status:", error));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newUser = { username, email, password };

    axios.post('http://localhost:8080/api/users/register', newUser)
      .then(response => {
        setRegMessage("Profile created successfully for " + response.data.username + "!");
        setUsername(''); setEmail(''); setPassword('');
      })
      .catch(error => {
        setRegMessage("Oops! That email is already taken.");
        console.error("Registration error:", error);
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const loginDetails = { email: loginEmail, password: loginPassword };

    axios.post('http://localhost:8080/api/users/login', loginDetails)
      .then(response => {
        setCurrentUser(response.data);
        setLoginMessage("");
        setLoginEmail(''); setLoginPassword('');
      })
      .catch(error => {
        setLoginMessage("Invalid email or password. Please try again.");
        console.error("Login error:", error);
      });
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    setLoginMessage("");
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', maxWidth: '1100px', margin: '0 auto', backgroundColor: '#ffffff' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #2c3e50', paddingBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '32px', margin: '0 0 10px 0' }}>Smart Community Service Hub</h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px', margin: '0' }}>Secure resident network dashboard system</p>
      </header>

      {currentUser && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '15px 25px', borderRadius: '8px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#166534', fontWeight: 'bold', fontSize: '16px' }}>Logged in as: {currentUser.username} ({currentUser.email})</span>
          <button onClick={handleLogOut} style={{ backgroundColor: '#dc2626', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Log Out Securely</button>
        </div>
      )}

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#2c3e50', fontSize: '22px', borderBottom: '1px solid #bdc3c7', paddingBottom: '8px', marginBottom: '20px' }}>Resident Account Center</h2>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f4f9ff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #d0e3ff' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e3a8a', fontSize: '18px' }}>Create a Resident Profile</h3>
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <input type="text" placeholder="Full Name" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '15px' }}>Register Profile</button>
            </form>
            {regMessage && <p style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '14px', color: '#1e3a8a', textAlign: 'center', margin: '15px 0 0 0' }}>{regMessage}</p>}
          </div>

          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f0fdf4', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #bbf7d0' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#166534', fontSize: '18px' }}>Resident Portal Sign In</h3>
            {!currentUser ? (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <input type="email" placeholder="Email Address" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <input type="password" placeholder="Enter Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '15px' }}>Secure Login</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '16px' }}>Verification Active ✔</p>
                <p style={{ color: '#475569', fontSize: '14px' }}>You have access to write official reports.</p>
              </div>
            )}
            {loginMessage && <p style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '14px', color: '#dc2626', textAlign: 'center', margin: '15px 0 0 0' }}>{loginMessage}</p>}
          </div>

        </div>
      </section>

      <section>
        <h2 style={{ color: '#2c3e50', fontSize: '22px', borderBottom: '1px solid #bdc3c7', paddingBottom: '8px', marginBottom: '20px' }}>Community Operations Desk</h2>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f8fafc', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>Report a New Problem</h3>
            <form onSubmit={handleIssueSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <input type="text" placeholder="What is the issue? (e.g., Water Leak)" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <textarea placeholder="Describe details here..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', height: '90px', resize: 'none' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input type="text" placeholder="Location path" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '15px' }}>Submit Report</button>
            </form>
          </div>

          <div style={{ flex: '1.5', minWidth: '350px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px' }}>Current Active Reports</h3>
            {issues.length === 0 ? (
              <div style={{ backgroundColor: '#f1f5f9', padding: '30px', borderRadius: '10px', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
                <p style={{ color: '#64748b', margin: '0', fontSize: '15px' }}>No active issues found! The neighborhood is clean.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {issues.map(issue => (
                  <div key={issue.id} style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <h4 style={{ color: '#1e293b', margin: '0 0 10px 0', fontSize: '16px' }}>📍 {issue.title}</h4>
                    <p style={{ color: '#475569', margin: '0 0 5px 0', fontSize: '14px', lineHeight: '1.5' }}>{issue.description}</p>
                    <p style={{ color: '#94a3b8', margin: '0 0 15px 0', fontSize: '12px', fontWeight: '600' }}>Posted By: {issue.reportedBy || "Anonymous Resident"}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Location: {issue.location}</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Dynamic Status Badges based on whether it's pending or completed! */}
                        <span style={{ 
                          backgroundColor: issue.status === 'COMPLETED' ? '#dcfce7' : '#fef3c7', 
                          color: issue.status === 'COMPLETED' ? '#15803d' : '#d97706', 
                          padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' 
                        }}>
                          {issue.status}
                        </span>

                        {/* Show the button ONLY if the status is currently PENDING */}
                        {issue.status !== 'COMPLETED' && (
                          <button 
                            onClick={() => handleCompleteIssue(issue.id)}
                            style={{ backgroundColor: '#16a34a', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                          >
                            ✓ Fix Problem
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}

export default App;