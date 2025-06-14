import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form, Button, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaWallet, FaHistory, FaPlus } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  listFinanceTransactions,
  createFinanceTransaction,
  getFinanceReport,
} from '../actions/financeActions';

const FinanceScreen = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    }
  }, [userInfo]);

  // Placeholder data until backend is connected
  const financeData = {
    income: 15000,
    expenses: 8500,
    balance: 6500,
    transactions: [
      {
        id: 1,
        date: '2024-03-10',
        description: 'Product Sales',
        amount: 2500,
        type: 'income',
        category: 'Sales'
      },
      {
        id: 2,
        date: '2024-03-09',
        description: 'Inventory Purchase',
        amount: 1800,
        type: 'expense',
        category: 'Inventory'
      },
      {
        id: 3,
        date: '2024-03-08',
        description: 'Utility Bills',
        amount: 300,
        type: 'expense',
        category: 'Utilities'
      }
    ]
  };

  const StatCard = ({ title, amount, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-100" style={{ 
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <div style={{
                backgroundColor: `${color}20`,
                padding: '10px',
                borderRadius: '8px',
                marginRight: '12px'
              }}>
                {icon}
              </div>
              <h6 className="mb-0" style={{ color: '#5a6268' }}>{title}</h6>
            </div>
            {trend && (
              <Badge bg={trend > 0 ? 'success' : 'danger'} style={{ fontSize: '0.8rem' }}>
                {trend > 0 ? '+' : ''}{trend}%
              </Badge>
            )}
          </div>
          <h3 className="mb-0" style={{ color: '#2c3e50', fontWeight: 600 }}>
            ${amount.toLocaleString()}
          </h3>
        </Card.Body>
      </Card>
    </motion.div>
  );

  return (
    <div>
      {/* Header Section */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2c3e50' }}>
            Finance Overview
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
            Add Transaction
          </Button>
        </Col>
      </Row>

      {/* Filter Section */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ borderRadius: '8px' }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <StatCard
            title="Total Income"
            amount={financeData.income}
            icon={<FaArrowUp size={20} color="#10b981" />}
            color="#10b981"
            trend={12}
          />
        </Col>
        <Col md={4}>
          <StatCard
            title="Total Expenses"
            amount={financeData.expenses}
            icon={<FaArrowDown size={20} color="#ef4444" />}
            color="#ef4444"
            trend={-8}
          />
        </Col>
        <Col md={4}>
          <StatCard
            title="Net Balance"
            amount={financeData.balance}
            icon={<FaWallet size={20} color="#4b6cb7" />}
            color="#4b6cb7"
          />
        </Col>
      </Row>

      {/* Transactions Table */}
      <Card style={{ 
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0" style={{ color: '#2c3e50', fontWeight: 600 }}>
              <FaHistory className="me-2" />
              Recent Transactions
            </h5>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {financeData.transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td>
                      <Badge 
                        bg="light" 
                        text="dark"
                        style={{ fontSize: '0.8rem' }}
                      >
                        {transaction.category}
                      </Badge>
                    </td>
                    <td style={{ 
                      color: transaction.type === 'income' ? '#10b981' : '#ef4444',
                      fontWeight: 500 
                    }}>
                      {transaction.type === 'income' ? '+' : '-'}
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td>
                      <Badge 
                        bg={transaction.type === 'income' ? 'success' : 'danger'}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FinanceScreen; 