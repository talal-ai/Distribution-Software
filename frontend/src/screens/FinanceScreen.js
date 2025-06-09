import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  listFinanceTransactions,
  createFinanceTransaction,
  getFinanceReport,
} from '../actions/financeActions';

const FinanceScreen = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('INCOME');
  const [category, setCategory] = useState('SALES');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const financeTransactionList = useSelector((state) => state.financeTransactionList);
  const { loading, error, transactions } = financeTransactionList;

  const financeReport = useSelector((state) => state.financeReport);
  const { loading: loadingReport, error: errorReport, cashflow } = financeReport;

  const financeTransactionCreate = useSelector((state) => state.financeTransactionCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = financeTransactionCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !(userInfo.role === 'admin' || userInfo.role === 'owner')) {
      window.location.href = '/login';
    } else {
      dispatch(listFinanceTransactions());
      dispatch(getFinanceReport());
    }
  }, [dispatch, userInfo, successCreate]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createFinanceTransaction({
        type,
        category,
        amount: parseFloat(amount),
        description,
        paymentMethod,
      })
    );
    handleClose();
  };

  return (
    <>
      <Row className='align-items-center mb-3'>
        <Col>
          <h1>Finance</h1>
        </Col>
        <Col className='text-end'>
          <Button onClick={handleShow}>
            <i className='fas fa-plus'></i> Add Transaction
          </Button>
        </Col>
      </Row>

      <Row className='mb-4'>
        <Col md={4}>
          <div className='bg-success text-white p-3 rounded'>
            <h3>Income</h3>
            {loadingReport ? (
              <Loader />
            ) : errorReport ? (
              <Message variant='danger'>{errorReport}</Message>
            ) : (
              <h2>Rs.{cashflow?.income?.toFixed(2) || 0}</h2>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className='bg-danger text-white p-3 rounded'>
            <h3>Expenses</h3>
            {loadingReport ? (
              <Loader />
            ) : errorReport ? (
              <Message variant='danger'>{errorReport}</Message>
            ) : (
              <h2>Rs.{cashflow?.expenses?.toFixed(2) || 0}</h2>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className='bg-info text-white p-3 rounded'>
            <h3>Balance</h3>
            {loadingReport ? (
              <Loader />
            ) : errorReport ? (
              <Message variant='danger'>{errorReport}</Message>
            ) : (
              <h2>Rs.{cashflow?.balance?.toFixed(2) || 0}</h2>
            )}
          </div>
        </Col>
      </Row>

      <h2>Recent Transactions</h2>
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>DATE</th>
              <th>TYPE</th>
              <th>CATEGORY</th>
              <th>AMOUNT</th>
              <th>PAYMENT METHOD</th>
              <th>DESCRIPTION</th>
              <th>USER</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td>
                  {transaction.type === 'INCOME' ? (
                    <span className='text-success'>Income</span>
                  ) : (
                    <span className='text-danger'>Expense</span>
                  )}
                </td>
                <td>{transaction.category}</td>
                <td>Rs.{transaction.amount.toFixed(2)}</td>
                <td>{transaction.paymentMethod}</td>
                <td>{transaction.description}</td>
                <td>{transaction.user.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Financial Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='type' className='mb-3'>
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value='INCOME'>Income</option>
                <option value='EXPENSE'>Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='category' className='mb-3'>
              <Form.Label>Category</Form.Label>
              {type === 'INCOME' ? (
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value='SALES'>Sales</option>
                  <option value='INVESTMENT'>Investment</option>
                  <option value='LOAN'>Loan</option>
                  <option value='OTHER'>Other</option>
                </Form.Select>
              ) : (
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value='PURCHASE'>Purchase</option>
                  <option value='RENT'>Rent</option>
                  <option value='SALARY'>Salary</option>
                  <option value='UTILITIES'>Utilities</option>
                  <option value='TRANSPORT'>Transport</option>
                  <option value='OTHER'>Other</option>
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group controlId='amount' className='mb-3'>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min='0'
                step='0.01'
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='paymentMethod' className='mb-3'>
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value='CASH'>Cash</option>
                <option value='BANK_TRANSFER'>Bank Transfer</option>
                <option value='CHEQUE'>Cheque</option>
                <option value='CREDIT_CARD'>Credit Card</option>
                <option value='OTHER'>Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='description' className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Add Transaction
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FinanceScreen; 