import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, Modal, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  listInventoryTransactions,
  createInventoryTransaction,
  getInventoryStock,
} from '../actions/inventoryActions';
import { listProducts } from '../actions/productActions';
import { FaPlus, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const InventoryScreen = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState('STOCK_IN');
  const [note, setNote] = useState('');

  const inventoryTransactionList = useSelector((state) => state.inventoryTransactionList);
  const { loading, error, transactions = [] } = inventoryTransactionList;

  const inventoryStock = useSelector((state) => state.inventoryStock);
  const { loading: loadingStock, error: errorStock, products: stockProducts = [] } = inventoryStock;

  const productList = useSelector((state) => state.productList);
  const { loading: loadingProducts, error: errorProducts, products = [] } = productList;

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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="mb-0" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2c3e50' }}>
            Inventory
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
            onClick={handleShow}
          >
            <FaPlus size={14} />
            Add Item
          </Button>
        </Col>
      </Row>

      <h2>Current Stock</h2>
      {loadingStock ? (
        <Loader />
      ) : errorStock ? (
        <Message variant='danger'>{errorStock}</Message>
      ) : (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Reorder Point</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stockProducts) && stockProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.currentStock}</td>
                  <td>{product.minStockLevel}</td>
                  <td>
                    <Badge 
                      bg={getStatusBadgeVariant(product.currentStock <= product.minStockLevel ? 'Low Stock' : 'In Stock')}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {product.currentStock <= product.minStockLevel ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="light"
                        size="sm"
                        className="d-flex align-items-center"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <FaEdit size={14} />
                      </Button>
                      <Button 
                        variant="light"
                        size="sm"
                        className="d-flex align-items-center"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <FaBoxOpen size={14} />
                      </Button>
                      <Button 
                        variant="danger"
                        size="sm"
                        className="d-flex align-items-center"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <FaTrash size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <h2 className='mt-4'>Recent Transactions</h2>
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Note</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(transactions) && transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                  <td>{transaction.product?.name || 'N/A'}</td>
                  <td>
                    <Badge 
                      bg={transaction.type === 'STOCK_IN' ? 'success' : 'danger'}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {transaction.type === 'STOCK_IN' ? 'Stock In' : 'Stock Out'}
                    </Badge>
                  </td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.note}</td>
                  <td>{transaction.user?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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
                {Array.isArray(products) && products.map((product) => (
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
              />
            </Form.Group>

            <Form.Group controlId='note' className='mb-3'>
              <Form.Label>Note</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter note'
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>

            <Button 
              type='submit' 
              variant='primary'
              style={{
                backgroundColor: '#4b6cb7',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem'
              }}
            >
              Add Transaction
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default InventoryScreen; 