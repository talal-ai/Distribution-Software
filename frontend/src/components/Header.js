import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Distribution Management</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  <LinkContainer to="/dashboard">
                    <Nav.Link>
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </Nav.Link>
                  </LinkContainer>
                  
                  <LinkContainer to="/products">
                    <Nav.Link>
                      <i className="fas fa-box"></i> Products
                    </Nav.Link>
                  </LinkContainer>
                  
                  <LinkContainer to="/inventory">
                    <Nav.Link>
                      <i className="fas fa-warehouse"></i> Inventory
                    </Nav.Link>
                  </LinkContainer>
                  
                  <LinkContainer to="/sales">
                    <Nav.Link>
                      <i className="fas fa-shopping-cart"></i> Sales
                    </Nav.Link>
                  </LinkContainer>
                  
                  {(userInfo.role === 'admin' || userInfo.role === 'owner') && (
                    <>
                      <LinkContainer to="/finance">
                        <Nav.Link>
                          <i className="fas fa-money-bill-wave"></i> Finance
                        </Nav.Link>
                      </LinkContainer>
                      
                      <LinkContainer to="/reports">
                        <Nav.Link>
                          <i className="fas fa-chart-bar"></i> Reports
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}
                  
                  {userInfo.role === 'owner' && (
                    <LinkContainer to="/users">
                      <Nav.Link>
                        <i className="fas fa-users"></i> Users
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 