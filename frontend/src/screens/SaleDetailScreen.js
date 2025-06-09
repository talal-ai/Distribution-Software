import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getSaleDetails } from '../actions/saleActions';

const SaleDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const saleDetails = useSelector((state) => state.saleDetails);
  const { loading, error, sale } = saleDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    } else {
      dispatch(getSaleDetails(id));
    }
  }, [dispatch, id, userInfo]);

  const getDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
  };

  return (
    <>
      <Link to='/sales' className='btn btn-light my-3'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : sale ? (
        <>
          <h1>Sale #{sale.saleNumber}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Sale Items</h2>
                  {sale.items.length === 0 ? (
                    <Message>No items in this sale</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {sale.items.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={6}>
                              <Link to={`/products/${item.product._id}`}>
                                {item.product.name}
                              </Link>
                            </Col>
                            <Col md={2}>
                              Rs.{item.price}
                            </Col>
                            <Col md={2}>
                              {item.quantity}
                            </Col>
                            <Col md={2}>
                              Rs.{(item.price * item.quantity).toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                      <ListGroup.Item>
                        <Row>
                          <Col md={10} className='text-end'>
                            <strong>Total:</strong>
                          </Col>
                          <Col md={2}>
                            <strong>Rs.{sale.totalAmount.toFixed(2)}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Details</h2>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Payment Status: </strong>
                        {sale.paymentStatus === 'PAID' ? (
                          <span className='text-success'>Paid</span>
                        ) : sale.paymentStatus === 'PARTIAL' ? (
                          <span className='text-warning'>Partial</span>
                        ) : (
                          <span className='text-danger'>Unpaid</span>
                        )}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Payment Method: </strong>
                        {sale.payment.method}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Amount Paid: </strong>
                        Rs.{sale.payment.amount.toFixed(2)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Balance: </strong>
                        Rs.{(sale.totalAmount - sale.payment.amount).toFixed(2)}
                      </p>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {sale.note && (
                  <ListGroup.Item>
                    <h2>Notes</h2>
                    <p>{sale.note}</p>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>Sale Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Date:</Col>
                      <Col>
                        {getDate(sale.createdAt)} at {getTime(sale.createdAt)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Customer:</Col>
                      <Col>{sale.customer.name}</Col>
                    </Row>
                  </ListGroup.Item>
                  {sale.customer.phone && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Phone:</Col>
                        <Col>{sale.customer.phone}</Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Row>
                      <Col>Total Items:</Col>
                      <Col>{sale.items.length}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total Amount:</Col>
                      <Col>Rs.{sale.totalAmount.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Created By:</Col>
                      <Col>{sale.user.name}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn w-100'
                      onClick={() => window.print()}
                    >
                      Print Invoice
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Message variant='info'>Sale not found</Message>
      )}
    </>
  );
};

export default SaleDetailScreen; 