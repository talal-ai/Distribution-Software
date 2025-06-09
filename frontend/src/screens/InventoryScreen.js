import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  listInventoryTransactions,
  createInventoryTransaction,
  getInventoryStock,
} from '../actions/inventoryActions';
import { listProducts } from '../actions/productActions';

const InventoryScreen = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState('STOCK_IN');
  const [note, setNote] = useState('');

  const inventoryTransactionList = useSelector((state) => state.inventoryTransactionList);
  const { loading, error, transactions } = inventoryTransactionList;

  const inventoryStock = useSelector((state) => state.inventoryStock);
  const { loading: loadingStock, error: errorStock, products: stockProducts } = inventoryStock;

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const inventoryTransactionCreate = useSelector((state) => state.inventoryTransactionCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = inventoryTransactionCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    } else {
      dispatch(listInventoryTransactions());
      dispatch(getInventoryStock());
      dispatch(listProducts());
    }
  }, [dispatch, userInfo, successCreate]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createInventoryTransaction({
        product: productId,
        quantity: parseInt(quantity),
        type,
        note,
      })
    );
    handleClose();
  };

  return (
    <>
      <Row className='align-items-center mb-3'>
        <Col>
          <h1>Inventory</h1>
        </Col>
        <Col className='text-end'>
          <Button onClick={handleShow}>
            <i className='fas fa-plus'></i> Add Transaction
          </Button>
        </Col>
      </Row>

      <h2>Current Stock</h2>
      {loadingStock ? (
        <Loader />
      ) : errorStock ? (
        <Message variant='danger'>{errorStock}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>BRAND</th>
              <th>CATEGORY</th>
              <th>CURRENT STOCK</th>
              <th>MIN STOCK</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {stockProducts && stockProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>{product.currentStock}</td>
                <td>{product.minStockLevel}</td>
                <td>
                  {product.currentStock <= product.minStockLevel ? (
                    <span className='text-danger'>Low Stock</span>
                  ) : (
                    <span className='text-success'>In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h2 className='mt-4'>Recent Transactions</h2>
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
              <th>PRODUCT</th>
              <th>TYPE</th>
              <th>QUANTITY</th>
              <th>NOTE</th>
              <th>USER</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td>{transaction.product.name}</td>
                <td>
                  {transaction.type === 'STOCK_IN' ? (
                    <span className='text-success'>Stock In</span>
                  ) : (
                    <span className='text-danger'>Stock Out</span>
                  )}
                </td>
                <td>{transaction.quantity}</td>
                <td>{transaction.note}</td>
                <td>{transaction.user.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Inventory Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='product' className='mb-3'>
              <Form.Label>Product</Form.Label>
              <Form.Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              >
                <option value=''>Select Product</option>
                {products && products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.brand})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='type' className='mb-3'>
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value='STOCK_IN'>Stock In</option>
                <option value='STOCK_OUT'>Stock Out</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId='quantity' className='mb-3'>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter quantity'
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min='1'
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='note' className='mb-3'>
              <Form.Label>Note</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter note'
                value={note}
                onChange={(e) => setNote(e.target.value)}
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

export default InventoryScreen; 