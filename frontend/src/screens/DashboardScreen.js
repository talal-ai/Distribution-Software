import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaUserCheck, FaChartLine, FaMoneyBillWave,
  FaArrowUp, FaArrowDown, FaFileInvoiceDollar
} from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getInventoryStock } from '../actions/inventoryActions';
import { getSalesReport } from '../actions/saleActions';
import { getFinanceReport } from '../actions/financeActions';
import SalarySheetModal from '../components/SalarySheetModal';

const DashboardScreen = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const inventoryStock = useSelector((state) => state.inventoryStock);
  const { loading: loadingStock, error: errorStock, products, lowStock } = inventoryStock;

  const saleReport = useSelector((state) => state.saleReport);
  const { 
    loading: loadingSales, 
    error: errorSales, 
    dailySales, 
    monthlySales 
  } = saleReport;

  const financeReport = useSelector((state) => state.financeReport);
  const { 
    loading: loadingFinance, 
    error: errorFinance, 
    cashflow 
  } = financeReport;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getInventoryStock());
    dispatch(getSalesReport());
    
    if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner')) {
      dispatch(getFinanceReport());
    }
  }, [dispatch, userInfo]);

  const StatCard = ({ icon: Icon, title, value, increase, color }) => (
    <motion.div
      whileHover={{ translateY: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="border-0 shadow-sm" style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: `linear-gradient(45deg, ${color}08 0%, ${color}03 100%)`
      }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <Icon size={24} style={{ color: color }} />
              </div>
              <div>
                <h6 className="mb-0" style={{ color: '#6c757d', fontSize: '0.875rem' }}>{title}</h6>
                <h3 className="mb-0" style={{ 
                  color: '#2c3e50', 
                  fontSize: '1.75rem', 
                  fontWeight: '600',
                  marginTop: '4px' 
                }}>{value}</h3>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center mt-3" style={{ fontSize: '0.875rem' }}>
            <div style={{
              color: increase.startsWith('+') ? '#28a745' : '#dc3545',
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {increase.startsWith('+') ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
              <span className="ms-1">{increase}</span>
            </div>
            <span style={{ color: '#6c757d' }}>this week</span>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}
    >
      <Row className="align-items-center mb-4">
        <Col>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: '#2c3e50',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            Dashboard Overview
          </h1>
          <p style={{ 
            color: '#6c757d', 
            margin: '0.5rem 0 0 0',
            fontSize: '1rem' 
          }}>
            Welcome back to your dashboard
          </p>
        </Col>
      </Row>

      <Row className="g-4 mb-2">
        <Col md={6}>
          <StatCard
            icon={FaUsers}
            title="Total Products"
            value={products?.length || 0}
            increase="+5"
            color="#4285f4"
          />
        </Col>
        <Col md={6}>
          <StatCard
            icon={FaUserCheck}
            title="Low Stock Items"
            value={lowStock?.length || 0}
            increase="-2"
            color="#34a853"
          />
        </Col>
      </Row>
      <Row className="g-4 mb-5">
        <Col md={6}>
          <StatCard
            icon={FaChartLine}
            title="Today's Sales"
            value={dailySales?.count || 0}
            increase="+15"
            color="#fbbc05"
          />
        </Col>
        <Col md={6}>
          <div style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)}>
            <StatCard
              icon={FaFileInvoiceDollar}
              title="View Salary Sheet"
              value={''}
              increase={''}
              color="#6f42c1"
            />
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0" style={{ color: '#2c3e50', fontWeight: 600 }}>Recent Sales</h5>
                <div className="d-flex gap-2">
                  <select className="form-select form-select-sm" style={{ width: '120px' }}>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {loadingSales ? (
                <Loader />
              ) : errorSales ? (
                <Message variant="danger">{errorSales}</Message>
              ) : dailySales?.sales?.length === 0 ? (
                <Message>No recent sales</Message>
              ) : (
                <div className="list-group list-group-flush">
                  {dailySales?.sales?.slice(0, 5).map((sale) => (
                    <div key={sale._id} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1" style={{ color: '#2c3e50' }}>{sale.saleNumber}</h6>
                          <small style={{ color: '#6c757d' }}>{sale.customer.name}</small>
                        </div>
                        <div style={{ color: '#28a745' }}>
                          Rs. {sale.totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
              <h5 className="mb-0" style={{ color: '#2c3e50', fontWeight: 600 }}>Recent Activities</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="timeline">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="timeline-item pb-4" style={{ position: 'relative' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#4285f4',
                      position: 'absolute',
                      left: '-5px',
                      top: '6px'
                    }}></div>
                    <div style={{
                      borderLeft: '2px solid #e9ecef',
                      paddingLeft: '20px',
                      marginLeft: '0'
                    }}>
                      <h6 className="mb-1" style={{ fontSize: '0.875rem', color: '#2c3e50' }}>
                        New sale recorded
                      </h6>
                      <p className="mb-0" style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                        Product XYZ sold for $500
                      </p>
                      <small style={{ color: '#adb5bd' }}>30 minutes ago</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <SalarySheetModal show={showModal} onHide={() => setShowModal(false)} salesman="AMIR" />

      <Button onClick={() => setShowModal(true)}>View Salary Sheet</Button>
    </motion.div>
  );
};

export default DashboardScreen; 