import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getInventoryStock } from '../actions/inventoryActions';
import { createSale } from '../actions/saleActions';

const SaleCreateScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [note, setNote] = useState('');

  const inventoryStock = useSelector((state) => state.inventoryStock);
  const { loading: loadingStock, error: errorStock, products } = inventoryStock;

  const saleCreate = useSelector((state) => state.saleCreate);
  const { loading, error, success, sale } = saleCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getInventoryStock());
    }
    
    if (success) {
      navigate(`/sales/${sale._id}`);
    }
  }, [dispatch, navigate, userInfo, success, sale]);

  const addItemHandler = () => {
    if (selectedProduct && quantity > 0) {
      const product = products.find((p) => p._id === selectedProduct);
      
      // Check if product already exists in items
      const existingItemIndex = items.findIndex((item) => item.product._id === selectedProduct);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += parseInt(quantity);
        updatedItems[existingItemIndex].total = 
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
        setItems(updatedItems);
      } else {
        // Add new item
        setItems([
          ...items,
          {
            product,
            quantity: parseInt(quantity),
            price: product.price,
            total: parseInt(quantity) * product.price,
          },
        ]);
      }
      
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const removeItemHandler = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.total, 0);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    const totalAmount = calculateTotal();
    const paymentStatus = 
      parseFloat(paymentAmount) >= totalAmount
        ? 'PAID'
        : parseFloat(paymentAmount) > 0
        ? 'PARTIAL'
        : 'UNPAID';
    
    dispatch(
      createSale({
        customer: {
          name: customerName,
          phone: customerPhone,
        },
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        payment: {
          amount: parseFloat(paymentAmount),
          method: paymentMethod,
        },
        paymentStatus,
        note,
      })
    );
  };

  return (
    <>
      <Link to='/sales' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Create New Sale</h1>
        {loading && <Loader />}
        {error && <Message variant='danger'>{error}</Message>}
        
        <Form onSubmit={submitHandler}>
          <h3>Customer Information</h3>
          <Row>
            <Col md={6}>
              <Form.Group controlId='customerName' className='mb-3'>
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter customer name'
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='customerPhone' className='mb-3'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter phone number'
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <h3 className='mt-4'>Sale Items</h3>
          {loadingStock ? (
            <Loader />
          ) : errorStock ? (
            <Message variant='danger'>{errorStock}</Message>
          ) : (
            <>
              <Row className='mb-3'>
                <Col md={5}>
                  <Form.Group controlId='product'>
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value=''>Select Product</option>
                      {products && products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} ({product.brand}) - Rs.{product.price} - Stock: {product.currentStock}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId='quantity'>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder='Qty'
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min='1'
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={4} className='d-flex align-items-end'>
                  <Button
                    type='button'
                    variant='secondary'
                    className='w-100'
                    onClick={addItemHandler}
                  >
                    Add Item
                  </Button>
                </Col>
              </Row>

              {items.length === 0 ? (
                <Message>No items added to sale</Message>
              ) : (
                <Table striped bordered hover responsive className='table-sm'>
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>PRICE</th>
                      <th>QTY</th>
                      <th>TOTAL</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product.name}</td>
                        <td>Rs.{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>Rs.{item.total}</td>
                        <td>
                          <Button
                            type='button'
                            variant='danger'
                            className='btn-sm'
                            onClick={() => removeItemHandler(index)}
                          >
                            <i className='fas fa-trash'></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan='3' className='text-end'><strong>Total:</strong></td>
                      <td colSpan='2'><strong>Rs.{calculateTotal()}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </>
          )}

          <h3 className='mt-4'>Payment Information</h3>
          <Row>
            <Col md={6}>
              <Form.Group controlId='paymentAmount' className='mb-3'>
                <Form.Label>Payment Amount</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter payment amount'
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min='0'
                  step='0.01'
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='paymentMethod' className='mb-3'>
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value='CASH'>Cash</option>
                  <option value='BANK_TRANSFER'>Bank Transfer</option>
                  <option value='CREDIT'>Credit</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId='note' className='mb-3'>
            <Form.Label>Note</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter note'
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
            className='mt-3'
            disabled={items.length === 0}
          >
            Create Sale
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default SaleCreateScreen; 