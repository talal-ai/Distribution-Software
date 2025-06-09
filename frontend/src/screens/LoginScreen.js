import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaUser, FaLock } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      background: 'linear-gradient(120deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      padding: 'clamp(1rem, 5vw, 3rem) 0'
    }}>
      <Container style={{ maxWidth: '1400px' }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg rounded-lg overflow-hidden">
                <div style={{ height: '8px', background: 'linear-gradient(to right, #4b6cb7, #182848)' }}></div>
                <Card.Body className="p-5">
                  <h2 className="text-center mb-4" style={{ 
                    color: '#2c3e50',
                    fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
                    fontWeight: '600'
                  }}>
                    Welcome Back
                  </h2>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Message variant="danger">{error}</Message>
                    </motion.div>
                  )}
                  
                  {loading ? (
                    <div className="text-center py-3">
                      <Loader />
                    </div>
                  ) : (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="email" className="mb-4">
                        <div className="position-relative">
                          <div className="position-absolute" style={{ 
                            left: '15px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#4b6cb7'
                          }}>
                            <FaUser />
                          </div>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                              padding: '0.75rem 1rem 0.75rem 2.8rem',
                              border: '1px solid #e0e0e0',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group controlId="password" className="mb-4">
                        <div className="position-relative">
                          <div className="position-absolute" style={{ 
                            left: '15px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#4b6cb7'
                          }}>
                            <FaLock />
                          </div>
                          <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                              padding: '0.75rem 1rem 0.75rem 2.8rem',
                              border: '1px solid #e0e0e0',
                              borderRadius: '0.5rem',
                              fontSize: '1rem'
                            }}
                          />
                        </div>
                      </Form.Group>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-100 mb-3 rounded-pill"
                          style={{
                            background: 'linear-gradient(to right, #4b6cb7, #182848)',
                            border: 'none',
                            padding: '0.75rem',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                          }}
                        >
                          Sign In
                        </Button>
                      </motion.div>
                    </Form>
                  )}
                  
                  <div className="text-center mt-4">
                    <Link 
                      to="/forgot-password"
                      style={{ 
                        color: '#4b6cb7', 
                        textDecoration: 'none',
                        fontSize: '0.95rem'
                      }}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginScreen; 