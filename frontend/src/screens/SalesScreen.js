import React, { useState, useEffect, useRef } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, Modal, Badge, Tabs, Tab, Container, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUser, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listSales } from '../actions/saleActions';
import './SalesScreen.css'; // We'll create this file for custom styles

const CONSTANT_RIDERS = [
  { id: 'MUL JPP 01', name: 'AMIR' },
  { id: 'MUL JPP 02', name: 'WASEEM' },
  { id: 'MUL JPP 03', name: 'ADNAN' },
  { id: 'MUL JPP 04', name: 'MOBASHIR' },
  { id: 'MUL JPP 05', name: 'BABAR' },
];

const SalesScreen = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [showEditRiderModal, setShowEditRiderModal] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');
  const [editRiderData, setEditRiderData] = useState(null);
  const [newRiderName, setNewRiderName] = useState('');
  const [riders, setRiders] = useState([]);
  const [productRows, setProductRows] = useState([
    { id: 1, amount: 0, priceList: 0, sale: 0, return: 0, lifting: 0, brandName: '' }
  ]);
  const [cashDetails, setCashDetails] = useState({
    values: [
      { id: 1, value: 5000, quantity: 0, total: 0 },
      { id: 2, value: 1000, quantity: 0, total: 0 },
      { id: 3, value: 500, quantity: 0, total: 0 },
      { id: 4, value: 100, quantity: 0, total: 0 },
      { id: 5, value: 50, quantity: 0, total: 0 },
      { id: 6, value: 20, quantity: 0, total: 0 },
      { id: 7, value: 10, quantity: 0, total: 0 },
      { id: 8, value: "Coin", quantity: 0, total: 0 }
    ],
    fuel: 0,
    bikeMaintain: 0,
    adeelBhai: 0,
    agencyExpense: 0
  });
  const [totals, setTotals] = useState({
    amount: 0,
    priceList: 0,
    sale: 0,
    return: 0,
    lifting: 0,
    cashTotal: 0,
    gTotal: 0,
    cashDifference: 0,
    bikeReadingOpening: 0,
    bikeReadingClosing: 0,
    totalKMs: 0,
    fuelPrice: 0,
    fuelPriceDiffer: 0
  });
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const [openPriceDropdownId, setOpenPriceDropdownId] = useState(null);
  const priceDropdownRef = useRef(null);

  const saleList = useSelector((state) => state.saleList);
  const { loading, error, sales = [] } = saleList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Add the brand names array
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

  // Add predefined price list values
  const priceListValues = [
    "11570",
    "8050",
    "9021",
    "9527",
    "26865",
    "7900",
    "6857",
    "8291",
    "9201"
  ];

  useEffect(() => {
    if (!userInfo) {
      window.location.href = '/login';
    } else {
      dispatch(listSales());
      
      // Load riders from localStorage
      const savedRiders = localStorage.getItem('riders');
      if (savedRiders) {
        setRiders(JSON.parse(savedRiders));
      }
    }
  }, [dispatch, userInfo]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const getStatusBadge = (status) => {
    let variant;
    switch (status?.toLowerCase()) {
      case 'completed':
        variant = 'success';
        break;
      case 'pending':
        variant = 'warning';
        break;
      case 'cancelled':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    return (
      <Badge bg={variant} style={{ fontSize: '0.8rem' }}>
        {status || 'N/A'}
      </Badge>
    );
  };

  const handleAddNewRider = () => {
    if (newRiderName.trim() !== '') {
      const newRider = {
        id: Date.now(), // Use timestamp as unique ID
        name: newRiderName.trim(),
        date: new Date().toISOString().split('T')[0],
        productsSold: 0,
        totalSales: 0,
        status: 'New',
        area: 'Unassigned'
      };
      
      const updatedRiders = [...riders, newRider];
      setRiders(updatedRiders);
      
      // Save to localStorage
      localStorage.setItem('riders', JSON.stringify(updatedRiders));
      
      setNewRiderName('');
      setShowRiderModal(false);
    }
  };

  const handleDeleteRider = (id) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      const updatedRiders = riders.filter(rider => rider.id !== id);
      setRiders(updatedRiders);
      localStorage.setItem('riders', JSON.stringify(updatedRiders));
    }
  };

  // Placeholder data until backend is connected
  const dummySales = [
    {
      id: 1,
      date: '2024-03-10',
      customerName: 'John Doe',
      total: 1500,
      status: 'Completed',
      paymentMethod: 'Cash'
    },
    {
      id: 2,
      date: '2024-03-09',
      customerName: 'Jane Smith',
      total: 2300,
      status: 'Pending',
      paymentMethod: 'Credit Card'
    },
    {
      id: 3,
      date: '2024-03-08',
      customerName: 'Mike Johnson',
      total: 800,
      status: 'Completed',
      paymentMethod: 'Cash'
    }
  ];

  // Function to add a new product row
  const handleAddProductRow = () => {
    const newRow = {
      id: Date.now(),
      amount: 0,
      priceList: 0,
      sale: 0,
      return: 0,
      lifting: 0,
      brandName: ''
    };
    setProductRows([...productRows, newRow]);
  };

  // Function to handle brand selection
  const handleBrandSelection = (id, brandName) => {
    const updatedRows = productRows.map(row => {
      if (row.id === id) {
        return { ...row, brandName };
      }
      return row;
    });
    
    setProductRows(updatedRows);
    setOpenDropdownId(null); // Close dropdown after selection
  };

  // Function to toggle dropdown with position check
  const toggleDropdown = (id) => {
    // If already open, close it
    if (openDropdownId === id) {
      setOpenDropdownId(null);
      return;
    }
    
    // Otherwise open this dropdown
    setOpenDropdownId(id);
    
    // We'll set a small timeout to ensure the DOM is updated before we check positioning
    setTimeout(() => {
      const dropdownMenu = document.querySelector('.custom-dropdown-menu');
      if (dropdownMenu) {
        const rect = dropdownMenu.getBoundingClientRect();
        const isOffScreen = rect.right > window.innerWidth;
        
        // If dropdown would go off screen, add a class to position it differently
        if (isOffScreen) {
          dropdownMenu.classList.add('dropdown-left');
        } else {
          dropdownMenu.classList.remove('dropdown-left');
        }
      }
    }, 0);
  };

  // Click outside handler to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setOpenPriceDropdownId(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to remove a product row
  const handleRemoveProductRow = (id) => {
    const updatedRows = productRows.filter(row => row.id !== id);
    setProductRows(updatedRows);
    calculateTotals(updatedRows, cashDetails);
  };

  // Function to handle product row changes
  const handleProductRowChange = (id, field, value) => {
    const updatedRows = productRows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-calculate values based on formulas
        if (field === 'lifting' || field === 'return' || field === 'priceList') {
          // If lifting or return changes, update sale (Lifting - Return = Sale)
          if (field === 'lifting' || field === 'return') {
            // Limit sale to 3 decimal places
            updatedRow.sale = Number((Math.max(0, Number(updatedRow.lifting) - Number(updatedRow.return))).toFixed(3));
          }
          
          // If sale or priceList changes, update amount with 2 decimal places
          updatedRow.amount = Number((updatedRow.priceList * updatedRow.sale).toFixed(2));
        }
        
        return updatedRow;
      }
      return row;
    });
    
    setProductRows(updatedRows);
    calculateTotals(updatedRows, cashDetails);
  };

  // Function to handle cash detail changes
  const handleCashDetailChange = (field, value, subField = null, index = null) => {
    if (field === 'values' && index !== null) {
      const updatedValues = cashDetails.values.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item };
          if (subField === 'quantity') {
            updatedItem.quantity = value;
            updatedItem.total = typeof item.value === 'number' ? item.value * value : 0;
          }
          return updatedItem;
        }
        return item;
      });
      
      const updatedCashDetails = {
        ...cashDetails,
        values: updatedValues
      };
      
      setCashDetails(updatedCashDetails);
      calculateTotals(productRows, updatedCashDetails);
    } else {
      // Handle direct fields (expenses)
      const updatedCashDetails = {
        ...cashDetails,
        [field]: value
      };
      
      setCashDetails(updatedCashDetails);
      calculateTotals(productRows, updatedCashDetails);
    }
  };

  // Add expense change handler
  const handleExpenseChange = (field, value) => {
    handleCashDetailChange(field, Number(value));
  };

  // Function to calculate all totals
  const calculateTotals = (rows, cash) => {
    // Calculate product totals
    const productTotals = rows.reduce(
      (acc, row) => {
        return {
          amount: acc.amount + Number(row.amount || 0),
          priceList: acc.priceList + Number(row.priceList || 0),
          sale: acc.sale + Number((row.sale || 0).toFixed(3)),
          return: acc.return + Number((row.return || 0).toFixed(3)),
          lifting: acc.lifting + Number((row.lifting || 0).toFixed(3))
        };
      },
      { amount: 0, priceList: 0, sale: 0, return: 0, lifting: 0 }
    );
    
    // Format the totals
    productTotals.amount = Number(productTotals.amount.toFixed(2));
    productTotals.sale = Number(productTotals.sale.toFixed(3));
    productTotals.return = Number(productTotals.return.toFixed(3));
    productTotals.lifting = Number(productTotals.lifting.toFixed(3));
    
    // Calculate cash totals
    const cashTotal = cash.values.reduce((sum, item) => sum + Number(item.total || 0), 0);

    // Calculate total expenses
    const totalExpenses = Number(cash.bikeMaintain || 0) +
                         Number(cash.adeelBhai || 0) +
                         Number(cash.agencyExpense || 0) +
                         Number(totals.fuelPrice || 0) +
                         Number(cash.bankTransfer || 0) +
                         Number(cash.craftedFoils || 0) +
                         Number(cash.craftedScheme || 0) +
                         Number(cash.zyn || 0) +
                         Number(cash.tkReward || 0) +
                         Number(cash.incentive || 0) +
                         Number(cash.wholesale || 0) +
                         Number(cash.salary || 0);
    
    // Calculate G.TOTAL (Amount - All Expenses)
    const gTotal = Number((productTotals.amount - totalExpenses).toFixed(2));
    
    // Calculate Cash Difference (Cash Total - G.TOTAL)
    const cashDifference = Number((cashTotal - gTotal).toFixed(2));
    
    setTotals({
      ...productTotals,
      cashTotal: Number(cashTotal.toFixed(2)),
      gTotal,
      cashDifference,
      bikeReadingOpening: totals.bikeReadingOpening,
      bikeReadingClosing: totals.bikeReadingClosing,
      totalKMs: totals.totalKMs,
      fuelPrice: totals.fuelPrice,
      fuelPriceDiffer: totals.fuelPriceDiffer,
      totalExpenses: Number(totalExpenses.toFixed(2))
    });
  };

  // Initialize calculations when modal opens
  useEffect(() => {
    if (showEditRiderModal) {
      calculateTotals(productRows, cashDetails);
    }
  }, [showEditRiderModal]);

  // Function to handle price list selection
  const handlePriceSelection = (id, price) => {
    const updatedRows = productRows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, priceList: Number(price) };
        // Update amount based on the new price list value
        updatedRow.amount = updatedRow.priceList * updatedRow.sale;
        return updatedRow;
      }
      return row;
    });
    
    setProductRows(updatedRows);
    calculateTotals(updatedRows, cashDetails);
    setOpenPriceDropdownId(null); // Close dropdown after selection
  };

  // Function to toggle price dropdown with position check
  const togglePriceDropdown = (id) => {
    // If already open, close it
    if (openPriceDropdownId === id) {
      setOpenPriceDropdownId(null);
      return;
    }
    
    // Otherwise open this dropdown
    setOpenPriceDropdownId(id);
    
    // We'll set a small timeout to ensure the DOM is updated before we check positioning
    setTimeout(() => {
      const dropdownMenu = document.querySelector('.price-dropdown-menu');
      if (dropdownMenu) {
        const rect = dropdownMenu.getBoundingClientRect();
        const isOffScreen = rect.right > window.innerWidth;
        
        // If dropdown would go off screen, add a class to position it differently
        if (isOffScreen) {
          dropdownMenu.classList.add('dropdown-left');
        } else {
          dropdownMenu.classList.remove('dropdown-left');
        }
      }
    }, 0);
  };

  // Add this function to calculate KMs and fuel price
  const handleBikeReadingChange = (field, value) => {
    const newTotals = { ...totals, [field]: Number(value) };
    
    // Calculate total KMs
    const totalKMs = Math.max(0, newTotals.bikeReadingClosing - newTotals.bikeReadingOpening);
    
    // Calculate fuel price (KMs × 5.5)
    const calculatedFuelPrice = totalKMs * 5.5;
    
    setTotals({
      ...newTotals,
      totalKMs: totalKMs,
      fuelPrice: calculatedFuelPrice
    });
  };

  return (
    <div className="content-wrapper">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sales-container"
      >
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="sales" title="Sales">
            <Row className="align-items-center mb-4">
              <Col>
                <h1 className="mb-0" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2c3e50' }}>
                  Sales
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
                  New Sale
                </Button>
              </Col>
            </Row>

            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : (
              <div 
                className="table-responsive"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  overflowX: 'auto'
                }}
              >
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Use dummy data for now, replace with actual sales data when ready */}
                    {Array.isArray(dummySales) && dummySales.map((sale) => (
                      <tr key={sale.id}>
                        <td>INV-{String(sale.id).padStart(4, '0')}</td>
                        <td>{new Date(sale.date).toLocaleDateString()}</td>
                        <td>{sale.customerName}</td>
                        <td>${sale.total.toFixed(2)}</td>
                        <td>{getStatusBadge(sale.status)}</td>
                        <td>{sale.paymentMethod}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="light"
                              size="sm"
                              className="d-flex align-items-center"
                              style={{ padding: '0.4rem 0.6rem' }}
                            >
                              <FaEye size={14} />
                            </Button>
                            <Button 
                              variant="light"
                              size="sm"
                              className="d-flex align-items-center"
                              style={{ padding: '0.4rem 0.6rem' }}
                            >
                              <FaEdit size={14} />
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
          </Tab>

          <Tab eventKey="babar" title="Babar (Salesman)">
            <Row className="align-items-center mb-4">
              <Col>
                <h1 className="mb-0" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2c3e50' }}>
                  Rider Sales Reports
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
                  onClick={() => setShowRiderModal(true)}
                >
                  <FaPlus size={14} />
                  New Rider
                </Button>
              </Col>
            </Row>

            <div 
              className="table-responsive"
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                overflowX: 'auto'
              }}
            >
              <Table hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Rider ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Total Sale (Rs)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {CONSTANT_RIDERS.map((rider) => (
                    <tr key={rider.id}>
                      <td>{rider.id}</td>
                      <td>{rider.name}</td>
                      <td>{new Date().toLocaleDateString()}</td>
                      <td>0</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="light"
                            size="sm"
                            className="d-flex align-items-center"
                            style={{ padding: '0.4rem 0.6rem' }}
                          >
                            <FaEye size={14} />
                          </Button>
                          <Button 
                            variant="light"
                            size="sm"
                            className="d-flex align-items-center"
                            style={{ padding: '0.4rem 0.6rem' }}
                            onClick={() => { setEditRiderData(rider); setShowEditRiderModal(true); }}
                          >
                            <FaEdit size={14} />
                          </Button>
                          <Button 
                            variant="danger"
                            size="sm"
                            className="d-flex align-items-center"
                            style={{ padding: '0.4rem 0.6rem' }}
                            onClick={() => handleDeleteRider(rider.id)}
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
          </Tab>
        </Tabs>

        {/* New Sale Modal */}
        <Modal 
          show={showModal} 
          onHide={handleClose} 
          size="lg"
          centered
          dialogClassName="sales-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>New Sale</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter customer name" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select>
                      <option value="">Select payment method</option>
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Products</Form.Label>
                <div className="mb-2">
                  <Row>
                    <Col md={5}>
                      <Form.Select>
                        <option value="">Select product</option>
                        {/* Add product options here */}
                      </Form.Select>
                    </Col>
                    <Col md={3}>
                      <Form.Control type="number" placeholder="Quantity" min="1" />
                    </Col>
                    <Col md={3}>
                      <Form.Control type="number" placeholder="Price" disabled />
                    </Col>
                    <Col md={1}>
                      <Button variant="danger" size="sm">
                        <FaTrash size={14} />
                      </Button>
                    </Col>
                  </Row>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  className="d-flex align-items-center gap-2"
                >
                  <FaPlus size={12} />
                  Add Product
                </Button>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter notes" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <div className="bg-light p-3 rounded">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>$0.00</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (10%):</span>
                      <span>$0.00</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>$0.00</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary"
              style={{
                backgroundColor: '#4b6cb7',
                border: 'none'
              }}
            >
              Create Sale
            </Button>
          </Modal.Footer>
        </Modal>

        {/* New Rider Modal */}
        <Modal 
          show={showRiderModal} 
          onHide={() => setShowRiderModal(false)} 
          size="md"
          centered
          dialogClassName="sales-modal"
        >
          <Modal.Header closeButton className="border-0 pb-0" style={{ background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem', padding: '1rem 1.5rem' }}>
            <Modal.Title className="text-white">Add New Rider</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 py-4">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Rider Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter rider name" 
                  value={newRiderName}
                  onChange={(e) => setNewRiderName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0" style={{ padding: '1rem 1.5rem 1.5rem' }}>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowRiderModal(false)}
              style={{ borderRadius: '6px', padding: '0.5rem 1.25rem' }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddNewRider}
              style={{ 
                backgroundColor: '#4b6cb7', 
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.25rem'
              }}
            >
              Add Rider
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Rider Edit Modal - Default Template */}
        <Modal 
          show={showEditRiderModal} 
          onHide={() => setShowEditRiderModal(false)} 
          size="xl"
          dialogClassName="rider-modal"
          aria-labelledby="rider-modal-title"
          centered
        >
          <Modal.Header 
            closeButton 
            className="border-0 pb-0"
            style={{ 
              background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
              borderTopLeftRadius: '0.5rem',
              borderTopRightRadius: '0.5rem',
              padding: '1rem 1.5rem'
            }}
          >
            <Modal.Title id="rider-modal-title" className="text-white">
              Edit Rider Report
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 py-4">
            <Form>
              <Row className="mb-4 align-items-center">
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <span className="fw-bold me-2" style={{ minWidth: '60px' }}>Date:</span>
                    <Form.Control 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      style={{ maxWidth: '200px' }} 
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold me-2" style={{ minWidth: '60px' }}>Name:</span>
                    <Form.Control 
                      type="text" 
                      defaultValue={editRiderData?.name || ''}
                      style={{ maxWidth: '200px' }} 
                    />
                  </div>
                </Col>
              </Row>

              <div className="table-responsive mb-4">
                <Table 
                  bordered 
                  hover 
                  size="sm" 
                  className="mb-0"
                  style={{ 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(to right, #e3eafc, #d1defa)',
                      color: '#2c3e50'
                    }}>
                      <th className="py-2 px-3">Brand Name</th>
                      <th className="py-2 px-3">Lifting</th>
                      <th className="py-2 px-3">Return</th>
                      <th className="py-2 px-3">Sale</th>
                      <th className="py-2 px-3">Price List</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-2" style={{ width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="position-relative" ref={row.id === openDropdownId ? dropdownRef : null}>
                            <Form.Control 
                              type="text" 
                              size="sm" 
                              className="border-0 fw-bold" 
                              value={row.brandName}
                              onChange={(e) => handleProductRowChange(row.id, 'brandName', e.target.value)}
                            />
                            <div className="brand-dropdown">
                              <Button 
                                variant="light" 
                                size="sm" 
                                className="dropdown-toggle-btn"
                                onClick={() => toggleDropdown(row.id)}
                              >
                                <FaChevronDown size={10} />
                              </Button>
                              {openDropdownId === row.id && (
                                <div className="custom-dropdown-menu">
                                  {brandNames.map((brand, index) => (
                                    <div 
                                      key={index} 
                                      className="custom-dropdown-item"
                                      onClick={() => handleBrandSelection(row.id, brand)}
                                    >
                                      {brand}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            className="border-0" 
                            value={row.lifting}
                            onChange={(e) => handleProductRowChange(row.id, 'lifting', Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            className="border-0" 
                            value={row.return}
                            onChange={(e) => handleProductRowChange(row.id, 'return', Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            className="border-0" 
                            value={row.sale}
                            disabled
                          />
                        </td>
                        <td>
                          <div className="position-relative" ref={row.id === openPriceDropdownId ? priceDropdownRef : null}>
                            <Form.Control 
                              type="number" 
                              size="sm" 
                              className="border-0" 
                              value={row.priceList}
                              onChange={(e) => handleProductRowChange(row.id, 'priceList', Number(e.target.value))}
                            />
                            <div className="price-dropdown">
                              <Button 
                                variant="light" 
                                size="sm" 
                                className="dropdown-toggle-btn"
                                onClick={() => togglePriceDropdown(row.id)}
                              >
                                <FaChevronDown size={10} />
                              </Button>
                              {openPriceDropdownId === row.id && (
                                <div className="price-dropdown-menu custom-dropdown-menu">
                                  {priceListValues.map((price, index) => (
                                    <div 
                                      key={index} 
                                      className="custom-dropdown-item"
                                      onClick={() => handlePriceSelection(row.id, price)}
                                    >
                                      {price}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            className="border-0" 
                            value={row.amount}
                            disabled
                          />
                        </td>
                        <td className="text-center">
                          <div className="action-buttons">
                            <Button 
                              variant="link" 
                              className="p-0 text-danger action-button"
                              onClick={() => handleRemoveProductRow(row.id)}
                            >
                              <FaTrash size={12} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8f9fa' }}>
                      <td className="fw-bold py-2 px-3">Total</td>
                      <td className="fw-bold py-2 px-3">{totals.lifting.toFixed(3)}</td>
                      <td className="fw-bold py-2 px-3">{totals.return.toFixed(3)}</td>
                      <td className="fw-bold py-2 px-3">{totals.sale.toFixed(3)}</td>
                      <td></td>
                      <td className="fw-bold py-2 px-3">{totals.amount.toFixed(2)}</td>
                      <td className="text-center">
                        <Button 
                          variant="link" 
                          className="p-0 text-primary"
                          title="Add new row"
                          onClick={handleAddProductRow}
                        >
                          <FaPlus size={12} />
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </div>

              <div className="p-4 rounded mb-4" style={{ background: '#f8f9fa' }}>
                <h5 className="mb-3" style={{ fontSize: '1rem', color: '#2c3e50' }}>Cash Details</h5>
                
                <Row className="g-3">
                  <Col lg={5} md={5}>
                    <div className="bike-reading-section p-4 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e0e6ed' }}>
                      <h5 className="section-title mb-4" style={{ 
                        fontSize: '1.5rem', 
                        color: '#2c3e50', 
                        fontWeight: '600',
                        textAlign: 'center',
                        backgroundColor: '#bbdefb',
                        padding: '10px',
                        borderRadius: '8px'
                      }}>BIKE READING</h5>
                      
                      <div className="bike-grid">
                        {[
                          { label: 'OPENING', color: '#f8f9fa' },
                          { label: 'CLOSING', color: '#f8f9fa' },
                          { label: 'TOTAL KMs', color: '#e3f2fd', disabled: true },
                          { label: 'FUEL PRICE', color: '#e3f2fd', disabled: true }
                        ].map((item, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: item.color,
                            padding: '10px 15px',
                            borderRadius: '6px',
                            marginBottom: '12px',
                            border: '1px solid #dee2e6'
                          }}>
                            <span style={{ 
                              flex: 1, 
                              fontWeight: '500',
                              color: '#1976d2'
                            }}>{item.label}</span>
                            <Form.Control
                              type="number"
                              size="sm"
                              style={{
                                width: '120px',
                                border: '1px solid #90caf9',
                                borderRadius: '4px',
                                textAlign: 'right',
                                backgroundColor: item.disabled ? '#e9ecef' : '#fff'
                              }}
                              value={
                                item.label === 'OPENING' ? totals.bikeReadingOpening :
                                item.label === 'CLOSING' ? totals.bikeReadingClosing :
                                item.label === 'TOTAL KMs' ? totals.totalKMs :
                                totals.fuelPrice
                              }
                              onChange={(e) => {
                                if (item.label === 'OPENING' || item.label === 'CLOSING') {
                                  handleBikeReadingChange(
                                    item.label === 'OPENING' ? 'bikeReadingOpening' : 'bikeReadingClosing',
                                    e.target.value
                                  );
                                }
                              }}
                              disabled={item.disabled}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>

                  <Col lg={7} md={7}>
                    <div className="expense-section p-4 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e0e6ed' }}>
                      <h5 className="section-title mb-4" style={{ 
                        fontSize: '1.5rem', 
                        color: '#2c3e50', 
                        fontWeight: '600',
                        textAlign: 'center',
                        backgroundColor: '#c8e6c9',
                        padding: '10px',
                        borderRadius: '8px'
                      }}>EXPENSES</h5>
                      
                      <div className="expense-grid">
                        <div className="expense-item" style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: '10px',
                          marginBottom: '20px'
                        }}>
                          {[
                            { id: 'bankTransfer', label: 'BANK TRANSFER' },
                            { id: 'craftedFoils', label: 'CRAFTED Foils' },
                            { id: 'craftedScheme', label: 'CRAFTED SCHEME' },
                            { id: 'zyn', label: 'ZYN' },
                            { id: 'tkReward', label: 'TK REWARD' },
                            { id: 'incentive', label: 'Incentive' },
                            { id: 'wholesale', label: 'WHOLESALE' },
                            { id: 'agencyExpense', label: 'AGENCY EXPENSE' },
                            { id: 'salary', label: 'SALARY' }
                          ].map((item) => (
                            <div key={item.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: '#e9ecef',
                              padding: '10px 15px',
                              borderRadius: '6px',
                              marginBottom: '8px'
                            }}>
                              <span style={{ flex: 1, fontWeight: '500' }}>{item.label}</span>
                              <Form.Control
                                type="number"
                                size="sm"
                                style={{
                                  width: '120px',
                                  border: '1px solid #ced4da',
                                  borderRadius: '4px',
                                  textAlign: 'right'
                                }}
                                value={cashDetails[item.id] || ''}
                                onChange={(e) => handleExpenseChange(item.id, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: '#dcedc8',
                        padding: '15px',
                        borderRadius: '8px',
                        marginTop: '20px'
                      }}>
                        <h6 style={{ 
                          fontSize: '1.1rem', 
                          color: '#2c3e50',
                          marginBottom: '10px',
                          fontWeight: '600'
                        }}>EXPENSES DETAILS:</h6>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          style={{
                            resize: 'none',
                            border: '1px solid #c5e1a5',
                            borderRadius: '6px'
                          }}
                        />
                      </div>
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="summary-section p-4 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e0e6ed' }}>
                      <h5 className="section-title mb-4" style={{ 
                        fontSize: '1.5rem', 
                        color: '#2c3e50', 
                        fontWeight: '600',
                        textAlign: 'center',
                        backgroundColor: '#fff3e0',
                        padding: '10px',
                        borderRadius: '8px'
                      }}>SUMMARY</h5>

                      <Row className="g-3">
                        <Col lg={4} md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small mb-2">Payment</Form.Label>
                            <div style={{
                              backgroundColor: totals.cashDifference < 0 ? '#ffebee' : '#e8f5e9',
                              padding: '12px 15px',
                              borderRadius: '8px',
                              border: `1px solid ${totals.cashDifference < 0 ? '#ef9a9a' : '#a5d6a7'}`,
                              display: totals.cashDifference < 0 ? 'block' : 'none'
                            }}>
                              <span style={{ 
                                color: '#d32f2f',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'block',
                                textAlign: 'center'
                              }}>
                                {Math.abs(totals.cashDifference).toFixed(2)}
                              </span>
                            </div>
                            <div style={{
                              backgroundColor: totals.cashDifference >= 0 ? '#e8f5e9' : '#ffebee',
                              padding: '12px 15px',
                              borderRadius: '8px',
                              border: `1px solid ${totals.cashDifference >= 0 ? '#a5d6a7' : '#ef9a9a'}`,
                              display: totals.cashDifference >= 0 ? 'block' : 'none'
                            }}>
                              <span style={{ 
                                color: '#2e7d32',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'block',
                                textAlign: 'center'
                              }}>
                                {Math.abs(totals.cashDifference).toFixed(2)}
                              </span>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg={4} md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small mb-2">Cash Difference</Form.Label>
                            <div style={{
                              backgroundColor: '#f5f5f5',
                              padding: '12px 15px',
                              borderRadius: '8px',
                              border: '1px solid #e0e0e0'
                            }}>
                              <span style={{ 
                                color: totals.cashDifference < 0 ? '#d32f2f' : '#2e7d32',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'block',
                                textAlign: 'center'
                              }}>
                                {totals.cashDifference.toFixed(2)}
                              </span>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col lg={4} md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small mb-2">G. TOTAL</Form.Label>
                            <div style={{
                              backgroundColor: '#f5f5f5',
                              padding: '12px 15px',
                              borderRadius: '8px',
                              border: '1px solid #e0e0e0'
                            }}>
                              <span style={{ 
                                color: '#2c3e50',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                display: 'block',
                                textAlign: 'center'
                              }}>
                                {totals.gTotal.toFixed(2)}
                              </span>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="cash-details-section p-4 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e0e6ed' }}>
                      <h5 className="section-title mb-4" style={{ 
                        fontSize: '1.5rem', 
                        color: '#2c3e50', 
                        fontWeight: '600',
                        textAlign: 'center',
                        backgroundColor: '#bbdefb',
                        padding: '10px',
                        borderRadius: '8px'
                      }}>CASH DETAILS</h5>

                      <div className="table-responsive">
                        <Table bordered hover size="sm" className="cash-details-table">
                          <thead>
                            <tr>
                              <th colSpan="3" style={{ backgroundColor: '#e3f2fd', textAlign: 'center' }}>CASH DETAILS</th>
                            </tr>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                              <th>Value</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cashDetails.values.map((item, index) => (
                              <tr key={item.id} style={{ background: index === cashDetails.values.length - 1 ? '#e3f2fd' : '' }}>
                                <td>{item.value}</td>
                                <td>
                                  <Form.Control 
                                    type="number" 
                                    size="sm" 
                                    className="border-0 text-center" 
                                    value={item.quantity}
                                    onChange={(e) => handleCashDetailChange('values', Number(e.target.value), 'quantity', index)}
                                  />
                                </td>
                                <td>{item.total}</td>
                              </tr>
                            ))}
                            <tr style={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                              <td>TOTAL</td>
                              <td></td>
                              <td>{totals.cashTotal}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0" style={{ padding: '1rem 1.5rem 1.5rem' }}>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowEditRiderModal(false)}
              style={{ borderRadius: '6px', padding: '0.5rem 1.25rem' }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              style={{ 
                backgroundColor: '#4b6cb7', 
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1.25rem'
              }}
            >
              Save Report
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </div>
  );
};

export default SalesScreen; 