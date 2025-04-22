// ResetPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const {token} = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/reset-password/${token}`, { password });
      setMessage('Password reset successful. You can now log in with your new password.');
    } catch (error) {
      console.error(error);
      setMessage('Error resetting password. Please try again.');
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <label>Enter New Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ResetPasswordPage;
