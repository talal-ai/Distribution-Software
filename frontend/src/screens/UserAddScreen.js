import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { register } from '../actions/userActions';

const UserAddScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, success } = userRegister;

  useEffect(() => {
    // Check if user is admin or owner
    if (!userInfo || !(userInfo.role === 'admin' || userInfo.role === 'owner')) {
      navigate('/login');
    }

    if (success) {
      navigate('/users');
    }
  }, [navigate, userInfo, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password, role));
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 shadow">
              <Card.Body>
                <h2 className="text-center mb-4">Add New User</h2>
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {loading ? (
                  <Loader />
                ) : (
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUserTag />
                        </span>
                        <Form.Select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          {userInfo && userInfo.role === 'owner' && (
                            <option value="owner">Owner</option>
                          )}
                        </Form.Select>
                      </div>
                    </Form.Group>

                    <div className="d-grid">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="mb-3"
                      >
                        Add User
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserAddScreen; 