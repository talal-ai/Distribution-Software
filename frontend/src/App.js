import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Layout from './components/Layout';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductScreen from './screens/ProductScreen';
import InventoryScreen from './screens/InventoryScreen';
import SalesScreen from './screens/SalesScreen';
import FinanceScreen from './screens/FinanceScreen';
import ReportsScreen from './screens/ReportsScreen';
import UsersScreen from './screens/UsersScreen';
import SettingsScreen from './screens/SettingsScreen';
import DayBookScreen from './screens/DayBookScreen';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/products" element={<ProductScreen />} />
          <Route path="/inventory" element={<InventoryScreen />} />
          <Route path="/sales" element={<SalesScreen />} />
          <Route path="/finance" element={<FinanceScreen />} />
          <Route path="/reports" element={<ReportsScreen />} />
          <Route path="/users" element={<UsersScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/daybook" element={<DayBookScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 