import React, { useState } from 'react';
import { Table, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UsersScreen = () => {
  // Placeholder data - replace with actual data from your backend
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'inactive' },
  ]);

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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      default:
        return 'warning';
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
        <Table hover responsive className="mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Badge bg={getRoleBadgeVariant(user.role)} style={{ fontSize: '0.8rem' }}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getStatusBadgeVariant(user.status)} style={{ fontSize: '0.8rem' }}>
                    {user.status}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="light"
                      size="sm"
                      className="d-flex align-items-center"
                      style={{ padding: '0.4rem 0.6rem' }}
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
                    <Button 
                      variant="danger"
                      size="sm"
                      className="d-flex align-items-center"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <FaTrash size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </motion.div>
  );
};

export default UsersScreen; 