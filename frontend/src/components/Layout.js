import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    },
    main: {
      flex: 1,
      marginLeft: '250px',
      padding: '2rem',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={styles.layout}>
      {userInfo && <Sidebar />}
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 