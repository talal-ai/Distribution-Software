import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listSales } from '../actions/saleActions';

const SalesScreen = () => {
  const dispatch = useDispatch();

  const saleList = useSelector((state) => state.saleList);
  const { loading, error, sales } = saleList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    } else {
      dispatch(listSales());
    }
  }, [dispatch, userInfo]);

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Sales</h1>
        </Col>
        <Col className='text-end'>
          <LinkContainer to='/sales/create'>
            <Button className='my-3'>
              <i className='fas fa-plus'></i> New Sale
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>SALE #</th>
              <th>DATE</th>
              <th>CUSTOMER</th>
              <th>TOTAL</th>
              <th>PAYMENT STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {sales && sales.map((sale) => (
              <tr key={sale._id}>
                <td>{sale.saleNumber}</td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>{sale.customer.name}</td>
                <td>Rs.{sale.totalAmount.toFixed(2)}</td>
                <td>
                  {sale.paymentStatus === 'PAID' ? (
                    <span className='text-success'>Paid</span>
                  ) : sale.paymentStatus === 'PARTIAL' ? (
                    <span className='text-warning'>Partial</span>
                  ) : (
                    <span className='text-danger'>Unpaid</span>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/sales/${sale._id}`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-eye'></i>
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default SalesScreen; 