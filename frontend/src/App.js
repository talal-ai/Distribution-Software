import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import InventoryScreen from './screens/InventoryScreen';
import SalesScreen from './screens/SalesScreen';
import SaleCreateScreen from './screens/SaleCreateScreen';
import SaleDetailScreen from './screens/SaleDetailScreen';
import FinanceScreen from './screens/FinanceScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReportsScreen from './screens/ReportsScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            
            {/* Private Routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              
              <Route path="/products" element={<ProductListScreen />} />
              <Route path="/products/:id/edit" element={<ProductEditScreen />} />
              
              <Route path="/inventory" element={<InventoryScreen />} />
              
              <Route path="/sales" element={<SalesScreen />} />
              <Route path="/sales/create" element={<SaleCreateScreen />} />
              <Route path="/sales/:id" element={<SaleDetailScreen />} />
              
              <Route path="/finance" element={<FinanceScreen />} />
              
              <Route path="/users" element={<UserListScreen />} />
              <Route path="/users/:id/edit" element={<UserEditScreen />} />
              
              <Route path="/reports" element={<ReportsScreen />} />
            </Route>
          </Routes>
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App; 