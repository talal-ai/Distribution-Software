import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, Modal, Badge, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  listInventoryTransactions,
  createInventoryTransaction,
  getInventoryStock,
  updateProductCostPrice,
} from '../actions/inventoryActions';
import { listProducts } from '../actions/productActions';
import { FaPlus, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const InventoryScreen = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [type, setType] = useState('STOCK_IN');
  const [note, setNote] = useState('');

  // Brand names for order sheet
  const brandNames = [
    "Morven",
    "Classic",
    "Diplomat",
    "Red & White",
    "Marlboro Gold",
    "Crafted By MLB",
    "COOL MINT 2 DOT 6MG",
    "COOL MINT 3 DOT 11 MG",
    "COOL MINT 5 DOT 14 MG",
    "SOUR RUBY 2 DOT 6 MG",
    "SOUR RUBY 3 DOT 11MG",
    "COOL BLUE BERRY 2 DOT 6 MG",
    "COOL BLUE BERRY 3 DOT 11 MG",
    "FRESH MINT 2 DOT 6 MG",
    "FRESH MINT 3 DOT 11 MG",
    "COOL WATERMELON 2 DOT",
    "COOL WATERMELON 3 DOT"
  ];

  // Store local product costs
  const [localCosts, setLocalCosts] = useState({
    "Morven": 11480.18,
    "Classic": 8003.73,
    "Diplomat": 8975.73,
    "Red & White": 9477.88,
    "Marlboro Gold": 26823.52,
    "Crafted By MLB": 7870.76,
    "COOL MINT 2 DOT 6MG": 6561.19,
    "COOL MINT 3 DOT 11 MG": 7933.65,
    "COOL MINT 5 DOT 14 MG": 8803.42,
    "SOUR RUBY 2 DOT 6 MG": 6561.19,
    "SOUR RUBY 3 DOT 11MG": 7933.65,
    "COOL BLUE BERRY 2 DOT 6 MG": 6561.19,
    "COOL BLUE BERRY 3 DOT 11 MG": 7933.65,
    "FRESH MINT 2 DOT 6 MG": 6561.19,
    "FRESH MINT 3 DOT 11 MG": 7933.65,
    "COOL WATERMELON 2 DOT": 6561.19,
    "COOL WATERMELON 3 DOT": 7933.65
  });
  
  // Initialize order items with all brand names
  const [orderItems, setOrderItems] = useState([]);
  
  // Initialize order items when brand names change
  useEffect(() => {
    setOrderItems(brandNames.map(name => ({
      brandName: name,
      quantity: '',
      costPrice: '',
      amount: 0
    })));
  }, [brandNames]);
  
  // Monthly purchase tracking state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM format
  const [purchaseRecords, setPurchaseRecords] = useState({});
  
  // Target values for products - pre-populated from image
  const [targetValues, setTargetValues] = useState({
    "Morven": 840,
    "Classic": 130,
    "Diplomat": 100,
    "Red & White": 120,
    "Marlboro Gold": 20,
    "Crafted By MLB": 30,
    "COOL MINT 2 DOT 6MG": 2
  });
  
  // Function to update target values
  const handleTargetChange = (product, value) => {
    setTargetValues(prev => ({
      ...prev,
      [product]: Number(value) || 0
    }));
    
    // Save to localStorage
    const savedTargets = JSON.parse(localStorage.getItem('purchaseTargets') || '{}');
    savedTargets[currentMonth] = {
      ...savedTargets[currentMonth],
      [product]: Number(value) || 0
    };
    localStorage.setItem('purchaseTargets', JSON.stringify(savedTargets));
  };

  // Load purchase records and targets from localStorage on component mount
  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('purchaseRecords') || '{}');
    setPurchaseRecords(savedRecords);
    
    // Load targets
    const savedTargets = JSON.parse(localStorage.getItem('purchaseTargets') || '{}');
    if (savedTargets[currentMonth]) {
      setTargetValues(prev => ({
        ...prev,
        ...savedTargets[currentMonth]
      }));
    }
  }, [currentMonth]);

  // Function to initialize sample data from the image
  const initializeSampleData = () => {
    // Sample purchase data from the image
    const sampleData = [
      {
        date: "2025-05-02", // Friday, May 2, 2025
        items: [
          { brandName: "Morven", quantity: 100, costPrice: 100, amount: 10000 },
          { brandName: "Classic", quantity: 20, costPrice: 100, amount: 2000 },
          { brandName: "Diplomat", quantity: 20, costPrice: 100, amount: 2000 },
          { brandName: "Red & White", quantity: 20, costPrice: 100, amount: 2000 },
          { brandName: "Crafted By MLB", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "COOL MINT 2 DOT 6MG", quantity: 2, costPrice: 100, amount: 200 },
          { brandName: "FRESH MINT 2 DOT 6 MG", quantity: 2, costPrice: 100, amount: 200 },
          { brandName: "FRESH MINT 3 DOT 11 MG", quantity: 2, costPrice: 100, amount: 200 }
        ],
        totalAmount: 17400
      },
      {
        date: "2025-05-05", // Monday, May 5, 2025
        items: [
          { brandName: "Morven", quantity: 70, costPrice: 100, amount: 7000 },
          { brandName: "Classic", quantity: 10, costPrice: 100, amount: 1000 }
        ],
        totalAmount: 8000
      },
      {
        date: "2025-05-08", // Thursday, May 8, 2025
        items: [
          { brandName: "Morven", quantity: 50, costPrice: 100, amount: 5000 },
          { brandName: "Classic", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Diplomat", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Red & White", quantity: 10, costPrice: 100, amount: 1000 }
        ],
        totalAmount: 8000
      },
      {
        date: "2025-05-12", // Monday, May 12, 2025
        items: [
          { brandName: "Morven", quantity: 120, costPrice: 100, amount: 12000 },
          { brandName: "Classic", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Diplomat", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Red & White", quantity: 30, costPrice: 100, amount: 3000 }
        ],
        totalAmount: 17000
      },
      {
        date: "2025-05-15", // Thursday, May 15, 2025
        items: [
          { brandName: "Morven", quantity: 100, costPrice: 100, amount: 10000 },
          { brandName: "Classic", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Diplomat", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Red & White", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Marlboro Gold", quantity: 10, costPrice: 100, amount: 1000 }
        ],
        totalAmount: 14000
      },
      {
        date: "2025-05-19", // Monday, May 19, 2025
        items: [
          { brandName: "Morven", quantity: 70, costPrice: 100, amount: 7000 },
          { brandName: "Classic", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Diplomat", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Red & White", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Crafted By MLB", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "COOL MINT 5 DOT 14 MG", quantity: 1, costPrice: 100, amount: 100 },
          { brandName: "SOUR RUBY 2 DOT 6 MG", quantity: 1, costPrice: 100, amount: 100 },
          { brandName: "FRESH MINT 2 DOT 6 MG", quantity: 1, costPrice: 100, amount: 100 },
          { brandName: "FRESH MINT 3 DOT 11 MG", quantity: 1, costPrice: 100, amount: 100 },
          { brandName: "COOL WATERMELON 2 DOT", quantity: 1, costPrice: 100, amount: 100 },
          { brandName: "COOL WATERMELON 3 DOT", quantity: 1, costPrice: 100, amount: 100 }
        ],
        totalAmount: 11600
      },
      {
        date: "2025-05-22", // Thursday, May 22, 2025
        items: [
          { brandName: "Morven", quantity: 80, costPrice: 100, amount: 8000 },
          { brandName: "Classic", quantity: 20, costPrice: 100, amount: 2000 },
          { brandName: "Red & White", quantity: 20, costPrice: 100, amount: 2000 }
        ],
        totalAmount: 12000
      },
      {
        date: "2025-05-26", // Monday, May 26, 2025
        items: [
          { brandName: "Morven", quantity: 120, costPrice: 100, amount: 12000 },
          { brandName: "Classic", quantity: 10, costPrice: 100, amount: 1000 },
          { brandName: "Diplomat", quantity: 20, costPrice: 100, amount: 2000 },
          { brandName: "Red & White", quantity: 20, costPrice: 100, amount: 2000 },
          { brandName: "Marlboro Gold", quantity: 10, costPrice: 100, amount: 1000 }
        ],
        totalAmount: 18000
      },
      {
        date: "2025-05-29", // Thursday, May 29, 2025
        items: [
          { brandName: "Morven", quantity: 130, costPrice: 100, amount: 13000 },
          { brandName: "Classic", quantity: 30, costPrice: 100, amount: 3000 },
          { brandName: "Diplomat", quantity: 20, costPrice: 100, amount: 2000 },
          { brandName: "Crafted By MLB", quantity: 10, costPrice: 100, amount: 1000 }
        ],
        totalAmount: 19000
      }
    ];
    
    // Set the month to May 2025 to match the image
    const targetMonth = "2025-05";
    setCurrentMonth(targetMonth);
    
    // Save to state
    setPurchaseRecords(prev => ({
      ...prev,
      [targetMonth]: sampleData
    }));
    
    // Save to localStorage
    localStorage.setItem('purchaseRecords', JSON.stringify({
      [targetMonth]: sampleData
    }));
    
    // Save targets to localStorage
    localStorage.setItem('purchaseTargets', JSON.stringify({
      [targetMonth]: targetValues
    }));
    
    alert('Sample data initialized for May 2025. Please check the Monthly Purchase section.');
  };

  const inventoryTransactionList = useSelector((state) => state.inventoryTransactionList);
  const { loading, error, transactions = [] } = inventoryTransactionList;

  const inventoryStock = useSelector((state) => state.inventoryStock);
  const { loading: loadingStock, error: errorStock, products: stockProducts = [] } = inventoryStock;

  const productList = useSelector((state) => state.productList);
  const { products = [] } = productList;

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
        costPrice: parseFloat(costPrice),
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

  const handleCostPriceChange = (productName, newCostPrice) => {
    // Update local state immediately for responsive UI
    setLocalCosts(prev => ({
      ...prev,
      [productName]: newCostPrice
    }));
    
    // Debounced API call - only update in backend after user stops typing
    if (newCostPrice && !isNaN(newCostPrice)) {
      clearTimeout(window.costPriceTimeout);
      window.costPriceTimeout = setTimeout(() => {
        const product = stockProducts.find(p => p.name === productName);
        if (product) {
          dispatch(updateProductCostPrice({
            productId: product._id,
            costPrice: parseFloat(newCostPrice)
          }));
        }
      }, 500);
    }
  };

  // Functions for the monthly purchase form
  const handleOrderQuantityChange = (index, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index].quantity = value;
    
    // Update amount for this item
    const qty = parseFloat(value) || 0;
    const cost = parseFloat(updatedItems[index].costPrice) || 0;
    updatedItems[index].amount = qty * cost;
    
    setOrderItems(updatedItems);
  };

  // Calculate total amount of current order items
  const totalAmount = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [orderItems]);
  
  // Submit order
  const handleSubmitOrder = () => {
    // Filter out brands with no quantity
    const itemsToSubmit = orderItems.filter(item => item.quantity > 0);
      
    if (itemsToSubmit.length > 0) {
      // You can implement order submission logic here
      console.log('Order submitted:', itemsToSubmit);
      alert('Order submitted successfully!');
      
      // Reset quantities and cost prices but keep brand names
      setOrderItems(brandNames.map(name => ({
        brandName: name,
        quantity: '',
        costPrice: '',
        amount: 0
      })));
    } else {
      alert('Please add at least one item to the order');
    }
  };

  // Handle monthly purchase record
  const handleSaveMonthlyPurchase = () => {
    // Get selected items and purchase date
    const selectedItems = orderItems.filter(item => item.quantity > 0 && item.costPrice);
    
    // Ensure we have items to save
    if (selectedItems.length === 0) {
      alert('Please add at least one item with quantity and price');
      return;
    }
    
    // Get the purchase date from the date input field
    const purchaseDateElement = document.getElementById('purchaseDate');
    const purchaseDate = purchaseDateElement ? new Date(purchaseDateElement.value) : new Date();
    
    // Format date for display
    const formattedDate = purchaseDate.toISOString();
    
    // Create a record of current order items
    const monthlyRecord = {
      date: formattedDate,
      items: selectedItems,
      totalAmount: totalAmount
    };

    // Save to state
    setPurchaseRecords(prev => ({
      ...prev,
      [currentMonth]: [...(prev[currentMonth] || []), monthlyRecord]
    }));

    // Store in localStorage for persistence
    const savedRecords = JSON.parse(localStorage.getItem('purchaseRecords') || '{}');
    savedRecords[currentMonth] = [...(savedRecords[currentMonth] || []), monthlyRecord];
    localStorage.setItem('purchaseRecords', JSON.stringify(savedRecords));

    // Update cost prices from these purchases
    monthlyRecord.items.forEach(item => {
      const product = stockProducts.find(p => p.name === item.brandName);
      if (product) {
        handleCostPriceChange(product.name, item.costPrice);
      }
    });
    
    // Reset form for next entry but keep the modal open
    setOrderItems(
      brandNames.map(name => ({
        brandName: name,
        quantity: '',
        costPrice: '',
        amount: 0
      }))
    );
    
    // Show success message
    alert('Purchase record saved successfully!');
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
          <div>
            <Button 
              variant="primary" 
              onClick={handleShow} 
              className="my-3 me-2"
            >
              <FaPlus /> Add Transaction
            </Button>
            <Button 
              variant="success" 
              onClick={() => setShowPurchaseModal(true)} 
              className="my-3 me-2"
            >
              <FaBoxOpen className="me-1" /> Monthly Purchase
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={initializeSampleData} 
              className="my-3"
              title="Load sample purchase data from the image"
            >
              Load Sample Data
            </Button>
          </div>
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
          <Table hover responsive className="mb-3">
            <thead>
              <tr style={{ background: '#f0f4f8' }}>
                <th>Brand Name</th>
                <th>Cost Price (Rs.)</th>
                <th>Quantity</th>
                <th>Reorder Point</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brandNames.map((brandName, index) => {
                // Find product with this brand name or create placeholder
                const product = stockProducts.find(p => p.name === brandName) || {
                  _id: `new-${index}`,
                  name: brandName,
                  costPrice: '',
                  currentStock: 0,
                  minStockLevel: 0
                };
                
                return (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td style={{ width: '120px' }}>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        className="border-0 text-end" 
                        value={localCosts[product.name] || product.costPrice || ''}
                        placeholder="Enter cost"
                        step="0.01"
                        min="0"
                        onChange={(e) => {
                          handleCostPriceChange(product.name, e.target.value);
                        }}
                      />
                    </td>
                    <td style={{ width: '100px' }} className="text-end">
                      {product.currentStock || 0}
                    </td>
                    <td className="text-end">{product.minStockLevel || 0}</td>
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
                );
              })}
              <tr className="fw-bold" style={{ background: '#f0f4f8' }}>
                <td>Total</td>
                <td></td>
                <td className="text-end">
                  {brandNames.reduce((total, brandName) => {
                    const qty = stockProducts.find(p => p.name === brandName)?.currentStock || 0;
                    return total + Number(qty);
                  }, 0)}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="fw-bold" style={{ background: '#f0f4f8' }}>
                <td>Total Stock Value</td>
                <td></td>
                <td className="text-end" colSpan="4">
                  Rs. {brandNames.reduce((total, brandName) => {
                    const product = stockProducts.find(p => p.name === brandName);
                    const qty = product?.currentStock || 0;
                    const cost = localCosts[brandName] || (product?.costPrice || 0);
                    return total + (Number(qty) * Number(cost));
                  }, 0).toFixed(2)}
                </td>
              </tr>
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
                <th>Cost Price</th>
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
                  <td>{transaction.costPrice ? `Rs. ${transaction.costPrice.toFixed(2)}` : 'N/A'}</td>
                  <td>{transaction.note}</td>
                  <td>{transaction.user?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <h2 className='mt-4'>Today's Order</h2>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        marginBottom: '2rem'
      }}>
        <Table hover responsive className="mb-3">
          <thead>
            <tr style={{ background: '#f0f4f8' }}>
              <th style={{ width: '40%' }}>Brand Name</th>
              <th style={{ width: '20%' }}>Quantity</th>
              <th style={{ width: '20%' }}>Cost Price (Rs.)</th>
              <th style={{ width: '20%' }}>Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => (
              <tr key={index}>
                <td>{item.brandName}</td>
                <td>
                  <Form.Control 
                    type="number" 
                    size="sm"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleOrderQuantityChange(index, e.target.value)}
                    placeholder="Enter quantity"
                  />
                </td>
                <td>
                  <Form.Control 
                    type="number" 
                    size="sm"
                    min="0"
                    step="0.01"
                    value={item.costPrice}
                    onChange={(e) => handleCostPriceChange(item.brandName, e.target.value)}
                    placeholder="Enter cost"
                  />
                </td>
                <td className="text-end">
                  Rs. {item.amount ? item.amount.toFixed(2) : '0.00'}
                </td>
              </tr>
            ))}
            <tr className="fw-bold" style={{ background: '#f0f4f8' }}>
              <td colSpan="3" className="text-end">Total Amount:</td>
              <td className="text-end">Rs. {totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
        
        <div className="d-flex justify-content-end">
          <Button 
            variant="primary"
            className="d-flex align-items-center gap-2"
            style={{
              backgroundColor: '#4b6cb7',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem 1rem'
            }}
            onClick={handleSubmitOrder}
          >
            <FaPlus size={14} />
            Submit Order
          </Button>
        </div>
      </div>

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

            <Form.Group controlId='costPrice' className='mb-3'>
              <Form.Label>Cost Price (Rs.)</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter cost price'
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                step='0.01'
                min='0'
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

      {showPurchaseModal && (
        <Modal
          show={showPurchaseModal}
          onHide={() => setShowPurchaseModal(false)}
          size="xl"
          centered
          dialogClassName="purchase-modal-right"
          style={{ zIndex: 2000 }}
        >
          <style type="text/css">
            {`
            .purchase-modal-right .modal-dialog {
              margin-right: 5%;
              margin-left: auto;
              max-width: 90%;
            }
            @media (min-width: 992px) {
              .purchase-modal-right .modal-dialog {
                max-width: 80%;
              }
            }
            `}
          </style>
          <Modal.Header 
            closeButton
            style={{
              background: 'linear-gradient(to right, #4a6aed, #77a6f7)',
              color: 'white'
            }}
          >
            <Modal.Title>Monthly Purchase - {currentMonth}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Select Month</Form.Label>
                    <Form.Control
                      type="month"
                      value={currentMonth}
                      onChange={(e) => setCurrentMonth(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Purchase Date</Form.Label>
                    <Form.Control
                      type="date"
                      id="purchaseDate"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>

            <div className="py-2 px-1">
              <Card className="mb-4 border-primary">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="m-0">New Purchase Entry</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive striped bordered hover>
                    <thead>
                      <tr className="bg-light">
                        <th>Brand Name</th>
                        <th>Quantity</th>
                        <th>Cost Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.brandName}</td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => handleOrderQuantityChange(index, e.target.value)}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              value={item.costPrice}
                              onChange={(e) => handleCostPriceChange(item.brandName, e.target.value)}
                            />
                          </td>
                          <td>Rs. {item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="table-info">
                        <td colSpan="3" className="text-end fw-bold">Total</td>
                        <td className="fw-bold">Rs. {totalAmount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Button 
                    variant="success" 
                    className="float-end"
                    onClick={handleSaveMonthlyPurchase}
                  >
                    Save Purchase
                  </Button>
                </Card.Body>
              </Card>

              {purchaseRecords[currentMonth] && purchaseRecords[currentMonth].length > 0 && (
                <Card className="mb-4 border-success">
                  <Card.Header className="bg-success text-white">
                    <h5 className="m-0">Monthly Purchase Ledger - {currentMonth}</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <div style={{ overflowX: 'auto' }}>
                      <Table responsive bordered className="mb-0" style={{ minWidth: '1200px' }}>
                        <thead>
                          <tr className="bg-light text-center">
                            <th rowSpan="2" style={{ verticalAlign: 'middle' }}>DATE</th>
                            <th colSpan="6" className="text-center bg-info text-white">PRIMARY FROM DATA TRADERS</th>
                            <th colSpan="11" className="text-center bg-warning text-dark">ZYN PRODUCTS</th>
                          </tr>
                          <tr className="bg-light text-center">
                            {/* Primary Products */}
                            <th>MORVEN</th>
                            <th>CLASSIC</th>
                            <th>DIPLO</th>
                            <th>RED & WHITE</th>
                            <th>MLB GOLD</th>
                            <th>CRAFTED</th>
                            
                            {/* ZYN Products */}
                            <th>Cool Mint 2 DOT 6 MG</th>
                            <th>Cool Mint 3 DOT 11 MG</th>
                            <th>Cool Mint 5 DOT 14 MG</th>
                            <th>Sour Ruby 2 DOT 6 MG</th>
                            <th>Sour Ruby 3 DOT 11MG</th>
                            <th>Cool Blue Berry 2 DOT 6 MG</th>
                            <th>Cool Blue Berry 3 DOT 11 MG</th>
                            <th>FRESH MINT 2 DOT</th>
                            <th>FRESH MINT 3 DOT</th>
                            <th>WATER MELON 2 DOT</th>
                            <th>WATER MELON 3 DOT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Group records by date */}
                          {(() => {
                            // Get all unique dates from purchase records
                            const allDates = purchaseRecords[currentMonth].reduce((dates, record) => {
                              const date = new Date(record.date).toLocaleDateString('en-IN');
                              if (!dates.includes(date)) dates.push(date);
                              return dates;
                            }, []).sort((a, b) => new Date(a) - new Date(b));
                            
                            // Create rows for each date
                            return allDates.map(date => {
                              const recordsForDate = purchaseRecords[currentMonth].filter(
                                r => new Date(r.date).toLocaleDateString('en-IN') === date
                              );
                              
                              // Consolidate quantities for each product on this date
                              const quantities = {};
                              recordsForDate.forEach(record => {
                                record.items.forEach(item => {
                                  if (!quantities[item.brandName]) {
                                    quantities[item.brandName] = 0;
                                  }
                                  quantities[item.brandName] += Number(item.quantity);
                                });
                              });
                              
                              // Format the date for display
                              const displayDate = new Date(date).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              });
                              
                              return (
                                <tr key={date} className="text-center">
                                  <td className="fw-bold">{displayDate}</td>
                                  {/* Primary Products */}
                                  <td>{quantities["Morven"] || ''}</td>
                                  <td>{quantities["Classic"] || ''}</td>
                                  <td>{quantities["Diplomat"] || ''}</td>
                                  <td>{quantities["Red & White"] || ''}</td>
                                  <td>{quantities["Marlboro Gold"] || ''}</td>
                                  <td>{quantities["Crafted By MLB"] || ''}</td>
                                  
                                  {/* ZYN Products */}
                                  <td>{quantities["COOL MINT 2 DOT 6MG"] || ''}</td>
                                  <td>{quantities["COOL MINT 3 DOT 11 MG"] || ''}</td>
                                  <td>{quantities["COOL MINT 5 DOT 14 MG"] || ''}</td>
                                  <td>{quantities["SOUR RUBY 2 DOT 6 MG"] || ''}</td>
                                  <td>{quantities["SOUR RUBY 3 DOT 11MG"] || ''}</td>
                                  <td>{quantities["COOL BLUE BERRY 2 DOT 6 MG"] || ''}</td>
                                  <td>{quantities["COOL BLUE BERRY 3 DOT 11 MG"] || ''}</td>
                                  <td>{quantities["FRESH MINT 2 DOT 6 MG"] || ''}</td>
                                  <td>{quantities["FRESH MINT 3 DOT 11 MG"] || ''}</td>
                                  <td>{quantities["COOL WATERMELON 2 DOT"] || ''}</td>
                                  <td>{quantities["COOL WATERMELON 3 DOT"] || ''}</td>
                                </tr>
                              );
                            });
                          })()}
                          
                          {/* Total Row */}
                          <tr className="bg-light text-center fw-bold">
                            <td>TOTAL</td>
                            {/* Calculate totals for each product */}
                            {(() => {
                              const productTotals = {};
                              const primaryProducts = ["Morven", "Classic", "Diplomat", "Red & White", "Marlboro Gold", "Crafted By MLB"];
                              const zynProducts = [
                                "COOL MINT 2 DOT 6MG", "COOL MINT 3 DOT 11 MG", "COOL MINT 5 DOT 14 MG",
                                "SOUR RUBY 2 DOT 6 MG", "SOUR RUBY 3 DOT 11MG",
                                "COOL BLUE BERRY 2 DOT 6 MG", "COOL BLUE BERRY 3 DOT 11 MG",
                                "FRESH MINT 2 DOT 6 MG", "FRESH MINT 3 DOT 11 MG",
                                "COOL WATERMELON 2 DOT", "COOL WATERMELON 3 DOT"
                              ];
                              
                              // Calculate totals
                              purchaseRecords[currentMonth].forEach(record => {
                                record.items.forEach(item => {
                                  if (!productTotals[item.brandName]) {
                                    productTotals[item.brandName] = 0;
                                  }
                                  productTotals[item.brandName] += Number(item.quantity);
                                });
                              });
                              
                              // Primary product totals
                              const primaryTotals = primaryProducts.map(name => (
                                <td key={name}>{productTotals[name] || 0}</td>
                              ));
                              
                              // ZYN product totals
                              const zynTotals = zynProducts.map(name => (
                                <td key={name}>{productTotals[name] || 0}</td>
                              ));
                              
                              return [...primaryTotals, ...zynTotals];
                            })()}
                          </tr>
                          
                          {/* Target Row */}
                          <tr className="bg-warning text-center fw-bold">
                            <td>TARGET PRIMARY</td>
                            {/* Editable targets for primary products */}
                            {["Morven", "Classic", "Diplomat", "Red & White", "Marlboro Gold", "Crafted By MLB"].map(product => (
                              <td key={product}>
                                <Form.Control
                                  type="number"
                                  size="sm"
                                  value={targetValues[product] || ""}
                                  onChange={(e) => handleTargetChange(product, e.target.value)}
                                  className="text-center fw-bold"
                                  min="0"
                                />
                              </td>
                            ))}
                            <td colSpan="11" className="text-center">TOTAL ZYN PURCHASE: {
                              (() => {
                                const zynProducts = [
                                  "COOL MINT 2 DOT 6MG", "COOL MINT 3 DOT 11 MG", "COOL MINT 5 DOT 14 MG",
                                  "SOUR RUBY 2 DOT 6 MG", "SOUR RUBY 3 DOT 11MG",
                                  "COOL BLUE BERRY 2 DOT 6 MG", "COOL BLUE BERRY 3 DOT 11 MG",
                                  "FRESH MINT 2 DOT 6 MG", "FRESH MINT 3 DOT 11 MG",
                                  "COOL WATERMELON 2 DOT", "COOL WATERMELON 3 DOT"
                                ];
                                
                                let total = 0;
                                purchaseRecords[currentMonth].forEach(record => {
                                  record.items.forEach(item => {
                                    if (zynProducts.includes(item.brandName)) {
                                      total += Number(item.quantity);
                                    }
                                  });
                                });
                                
                                return total;
                              })()
                            }</td>
                          </tr>
                          
                          {/* Remaining Target Row */}
                          <tr className="bg-success text-white text-center fw-bold">
                            <td>REMAINING PRIMARY</td>
                            {(() => {
                              // Calculate remaining targets
                              const primaryProducts = ["Morven", "Classic", "Diplomat", "Red & White", "Marlboro Gold", "Crafted By MLB"];
                              const productTotals = {};
                              
                              // Calculate totals
                              purchaseRecords[currentMonth]?.forEach(record => {
                                record.items.forEach(item => {
                                  if (primaryProducts.includes(item.brandName)) {
                                    if (!productTotals[item.brandName]) {
                                      productTotals[item.brandName] = 0;
                                    }
                                    productTotals[item.brandName] += Number(item.quantity);
                                  }
                                });
                              });
                              
                              // Return remaining cells
                              return primaryProducts.map(product => {
                                const target = targetValues[product] || 0;
                                const actual = productTotals[product] || 0;
                                const remaining = target - actual;
                                
                                return (
                                  <td key={product} className={remaining < 0 ? 'text-danger' : ''}>
                                    {remaining}
                                  </td>
                                );
                              });
                            })()}
                            <td colSpan="11"></td>
                          </tr>
                        </tbody>
                      </Table>
                      
                      {/* Total Purchase Row */}
                      <Table responsive bordered className="mt-3 mb-0" style={{ minWidth: '1200px' }}>
                        <tbody>
                          <tr className="bg-primary text-white text-center fw-bold">
                            <td style={{ width: '200px' }}>TOTAL PURCHASE</td>
                            <td>1240</td>
                            <td colSpan="16"></td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-light">
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>Primary Total Purchase:</strong> {
                          (() => {
                            const primaryProducts = ["Morven", "Classic", "Diplomat", "Red & White", "Marlboro Gold", "Crafted By MLB"];
                            let total = 0;
                            purchaseRecords[currentMonth].forEach(record => {
                              record.items.forEach(item => {
                                if (primaryProducts.includes(item.brandName)) {
                                  total += Number(item.quantity);
                                }
                              });
                            });
                            return total;
                          })()
                        }
                      </div>
                      <div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            // Export to CSV or Excel functionality could be added here
                            alert("Export feature will be implemented soon!");
                          }}
                        >
                          Export Table
                        </Button>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              )}
              
              {purchaseRecords[currentMonth] && purchaseRecords[currentMonth].length > 0 && (
                <Card className="border-secondary">
                  <Card.Header className="bg-secondary text-white">
                    <h5 className="m-0">Purchase Records</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive striped bordered hover>
                      <thead>
                        <tr className="bg-light">
                          <th>Purchase Date</th>
                          <th>Items Purchased</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseRecords[currentMonth].map((record, index) => {
                          // Format the date nicely
                          const purchaseDate = new Date(record.date);
                          const formattedDate = purchaseDate.toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                          
                          return (
                            <tr key={index}>
                              <td>{formattedDate}</td>
                              <td>
                                {record.items.length} items
                                <span className="ms-2 text-muted small">
                                  ({record.items.reduce((sum, item) => sum + Number(item.quantity), 0)} units total)
                                </span>
                              </td>
                              <td>Rs. {record.totalAmount.toFixed(2)}</td>
                              <td>
                                <Button 
                                  size="sm" 
                                  variant="info" 
                                  className="me-2"
                                  onClick={() => {
                                    // We could implement a details view here
                                    alert(
                                      `Purchase Details (${formattedDate}):\n\n` + 
                                      record.items.map(item => 
                                        `${item.brandName}: ${item.quantity} units at Rs. ${item.costPrice} each = Rs. ${item.amount.toFixed(2)}`
                                      ).join('\n')
                                    );
                                  }}
                                >
                                  View Details
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="danger"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this purchase record?')) {
                                      // Remove the record from state
                                      const updatedRecords = [...purchaseRecords[currentMonth]];
                                      updatedRecords.splice(index, 1);
                                      
                                      setPurchaseRecords(prev => ({
                                        ...prev,
                                        [currentMonth]: updatedRecords
                                      }));
                                      
                                      // Update localStorage
                                      const savedRecords = JSON.parse(localStorage.getItem('purchaseRecords') || '{}');
                                      savedRecords[currentMonth] = updatedRecords;
                                      localStorage.setItem('purchaseRecords', JSON.stringify(savedRecords));
                                    }
                                  }}
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              // Clear the form for new entry without closing modal
              setOrderItems(
                brandNames.map(name => ({
                  brandName: name,
                  quantity: '',
                  costPrice: '',
                  amount: 0
                }))
              );
              // Reset the purchase date to today
              const purchaseDateElement = document.getElementById('purchaseDate');
              if (purchaseDateElement) {
                purchaseDateElement.value = new Date().toISOString().split('T')[0];
              }
            }}>
              New Entry
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </motion.div>
  );
};

export default InventoryScreen; 