import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getInventoryStock } from '../actions/inventoryActions';
import { getSalesReport } from '../actions/saleActions';
import { getFinanceReport } from '../actions/financeActions';

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

  useEffect(() => {
    dispatch(getInventoryStock());
    dispatch(getSalesReport());
    
    if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner')) {
      dispatch(getFinanceReport());
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <h1>Dashboard</h1>
      <Row className="mb-3">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body>
              <Card.Title>Products</Card.Title>
              {loadingStock ? (
                <Loader />
              ) : errorStock ? (
                <Message variant="danger">{errorStock}</Message>
              ) : (
                <h2>{products?.length || 0}</h2>
              )}
            </Card.Body>
            <LinkContainer to="/products">
              <Card.Footer className="text-white">
                View Products <i className="fas fa-arrow-circle-right"></i>
              </Card.Footer>
            </LinkContainer>
          </Card>
        </Col>

        <Col>
          <Card className="bg-warning text-white">
            <Card.Body>
              <Card.Title>Low Stock Items</Card.Title>
              {loadingStock ? (
                <Loader />
              ) : errorStock ? (
                <Message variant="danger">{errorStock}</Message>
              ) : (
                <h2>{lowStock?.length || 0}</h2>
              )}
            </Card.Body>
            <LinkContainer to="/inventory">
              <Card.Footer className="text-white">
                View Inventory <i className="fas fa-arrow-circle-right"></i>
              </Card.Footer>
            </LinkContainer>
          </Card>
        </Col>

        <Col>
          <Card className="bg-success text-white">
            <Card.Body>
              <Card.Title>Today's Sales</Card.Title>
              {loadingSales ? (
                <Loader />
              ) : errorSales ? (
                <Message variant="danger">{errorSales}</Message>
              ) : (
                <h2>{dailySales?.count || 0}</h2>
              )}
            </Card.Body>
            <LinkContainer to="/sales">
              <Card.Footer className="text-white">
                View Sales <i className="fas fa-arrow-circle-right"></i>
              </Card.Footer>
            </LinkContainer>
          </Card>
        </Col>

        {userInfo && (userInfo.role === 'admin' || userInfo.role === 'owner') && (
          <Col>
            <Card className="bg-info text-white">
              <Card.Body>
                <Card.Title>Cash Balance</Card.Title>
                {loadingFinance ? (
                  <Loader />
                ) : errorFinance ? (
                  <Message variant="danger">{errorFinance}</Message>
                ) : (
                  <h2>{cashflow?.balance?.toFixed(2) || 0}</h2>
                )}
              </Card.Body>
              <LinkContainer to="/finance">
                <Card.Footer className="text-white">
                  View Finance <i className="fas fa-arrow-circle-right"></i>
                </Card.Footer>
              </LinkContainer>
            </Card>
          </Col>
        )}
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h3>Recent Sales</h3>
            </Card.Header>
            <Card.Body>
              {loadingSales ? (
                <Loader />
              ) : errorSales ? (
                <Message variant="danger">{errorSales}</Message>
              ) : dailySales?.sales?.length === 0 ? (
                <Message>No recent sales</Message>
              ) : (
                <ul className="list-group">
                  {dailySales?.sales?.slice(0, 5).map((sale) => (
                    <LinkContainer key={sale._id} to={`/sales/${sale._id}`}>
                      <li className="list-group-item">
                        {sale.saleNumber} - {sale.customer.name} - Rs.{sale.totalAmount.toFixed(2)}
                      </li>
                    </LinkContainer>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h3>Low Stock Products</h3>
            </Card.Header>
            <Card.Body>
              {loadingStock ? (
                <Loader />
              ) : errorStock ? (
                <Message variant="danger">{errorStock}</Message>
              ) : lowStock?.length === 0 ? (
                <Message>No low stock items</Message>
              ) : (
                <ul className="list-group">
                  {lowStock?.slice(0, 5).map((product) => (
                    <LinkContainer key={product._id} to={`/products/${product._id}/edit`}>
                      <li className="list-group-item">
                        {product.name} ({product.brand}) - {product.currentStock} left
                      </li>
                    </LinkContainer>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardScreen; 