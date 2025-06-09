import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getInventoryReport } from '../actions/inventoryActions';
import { getSalesReport } from '../actions/saleActions';
import { getFinanceReport } from '../actions/financeActions';

const ReportsScreen = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const inventoryReport = useSelector((state) => state.inventoryReport);
  const { loading: loadingInventory, error: errorInventory, report: inventoryData } = inventoryReport;

  const saleReport = useSelector((state) => state.saleReport);
  const { loading: loadingSales, error: errorSales, dailySales, monthlySales } = saleReport;

  const financeReport = useSelector((state) => state.financeReport);
  const { loading: loadingFinance, error: errorFinance, cashflow } = financeReport;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    }
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    
    const params = {
      dateRange,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    
    if (reportType === 'inventory') {
      dispatch(getInventoryReport(params));
    } else if (reportType === 'sales') {
      dispatch(getSalesReport(params));
    } else if (reportType === 'finance') {
      dispatch(getFinanceReport(params));
    }
  };

  const renderReport = () => {
    if (reportType === 'inventory' && inventoryData) {
      return (
        <div>
          <h3>Inventory Report</h3>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Total Products</Card.Title>
                  <Card.Text as="h2">{inventoryData.totalProducts}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Low Stock Items</Card.Title>
                  <Card.Text as="h2">{inventoryData.lowStockCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Out of Stock Items</Card.Title>
                  <Card.Text as="h2">{inventoryData.outOfStockCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <h4>Stock Value</h4>
          <p>Total Inventory Value: Rs.{inventoryData.totalValue?.toFixed(2)}</p>
        </div>
      );
    } else if (reportType === 'sales') {
      const salesData = dateRange === 'daily' ? dailySales : monthlySales;
      
      if (salesData) {
        return (
          <div>
            <h3>Sales Report</h3>
            <Row>
              <Col md={4}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Sales</Card.Title>
                    <Card.Text as="h2">{salesData.count}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Total Revenue</Card.Title>
                    <Card.Text as="h2">Rs.{salesData.totalRevenue?.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Average Sale Value</Card.Title>
                    <Card.Text as="h2">
                      Rs.{salesData.count > 0
                        ? (salesData.totalRevenue / salesData.count).toFixed(2)
                        : '0.00'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
      }
    } else if (reportType === 'finance' && cashflow) {
      return (
        <div>
          <h3>Finance Report</h3>
          <Row>
            <Col md={4}>
              <Card className="mb-4 bg-success text-white">
                <Card.Body>
                  <Card.Title>Total Income</Card.Title>
                  <Card.Text as="h2">Rs.{cashflow.income?.toFixed(2)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 bg-danger text-white">
                <Card.Body>
                  <Card.Title>Total Expenses</Card.Title>
                  <Card.Text as="h2">Rs.{cashflow.expenses?.toFixed(2)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 bg-info text-white">
                <Card.Body>
                  <Card.Title>Net Balance</Card.Title>
                  <Card.Text as="h2">Rs.{cashflow.balance?.toFixed(2)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <h4>Category Breakdown</h4>
          <Row>
            {cashflow.categories && Object.entries(cashflow.categories).map(([category, amount]) => (
              <Col md={3} key={category}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>{category}</Card.Title>
                    <Card.Text>Rs.{amount.toFixed(2)}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      <h1>Reports</h1>
      <Form onSubmit={submitHandler} className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Group controlId="reportType" className="mb-3">
              <Form.Label>Report Type</Form.Label>
              <Form.Select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="sales">Sales Report</option>
                <option value="inventory">Inventory Report</option>
                {userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner') && (
                  <option value="finance">Finance Report</option>
                )}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={3}>
            <Form.Group controlId="dateRange" className="mb-3">
              <Form.Label>Date Range</Form.Label>
              <Form.Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Range</option>
              </Form.Select>
            </Form.Group>
          </Col>
          
          {dateRange === 'custom' && (
            <>
              <Col md={3}>
                <Form.Group controlId="startDate" className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group controlId="endDate" className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </>
          )}
          
          <Col md={12} className="mt-2">
            <Button type="submit" variant="primary">
              Generate Report
            </Button>
          </Col>
        </Row>
      </Form>
      
      {loadingInventory || loadingSales || loadingFinance ? (
        <Loader />
      ) : errorInventory ? (
        <Message variant="danger">{errorInventory}</Message>
      ) : errorSales ? (
        <Message variant="danger">{errorSales}</Message>
      ) : errorFinance ? (
        <Message variant="danger">{errorFinance}</Message>
      ) : (
        renderReport()
      )}
    </>
  );
};

export default ReportsScreen; 