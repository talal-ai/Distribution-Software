import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--background-white)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div style={{ marginBottom: '24px' }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                width: '32px',
                height: '32px',
                objectFit: 'contain'
              }} 
            />
          </div>

          {/* Header */}
          <h1 style={{ 
            fontSize: '24px',
            marginBottom: '32px',
            color: 'var(--text-primary)'
          }}>
            Welcome back!
          </h1>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: '16px' }}
            >
              <Message variant="danger">{error}</Message>
            </motion.div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group style={{ marginBottom: '16px' }}>
                <Form.Control
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    height: '40px',
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '14px',
                    width: '100%'
                  }}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: '24px' }} className="position-relative">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    height: '40px',
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '14px',
                    width: '100%'
                  }}
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </div>
              </Form.Group>

              <div style={{ 
                marginBottom: '24px'
              }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ 
                      marginRight: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  Remember me
                </label>
              </div>

              <Button 
                type="submit"
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: 'var(--primary-color)',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '14px'
                }}
              >
                Log in
              </Button>
            </Form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen; 