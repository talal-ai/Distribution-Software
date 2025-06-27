import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import SalesScreen from './screens/SalesScreen';
import InventoryScreen from './screens/InventoryScreen';
import DashboardScreen from './screens/DashboardScreen';
import FinanceScreen from './screens/FinanceScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import DayBookScreen from './screens/DayBookScreen';
import UserAddScreen from './screens/UserAddScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container fluid>
          <Routes>
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/admin/userlist' element={<UserListScreen />} />
            <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
            <Route path='/admin/productlist' element={<ProductListScreen />} />
            <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
            <Route path='/sales' element={<SalesScreen />} />
            <Route path='/inventory' element={<InventoryScreen />} />
            <Route path='/dashboard' element={<DashboardScreen />} />
            <Route path='/finance' element={<FinanceScreen />} />
            <Route path='/reports' element={<ReportsScreen />} />
            <Route path='/settings' element={<SettingsScreen />} />
            <Route path='/attendance' element={<AttendanceScreen />} />
            <Route path='/daybook' element={<DayBookScreen />} />
            <Route path='/admin/useradd' element={<UserAddScreen />} />
            <Route path='/' element={<HomeScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App; 