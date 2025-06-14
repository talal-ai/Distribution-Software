import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaChartLine, FaCalculator } from 'react-icons/fa';

const HomeScreen = () => {
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  return (
    <div className="home-screen" style={{ 
      background: 'linear-gradient(120deg, #f8f9fa 0%, #e9ecef 100%)',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      width: '100%'
    }}>
      <Container style={{ maxWidth: '1400px' }} className="px-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-5 mt-4 mb-5"
        >
          <Row className="align-items-center justify-content-center">
            <Col lg={10} className="text-center">
              <h1 className="display-4 fw-bold mb-4" style={{ 
                color: '#2c3e50',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)'
              }}>
                Distribution Management System
              </h1>
              <p className="lead mb-5" style={{ 
                color: '#5a6268', 
                maxWidth: '800px', 
                margin: '0 auto',
                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                padding: '0 15px'
              }}>
                A comprehensive solution for managing your distribution business efficiently
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="px-5 py-3 shadow rounded-pill"
                  style={{ 
                    background: 'linear-gradient(to right, #4b6cb7, #182848)', 
                    border: 'none',
                    fontSize: 'clamp(1rem, 1.5vw, 1.2rem)'
                  }}
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </Button>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Features Section */}
        <Row className="py-5 mt-4 mb-5 g-4">
          <Col xs={12} className="mb-5">
            <h2 className="text-center fw-bold" style={{ 
              color: '#2c3e50',
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)'
            }}>
              Key Features
            </h2>
            <div className="mx-auto" style={{ 
              width: '50px', 
              height: '4px', 
              background: '#4b6cb7', 
              marginTop: '1rem' 
            }}></div>
          </Col>
          
          {[
            {
              icon: <FaBoxOpen size={36} style={{ color: '#4b6cb7' }} />,
              title: 'Inventory Management',
              description: 'Track stock levels, manage receipts, and monitor daily sales with real-time updates'
            },
            {
              icon: <FaChartLine size={36} style={{ color: '#4b6cb7' }} />,
              title: 'Sales Management',
              description: 'Record sales by salesman, track targets and achievements with intuitive dashboards'
            },
            {
              icon: <FaCalculator size={36} style={{ color: '#4b6cb7' }} />,
              title: 'Financial Management',
              description: 'Calculate profits, manage credits and recoveries with powerful financial tools'
            }
          ].map((feature, index) => (
            <Col lg={4} md={6} key={index} className="mb-4">
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-100"
              >
                <Card className="h-100 border-0 shadow-sm rounded-lg overflow-hidden">
                  <div style={{ height: '8px', background: 'linear-gradient(to right, #4b6cb7, #182848)' }}></div>
                  <Card.Body className="p-4 text-center">
                    <div className="icon-wrapper mb-4 d-flex justify-content-center align-items-center mx-auto" 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        background: 'rgba(75, 108, 183, 0.1)',
                        marginTop: '10px'
                      }}>
                      {feature.icon}
                    </div>
                    <Card.Title className="fw-bold mb-3" style={{ 
                      color: '#2c3e50',
                      fontSize: 'clamp(1.25rem, 2vw, 1.5rem)'
                    }}>
                      {feature.title}
                    </Card.Title>
                    <Card.Text style={{ 
                      color: '#5a6268',
                      fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
                    }}>
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
        
        {/* CTA Section */}
        <Row className="py-5 my-5">
          <Col lg={10} md={11} className="mx-auto">
            <motion.div
              whileHover={{ boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-0 shadow rounded-lg overflow-hidden">
                <div style={{ 
                  background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
                  padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem)',
                  color: 'white',
                  textAlign: 'center'
                }}>
                  <h3 className="mb-4 fw-bold" style={{
                    fontSize: 'clamp(1.5rem, 2.5vw, 2rem)'
                  }}>
                    Ready to Streamline Your Distribution Business?
                  </h3>
                  <p className="mb-4 mx-auto" style={{ 
                    maxWidth: '600px',
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    opacity: 0.9
                  }}>
                    Join hundreds of businesses already using our platform to improve efficiency and boost profits
                  </p>
                  <Button 
                    variant="light" 
                    size="lg" 
                    className="fw-bold rounded-pill"
                    style={{ 
                      color: '#4b6cb7', 
                      padding: 'clamp(0.8rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2.5rem)',
                      fontSize: 'clamp(1rem, 1.5vw, 1.2rem)'
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Start Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomeScreen; 