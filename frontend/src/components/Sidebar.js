import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaTachometerAlt, FaBox, FaWarehouse, FaShoppingCart, 
         FaMoneyBillWave, FaChartBar, FaUsers, FaCog, FaBars, FaBook } from 'react-icons/fa';
import { logout } from '../actions/userActions';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaTachometerAlt />,
      path: '/dashboard',
      access: ['all']
    },
    {
      title: 'Products',
      icon: <FaBox />,
      path: '/products',
      access: ['all']
    },
    {
      title: 'Inventory',
      icon: <FaWarehouse />,
      path: '/inventory',
      access: ['all']
    },
    {
      title: 'Sales',
      icon: <FaShoppingCart />,
      path: '/sales',
      access: ['all']
    },
    {
      title: 'Day Book',
      icon: <FaBook />,
      path: '/daybook',
      access: ['admin', 'owner']
    },
    {
      title: 'Finance',
      icon: <FaMoneyBillWave />,
      path: '/finance',
      access: ['admin', 'owner']
    },
    {
      title: 'Reports',
      icon: <FaChartBar />,
      path: '/reports',
      access: ['admin', 'owner']
    },
    {
      title: 'Users',
      icon: <FaUsers />,
      path: '/users',
      access: ['owner']
    },
    {
      title: 'Settings',
      icon: <FaCog />,
      path: '/settings',
      access: ['admin', 'owner']
    }
  ];

  const sidebarStyles = {
    sidebar: {
      width: isCollapsed ? '70px' : '250px',
      height: '100vh',
      backgroundColor: '#fff',
      position: 'fixed',
      left: 0,
      top: 0,
      padding: '1rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '0.5rem',
      marginBottom: '2rem'
    },
    logoImage: {
      width: '32px',
      height: '32px',
      objectFit: 'contain'
    },
    logoText: {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#2c3e50',
      display: isCollapsed ? 'none' : 'block'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      color: '#64748b',
      textDecoration: 'none',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      transition: 'all 0.2s ease',
      fontSize: '0.9rem'
    },
    menuIcon: {
      fontSize: '1.2rem',
      marginRight: isCollapsed ? '0' : '10px',
      width: '20px'
    },
    activeMenuItem: {
      backgroundColor: '#4b6cb7',
      color: '#fff'
    },
    collapseButton: {
      position: 'absolute',
      right: '-12px',
      top: '20px',
      backgroundColor: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '12px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }
  };

  const isActive = (path) => location.pathname === path;

  const MenuItem = ({ item }) => {
    if (item.access.includes('all') || 
        (userInfo && item.access.includes(userInfo.role))) {
      return (
        <Link
          to={item.path}
          style={{
            ...sidebarStyles.menuItem,
            ...(isActive(item.path) ? sidebarStyles.activeMenuItem : {})
          }}
        >
          <span style={sidebarStyles.menuIcon}>{item.icon}</span>
          {!isCollapsed && <span>{item.title}</span>}
        </Link>
      );
    }
    return null;
  };

  return (
    <motion.div
      style={sidebarStyles.sidebar}
      initial={false}
      animate={{
        width: isCollapsed ? '70px' : '250px'
      }}
    >
      <div style={sidebarStyles.logo}>
        <img src="/logo.png" alt="Logo" style={sidebarStyles.logoImage} />
        {!isCollapsed && <span style={sidebarStyles.logoText}>Distribution</span>}
      </div>

      <div
        style={sidebarStyles.collapseButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FaBars />
      </div>

      <div style={{ flex: 1 }}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar; 