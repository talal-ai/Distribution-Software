import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { logout } from '../actions/userActions';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTachometerAlt, FaBox, FaWarehouse, FaShoppingCart, 
         FaMoneyBillWave, FaChartBar, FaUsers, FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const navStyle = {
    backgroundColor: 'var(--background-white)',
    boxShadow: 'var(--box-shadow)',
    padding: '0.5rem 0',
  };

  const navLinkStyle = {
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  };

  const activeNavLinkStyle = {
    color: 'var(--primary-color)',
  };

  const dropdownStyle = {
    border: 'none',
    borderRadius: 'var(--border-radius)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '0.5rem 0',
    marginTop: '0.5rem',
  };

  const dropdownItemStyle = {
    fontSize: '0.9rem',
    padding: '0.5rem 1rem',
    color: 'var(--text-primary)',
    transition: 'all 0.2s ease',
  };

  return (
    <header>
      <Navbar 
        style={navStyle} 
        expand="lg" 
        fixed="top"
        expanded={isExpanded}
        onToggle={(expanded) => setIsExpanded(expanded)}
      >
        <Container fluid style={{ padding: '0 2rem' }}>
          <LinkContainer to="/">
            <Navbar.Brand style={{ 
              fontSize: '1.2rem', 
              fontWeight: '600',
              color: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ 
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain'
                }}
              />
              Distribution Management
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle 
            aria-controls="basic-navbar-nav"
            style={{
              border: 'none',
              padding: '0.25rem'
            }}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <AnimatePresence>
                {userInfo ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LinkContainer to="/dashboard">
                        <Nav.Link style={navLinkStyle} activeStyle={activeNavLinkStyle}>
                          <FaTachometerAlt size={16} />
                          Dashboard
                        </Nav.Link>
                      </LinkContainer>

                      <LinkContainer to="/products">
                        <Nav.Link style={navLinkStyle} activeStyle={activeNavLinkStyle}>
                          <FaBox size={16} />
                          Products
                        </Nav.Link>
                      </LinkContainer>

                      <LinkContainer to="/inventory">
                        <Nav.Link style={navLinkStyle} activeStyle={activeNavLinkStyle}>
                          <FaWarehouse size={16} />
                          Inventory
                        </Nav.Link>
                      </LinkContainer>

                      <LinkContainer to="/sales">
                        <Nav.Link style={navLinkStyle} activeStyle={activeNavLinkStyle}>
                          <FaShoppingCart size={16} />
                          Sales
                        </Nav.Link>
                      </LinkContainer>

                      {(userInfo.role === 'admin' || userInfo.role === 'owner') && (
                        <>
                          <LinkContainer to="/finance">
                            <Nav.Link style={navLinkStyle} activeStyle={activeNavLinkStyle}>
                              <FaMoneyBillWave size={16} />
                              Finance
                            </Nav.Link>
                          </LinkContainer>

                          <LinkContainer to="/reports">
                            <Nav.Link style={navLinkStyle} activeStyle={activeNavLinkStyle}>
                              <FaChartBar size={16} />
                              Reports
                            </Nav.Link>
                          </LinkContainer>
                        </>
                      )}

                      {userInfo.role === 'owner' && (
                        <LinkContainer to="/users">
                          <Nav.Link style={navLinkStyle} activeStyle={activeNavLinkStyle}>
                            <FaUsers size={16} />
                            Users
                          </Nav.Link>
                        </LinkContainer>
                      )}

                      <NavDropdown 
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaUserCircle size={20} />
                            <span>{userInfo.name}</span>
                          </div>
                        } 
                        id="username"
                        align="end"
                        style={{
                          ...navLinkStyle,
                          padding: '0.5rem 0.75rem'
                        }}
                      >
                        <div style={dropdownStyle}>
                          <LinkContainer to="/profile">
                            <NavDropdown.Item style={dropdownItemStyle}>
                              Profile Settings
                            </NavDropdown.Item>
                          </LinkContainer>
                          <NavDropdown.Divider />
                          <NavDropdown.Item 
                            onClick={logoutHandler}
                            style={dropdownItemStyle}
                          >
                            Sign Out
                          </NavDropdown.Item>
                        </div>
                      </NavDropdown>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LinkContainer to="/login">
                      <Nav.Link style={navLinkStyle}>
                        <FaUserCircle size={16} />
                        Sign In
                      </Nav.Link>
                    </LinkContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Add spacing below fixed navbar */}
      <div style={{ height: '72px' }} />
    </header>
  );
};

export default Header; 