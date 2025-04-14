import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from "react-router-dom";

function Register() {
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        await axios.post('/api/auth/registration/', {
          email,
          password1,
          password2,
        });

      navigate('/login');
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const errors = Object.values(err.response.data).flat().join(' ');
        setErrorMsg(errors);
      } else {
        setErrorMsg('Something went wrong during registration');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
        </div><p>Already have an account? <Link to="/login">Login here</Link></p>

        <button style={{ marginTop: '1rem' }} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
