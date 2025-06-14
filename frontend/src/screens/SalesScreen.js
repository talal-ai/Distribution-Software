import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, Modal, Badge, Tabs, Tab, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listSales } from '../actions/saleActions';
import './SalesScreen.css'; // We'll create this file for custom styles

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
    fuel: 0,
    ublRaast: { value: 0, quantity: 0, total: 0 },
    udhaar: { value: 0, quantity: 0, total: 0 },
    foils: { value: 0, quantity: 0, total: 0 },
    scheme: { value: 0, quantity: 0, total: 0 },
    incentive: { value: 0, quantity: 0, total: 0 },
    bikeMaintain: 0,
    adeelBhai: 0,
    agencyExpense: 0,
    salary: 0
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
    bikeReading: 0,
    fuelPrice: 0,
    fuelPriceDiffer: 0
  });

  const saleList = useSelector((state) => state.saleList);
  const { loading, error, sales = [] } = saleList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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
            updatedRow.sale = Math.max(0, Number(updatedRow.lifting) - Number(updatedRow.return));
          }
          
          // If sale or priceList changes, update amount
          updatedRow.amount = updatedRow.priceList * updatedRow.sale;
        }
        
        return updatedRow;
      }
      return row;
    });
    
    setProductRows(updatedRows);
    calculateTotals(updatedRows, cashDetails);
  };

  // Function to handle cash detail changes
  const handleCashDetailChange = (field, value, subField = null) => {
    let updatedCashDetails;
    
    if (subField) {
      // Handle nested fields (like ublRaast.value)
      updatedCashDetails = {
        ...cashDetails,
        [field]: {
          ...cashDetails[field],
          [subField]: value
        }
      };
      
      // Auto-calculate total for this cash method
      if (subField === 'value' || subField === 'quantity') {
        updatedCashDetails[field].total = 
          updatedCashDetails[field].value * updatedCashDetails[field].quantity;
      }
    } else {
      // Handle direct fields (like fuel)
      updatedCashDetails = {
        ...cashDetails,
        [field]: value
      };
    }
    
    setCashDetails(updatedCashDetails);
    calculateTotals(productRows, updatedCashDetails);
  };

  // Function to calculate all totals
  const calculateTotals = (rows, cash) => {
    // Calculate product totals
    const productTotals = rows.reduce(
      (acc, row) => {
        return {
          amount: acc.amount + Number(row.amount || 0),
          priceList: acc.priceList + Number(row.priceList || 0),
          sale: acc.sale + Number(row.sale || 0),
          return: acc.return + Number(row.return || 0),
          lifting: acc.lifting + Number(row.lifting || 0)
        };
      },
      { amount: 0, priceList: 0, sale: 0, return: 0, lifting: 0 }
    );
    
    // Calculate cash totals
    const cashTotal = 
      (cash.ublRaast.total || 0) +
      (cash.udhaar.total || 0) +
      (cash.foils.total || 0) +
      (cash.scheme.total || 0) +
      (cash.incentive.total || 0);
    
    // Calculate G.TOTAL (Amount - Fuel)
    const gTotal = productTotals.amount - Number(cash.fuel || 0);
    
    // Calculate Cash Difference (Cash Total - G.TOTAL)
    const cashDifference = cashTotal - gTotal;
    
    setTotals({
      ...productTotals,
      cashTotal,
      gTotal,
      cashDifference,
      bikeReading: totals.bikeReading,
      fuelPrice: totals.fuelPrice,
      fuelPriceDiffer: totals.fuelPriceDiffer
    });
  };

  // Initialize calculations when modal opens
  useEffect(() => {
    if (showEditRiderModal) {
      calculateTotals(productRows, cashDetails);
    }
  }, [showEditRiderModal]);

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
                    <th>Products Sold</th>
                    <th>Total Sales</th>
                    <th>Status</th>
                    <th>Area</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.length > 0 ? (
                    riders.map((rider) => (
                      <tr key={rider.id}>
                        <td>RID-{String(rider.id).substr(-4).padStart(4, '0')}</td>
                        <td>{rider.name}</td>
                        <td>{new Date(rider.date).toLocaleDateString()}</td>
                        <td>{rider.productsSold}</td>
                        <td>${rider.totalSales.toFixed(2)}</td>
                        <td>{getStatusBadge(rider.status)}</td>
                        <td>{rider.area}</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-3">
                        No riders found. Click "New Rider" to add one.
                      </td>
                    </tr>
                  )}
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
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3">Price List</th>
                      <th className="py-2 px-3">Sale</th>
                      <th className="py-2 px-3">Return</th>
                      <th className="py-2 px-3">Lifting</th>
                      <th className="py-2 px-3">Brand Name</th>
                      <th className="py-2 px-2" style={{ width: '50px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            className="border-0" 
                            value={row.amount}
                            disabled
                          />
                        </td>
                        <td>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            className="border-0" 
                            value={row.priceList}
                            onChange={(e) => handleProductRowChange(row.id, 'priceList', Number(e.target.value))}
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
                            value={row.lifting}
                            onChange={(e) => handleProductRowChange(row.id, 'lifting', Number(e.target.value))}
                          />
                        </td>
                        <td>
                          <Form.Control 
                            type="text" 
                            size="sm" 
                            className="border-0" 
                            value={row.brandName}
                            onChange={(e) => handleProductRowChange(row.id, 'brandName', e.target.value)}
                          />
                        </td>
                        <td className="text-center">
                          <Button 
                            variant="link" 
                            className="p-0 text-danger"
                            onClick={() => handleRemoveProductRow(row.id)}
                          >
                            <FaTrash size={12} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8f9fa' }}>
                      <td className="fw-bold py-2 px-3">{totals.amount.toFixed(2)}</td>
                      <td className="fw-bold py-2 px-3">Total</td>
                      <td className="fw-bold py-2 px-3">{totals.sale.toFixed(3)}</td>
                      <td className="fw-bold py-2 px-3">{totals.return.toFixed(3)}</td>
                      <td className="fw-bold py-2 px-3">{totals.lifting.toFixed(3)}</td>
                      <td></td>
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
                <Row className="mb-3 g-3">
                  <Col lg={2} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Fuel</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        value={cashDetails.fuel}
                        onChange={(e) => handleCashDetailChange('fuel', Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={5} md={8} sm={12}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">UBL/RAAST</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Value"
                            value={cashDetails.ublRaast.value}
                            onChange={(e) => handleCashDetailChange('ublRaast', Number(e.target.value), 'value')}
                          />
                        </Col>
                        <Col xs={3}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Qty"
                            value={cashDetails.ublRaast.quantity}
                            onChange={(e) => handleCashDetailChange('ublRaast', Number(e.target.value), 'quantity')}
                          />
                        </Col>
                        <Col xs={5}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Total" 
                            value={cashDetails.ublRaast.total}
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Col lg={5} md={8} sm={12}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">UDHAAR</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Value"
                            value={cashDetails.udhaar.value}
                            onChange={(e) => handleCashDetailChange('udhaar', Number(e.target.value), 'value')}
                          />
                        </Col>
                        <Col xs={3}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Qty"
                            value={cashDetails.udhaar.quantity}
                            onChange={(e) => handleCashDetailChange('udhaar', Number(e.target.value), 'quantity')}
                          />
                        </Col>
                        <Col xs={5}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Total" 
                            value={cashDetails.udhaar.total}
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3 g-3">
                  <Col lg={5} md={8} sm={12}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Foils</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Value"
                            value={cashDetails.foils.value}
                            onChange={(e) => handleCashDetailChange('foils', Number(e.target.value), 'value')}
                          />
                        </Col>
                        <Col xs={3}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Qty"
                            value={cashDetails.foils.quantity}
                            onChange={(e) => handleCashDetailChange('foils', Number(e.target.value), 'quantity')}
                          />
                        </Col>
                        <Col xs={5}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Total" 
                            value={cashDetails.foils.total}
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Col lg={5} md={8} sm={12}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Scheme</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Value"
                            value={cashDetails.scheme.value}
                            onChange={(e) => handleCashDetailChange('scheme', Number(e.target.value), 'value')}
                          />
                        </Col>
                        <Col xs={3}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Qty"
                            value={cashDetails.scheme.quantity}
                            onChange={(e) => handleCashDetailChange('scheme', Number(e.target.value), 'quantity')}
                          />
                        </Col>
                        <Col xs={5}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Total" 
                            value={cashDetails.scheme.total}
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Bike Maintain</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        value={cashDetails.bikeMaintain}
                        onChange={(e) => handleCashDetailChange('bikeMaintain', Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="g-3">
                  <Col lg={5} md={8} sm={12}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Incentive</Form.Label>
                      <Row>
                        <Col xs={4}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Value"
                            value={cashDetails.incentive.value}
                            onChange={(e) => handleCashDetailChange('incentive', Number(e.target.value), 'value')}
                          />
                        </Col>
                        <Col xs={3}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Qty"
                            value={cashDetails.incentive.quantity}
                            onChange={(e) => handleCashDetailChange('incentive', Number(e.target.value), 'quantity')}
                          />
                        </Col>
                        <Col xs={5}>
                          <Form.Control 
                            type="number" 
                            size="sm" 
                            placeholder="Total" 
                            value={cashDetails.incentive.total}
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Adeel Bhai</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        value={cashDetails.adeelBhai}
                        onChange={(e) => handleCashDetailChange('adeelBhai', Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Agency Expense</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        value={cashDetails.agencyExpense}
                        onChange={(e) => handleCashDetailChange('agencyExpense', Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">TOTAL</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm" 
                        disabled 
                        className="bg-light fw-bold"
                        value={totals.cashTotal}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="p-4 rounded" style={{ background: '#f0f4ff' }}>
                <h5 className="mb-3" style={{ fontSize: '1rem', color: '#2c3e50' }}>Summary</h5>
                <Row className="g-3">
                  <Col lg={3} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Cash Difference</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm" 
                        disabled 
                        className={`bg-light fw-bold ${totals.cashDifference < 0 ? 'text-danger' : 'text-success'}`}
                        value={totals.cashDifference.toFixed(2)}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">G. TOTAL</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm" 
                        disabled 
                        className="bg-light fw-bold"
                        value={totals.gTotal.toFixed(2)}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Bike Reading</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        value={totals.bikeReading}
                        onChange={(e) => setTotals({...totals, bikeReading: Number(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Fuel Price</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        value={totals.fuelPrice}
                        onChange={(e) => setTotals({...totals, fuelPrice: Number(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={2} md={4} sm={6}>
                    <Form.Group className="mb-0">
                      <Form.Label className="fw-bold small mb-1">Fuel Price Differ</Form.Label>
                      <Form.Control 
                        type="number" 
                        size="sm"
                        value={totals.fuelPriceDiffer}
                        onChange={(e) => setTotals({...totals, fuelPriceDiffer: Number(e.target.value)})}
                      />
                    </Form.Group>
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