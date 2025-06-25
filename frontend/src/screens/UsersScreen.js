import React, { useEffect } from 'react';
import { Table, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, deleteUser } from '../actions/userActions';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const UsersScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner')) {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'owner':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="mb-0" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2c3e50' }}>
            Users
          </h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary"
            className="d-flex align-items-center gap-2"
            style={{
              backgroundColor: '#4b6cb7',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem'
            }}
            onClick={() => navigate('/users/add')}
          >
            <FaPlus size={14} />
            Add User
          </Button>
        </Col>
      </Row>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={getRoleBadgeVariant(user.role)} style={{ fontSize: '0.8rem' }}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="light"
                        size="sm"
                        className="d-flex align-items-center"
                        style={{ padding: '0.4rem 0.6rem' }}
                        onClick={() => navigate(`/users/${user._id}/edit`)}
                      >
                        <FaEdit size={14} />
                      </Button>
                      <Button 
                        variant="light"
                        size="sm"
                        className="d-flex align-items-center"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <FaKey size={14} />
                      </Button>
                      {userInfo._id !== user._id && (
                        <Button 
                          variant="danger"
                          size="sm"
                          className="d-flex align-items-center"
                          style={{ padding: '0.4rem 0.6rem' }}
                          onClick={() => deleteHandler(user._id)}
                        >
                          <FaTrash size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default UsersScreen; 