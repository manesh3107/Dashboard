// ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://${process.env.REACT_APP_BASE_URL}/api/forgot-password`, { email });
      setMessage('Reset email sent successfully. Please check your email.');
    } catch (error) {
      console.error(error);
      setMessage('Error sending reset email.');
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <form onSubmit={handleForgotPassword}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Send Reset Email</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ForgotPasswordPage;
