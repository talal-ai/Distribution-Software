import React from 'react';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SettingsScreen = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-4" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2c3e50' }}>
        Settings
      </h1>

      <Row>
        <Col lg={8}>
          <Card className="mb-4" style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <Card.Body>
              <h5 className="mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>Company Information</h5>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter company name" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tax ID</Form.Label>
                      <Form.Control type="text" placeholder="Enter tax ID" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control type="tel" placeholder="Enter phone number" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Enter address" />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4" style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <Card.Body>
              <h5 className="mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>System Preferences</h5>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Default Currency</Form.Label>
                      <Form.Select>
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Time Zone</Form.Label>
                      <Form.Select>
                        <option>UTC</option>
                        <option>EST</option>
                        <option>PST</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check 
                    type="switch"
                    id="email-notifications"
                    label="Enable email notifications"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check 
                    type="switch"
                    id="low-stock-alerts"
                    label="Enable low stock alerts"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-end">
            <Button 
              variant="primary"
              type="submit"
              className="d-flex align-items-center gap-2"
              style={{
                backgroundColor: '#4b6cb7',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1.5rem'
              }}
            >
              <FaSave size={14} />
              Save Changes
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card style={{
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <Card.Body>
              <h5 className="mb-4" style={{ color: '#2c3e50', fontWeight: 600 }}>About</h5>
              <div className="mb-3">
                <small className="text-muted">Version</small>
                <p className="mb-0">1.0.0</p>
              </div>
              <div className="mb-3">
                <small className="text-muted">Last Updated</small>
                <p className="mb-0">June 1, 2024</p>
              </div>
              <div>
                <small className="text-muted">License</small>
                <p className="mb-0">Commercial</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default SettingsScreen; 