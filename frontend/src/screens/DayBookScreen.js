import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { format, addDays, subDays } from 'date-fns';
import { FaEdit, FaCheck, FaTimes, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  companyName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    backgroundColor: '#b8c6db',
    padding: '10px',
    marginBottom: '5px'
  },
  subHeader: {
    fontSize: '20px',
    color: '#34495e',
    backgroundColor: '#e2e8f0',
    padding: '8px'
  },
  dateHeader: {
    fontSize: '18px',
    backgroundColor: '#718096',
    color: '#fff',
    padding: '8px',
    marginBottom: '15px'
  },
  mainTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '15px'
  },
  tableHeader: {
    backgroundColor: '#e2e8f0',
    padding: '8px',
    border: '1px solid #cbd5e0',
    fontWeight: 'bold'
  },
  cell: {
    padding: '8px',
    border: '1px solid #cbd5e0'
  },
  amountCell: {
    textAlign: 'right',
    padding: '8px',
    border: '1px solid #cbd5e0'
  },
  totalRow: {
    backgroundColor: '#f7fafc',
    fontWeight: 'bold'
  },
  sidePanelsRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '20px',
    overflowX: 'auto'
  },
  miniPanel: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e0',
    borderRadius: '4px'
  },
  miniPanelHeader: {
    backgroundColor: '#b8c6db',
    padding: '8px',
    fontWeight: 'bold',
    borderBottom: '1px solid #cbd5e0',
    textAlign: 'center',
    fontSize: '14px'
  },
  miniPanelBody: {
    padding: '8px'
  },
  miniTable: {
    width: '100%',
    fontSize: '13px'
  },
  miniCell: {
    padding: '4px 8px',
    borderBottom: '1px solid #edf2f7'
  },
  miniAmountCell: {
    textAlign: 'right',
    padding: '4px 8px',
    borderBottom: '1px solid #edf2f7'
  },
  editButton: {
    padding: '2px 5px',
    fontSize: '12px',
    marginLeft: '5px',
    background: 'none',
    border: 'none',
    color: '#4a5568'
  },
  editInput: {
    padding: '2px 4px',
    fontSize: '13px',
    width: '80px',
    border: '1px solid #e2e8f0',
    borderRadius: '3px'
  },
  addNewButton: {
    width: '100%',
    padding: '4px',
    fontSize: '12px',
    background: '#edf2f7',
    border: 'none',
    color: '#4a5568',
    marginTop: '8px',
    borderRadius: '3px'
  }
};

const formatAmount = (amount) => {
  return amount?.toLocaleString() || '-';
};

const EditableCell = ({ value, isEditing, onEdit, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value);

    if (isEditing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input
          type="number"
          style={styles.editInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
        <Button 
          style={styles.editButton} 
          onClick={() => onSave(editValue)}
        >
          <FaCheck />
        </Button>
        <Button 
          style={styles.editButton} 
          onClick={onCancel}
        >
          <FaTimes />
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {formatAmount(value)}
      <Button 
        style={styles.editButton}
        onClick={onEdit}
      >
        <FaEdit />
      </Button>
    </div>
  );
};

const EditableMainCell = ({ value, isEditing, onEdit, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value);

  if (isEditing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input
            type="number"
          style={styles.editInput}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
        <Button 
          style={styles.editButton} 
          onClick={() => onSave(editValue)}
        >
          <FaCheck />
        </Button>
        <Button 
          style={styles.editButton} 
          onClick={onCancel}
        >
          <FaTimes />
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {formatAmount(value)}
      <Button 
        style={styles.editButton}
        onClick={onEdit}
      >
        <FaEdit />
          </Button>
    </div>
  );
};

const DayBookScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2025-06-01'));
  const [editingCell, setEditingCell] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data for current date
  useEffect(() => {
    loadDayBookData();
  }, [currentDate]);

  const loadDayBookData = async () => {
    setIsLoading(true);
    try {
      // Try to load existing data from localStorage
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const savedData = localStorage.getItem(`daybook_${dateKey}`);
      
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        // If no data exists for this date, create new data based on previous day
        const prevDateKey = format(subDays(currentDate, 1), 'yyyy-MM-dd');
        const prevData = localStorage.getItem(`daybook_${prevDateKey}`);
        
        if (prevData) {
          // Use previous day's data as template but reset amounts
          const prevDataObj = JSON.parse(prevData);
          const newData = {
            ...prevDataObj,
            cashIn: prevDataObj.cashIn.map(item => ({
              ...item,
              date: format(currentDate, 'dd-MMM-yy'),
              amount: 0,
              receipt: ''
            })),
            cashOut: prevDataObj.cashOut.map(item => ({
              ...item,
              date: format(currentDate, 'dd-MMM-yy'),
              amount: 0
            })),
            bankIn: prevDataObj.bankIn.map(item => ({
              ...item,
              date: format(currentDate, 'dd-MMM-yy'),
              amount: 0
            })),
            bankOut: prevDataObj.bankOut.map(item => ({
              ...item,
              date: format(currentDate, 'dd-MMM-yy'),
              amount: 0
            })),
            // Reset all panel amounts to 0
            schemes: Object.fromEntries(Object.entries(prevDataObj.schemes).map(([key]) => [key, 0])),
            agencyExpenses: Object.fromEntries(Object.entries(prevDataObj.agencyExpenses).map(([key]) => [key, 0])),
            petrol: Object.fromEntries(Object.entries(prevDataObj.petrol).map(([key]) => [key, 0])),
            cashShortage: Object.fromEntries(Object.entries(prevDataObj.cashShortage).map(([key]) => [key, 0])),
            advanceSalary: Object.fromEntries(Object.entries(prevDataObj.advanceSalary).map(([key]) => [key, 0]))
          };
          setData(newData);
        } else {
          // If no previous data exists, use default template
          setData({
            cashIn: [
              { date: format(currentDate, 'dd-MMM-yy'), description: 'B/F Balance', receipt: '', amount: 0 }
            ],
            cashOut: [
              { date: format(currentDate, 'dd-MMM-yy'), description: 'TODAY AGENCY EXPENSES', amount: 0 },
              { date: format(currentDate, 'dd-MMM-yy'), description: 'TODAY RAAST', amount: 0 },
              { date: format(currentDate, 'dd-MMM-yy'), description: 'TODAY SCHEMES', amount: 0 },
              { date: format(currentDate, 'dd-MMM-yy'), description: 'ADVANCE SALARY', amount: 0 },
              { date: format(currentDate, 'dd-MMM-yy'), description: 'TOTAL CASH SHORT', amount: 0 },
              { date: format(currentDate, 'dd-MMM-yy'), description: 'TOTAL PETROL', amount: 0 }
            ],
            bankIn: [
              { date: format(currentDate, 'dd-MMM-yy'), description: 'Balance B/F', amount: 0 }
            ],
            bankOut: [
              { date: format(currentDate, 'dd-MMM-yy'), description: 'BANK CHARGES', amount: 0 }
            ],
            schemes: {
              ZYN: 0,
              TK: 0,
              CRAFTED: 0,
              'CRAFTED FOILS': 0,
              'STOCK MAINTAIN': 0,
              TOTAL: 0
            },
            agencyExpenses: {
              'SHUAIB FARE': 0,
              'REFRESMENTS': 0,
              Total: 0
            },
            petrol: {
              AMIR: 0,
              WASEEM: 0,
              ADNAN: 0,
              MOBASHIR: 0,
              BABAR: 0,
              'Total Petrol': 0
            },
            cashShortage: {
              AMIR: 0,
              WASEEM: 0,
              ADNAN: 0,
              MOBASHIR: 0,
              BABAR: 0,
              TOTAL: 0
            },
            advanceSalary: {
              AMIR: 0,
              WASEEM: 0,
              ADNAN: 0,
              MOBASHIR: 0,
              BABAR: 0,
              TOTAL: 0
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  // Save data with B/F balances
  useEffect(() => {
    if (data) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      const prevBalances = getPreviousDayBalances();
      
      const dataWithBalances = {
        ...data,
        bfBalances: {
          cash: prevBalances.cash,
          bank: prevBalances.bank,
          total: prevBalances.total
        }
      };
      
      localStorage.setItem(`daybook_${dateKey}`, JSON.stringify(dataWithBalances));
    }
  }, [data, currentDate]);

  const handlePrevDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  const isEditing = (section, index, field) => {
    return editingCell?.section === section && 
           editingCell?.index === index && 
           editingCell?.field === field;
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleEdit = (section, key) => {
    setEditingCell({ section, key });
  };

  const handleSave = (section, key, newValue) => {
    setData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [key]: parseFloat(newValue) || 0
      }
    }));
    setEditingCell(null);
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  const handleAddNew = (section) => {
    const newKey = prompt('Enter name:');
    if (newKey) {
      setData(prevData => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [newKey]: 0
        }
      }));
    }
  };

  const handleMainEdit = (section, index, field) => {
    setEditingCell({ section, index, field });
  };

  const handleMainSave = (section, index, field, newValue) => {
    setData(prevData => ({
      ...prevData,
      [section]: prevData[section].map((item, i) => 
        i === index 
          ? { ...item, [field]: field === 'amount' ? parseFloat(newValue) || 0 : newValue }
          : item
      )
    }));
    setEditingCell(null);
  };

  const handleMainAdd = (section) => {
    const newEntry = {
      date: format(new Date(), 'dd-MMM-yy'),
      description: '',
      receipt: '',
      amount: 0
    };

    setData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], newEntry]
    }));
  };

  const calculateGrandTotal = () => {
    const cashInTotal = calculateTotal(data.cashIn);
    const bankInTotal = calculateTotal(data.bankIn);
    return cashInTotal + bankInTotal;
  };

  const calculateTotalOut = () => {
    const cashOutTotal = calculateTotal(data.cashOut);
    const bankOutTotal = calculateTotal(data.bankOut);
    return cashOutTotal + bankOutTotal;
  };

  const getPreviousDayBalances = () => {
    const prevDate = subDays(currentDate, 1);
    const prevDateKey = format(prevDate, 'yyyy-MM-dd');
    const prevData = localStorage.getItem(`daybook_${prevDateKey}`);
    
    if (prevData) {
      const parsedData = JSON.parse(prevData);
      // Get the previous day's B/F balances first
      const prevBFCash = parsedData.bfBalances?.cash || 0;
      const prevBFBank = parsedData.bfBalances?.bank || 0;
      
      // Calculate previous day's transactions
      const prevDayCashIn = calculateTotal(parsedData.cashIn);
      const prevDayCashOut = calculateTotal(parsedData.cashOut);
      const prevDayBankIn = calculateTotal(parsedData.bankIn);
      const prevDayBankOut = calculateTotal(parsedData.bankOut);
      
      // Calculate closing balances which become today's B/F
      const newBFCash = prevBFCash + prevDayCashIn - prevDayCashOut;
      const newBFBank = prevBFBank + prevDayBankIn - prevDayBankOut;
      
      return {
        cash: newBFCash,
        bank: newBFBank,
        total: newBFCash + newBFBank
      };
    }
    
    return {
      cash: 0,
      bank: 0,
      total: 0
    };
  };

  const calculateTodayNetCash = () => {
    return calculateTotal(data.cashIn) - calculateTotal(data.cashOut);
  };

  const calculateTodayNetBank = () => {
    return calculateTotal(data.bankIn) - calculateTotal(data.bankOut);
  };

  const renderPanel = (title, section, data) => (
    <div style={styles.miniPanel}>
      <div style={styles.miniPanelHeader}>{title}</div>
      <div style={styles.miniPanelBody}>
        <table style={styles.miniTable}>
                <tbody>
            {Object.entries(data).map(([key, value]) => {
              const isTotal = key === 'TOTAL' || key === 'Total' || key === 'Total Petrol';
              if (isTotal) return null;
              
              return (
                <tr key={key}>
                  <td style={styles.miniCell}>{key}</td>
                  <td style={styles.miniAmountCell}>
                    <EditableCell
                      value={value}
                      isEditing={editingCell?.section === section && editingCell?.key === key}
                      onEdit={() => handleEdit(section, key)}
                      onSave={(newValue) => handleSave(section, key, newValue)}
                      onCancel={handleCancel}
                    />
                  </td>
                </tr>
              );
            })}
            {/* Total Row */}
            <tr style={styles.totalRow}>
              <td style={styles.miniCell}>TOTAL</td>
              <td style={styles.miniAmountCell}>
                {formatAmount(
                  Object.entries(data)
                    .filter(([key]) => key !== 'TOTAL' && key !== 'Total' && key !== 'Total Petrol')
                    .reduce((sum, [_, value]) => sum + value, 0)
                )}
              </td>
            </tr>
                </tbody>
        </table>
        <Button
          style={styles.addNewButton}
          onClick={() => handleAddNew(section)}
        >
          <FaPlus /> Add New
        </Button>
      </div>
    </div>
  );

  const renderMainTable = () => (
    <div style={{ marginBottom: '30px' }}>
      <Table style={styles.mainTable}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Narration</th>
            <th style={styles.tableHeader}>Receipt#</th>
            <th style={styles.tableHeader}>Amount</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Narration</th>
            <th style={styles.tableHeader}>Amount</th>
          </tr>
        </thead>
                <tbody>
          <tr>
            <td colSpan="4" style={{ ...styles.cell, backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
              CASH IN
              <Button 
                style={{ ...styles.editButton, marginLeft: '10px' }}
                onClick={() => handleMainAdd('cashIn')}
              >
                <FaPlus />
              </Button>
            </td>
            <td colSpan="3" style={{ ...styles.cell, backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
              CASH OUT
              <Button 
                style={{ ...styles.editButton, marginLeft: '10px' }}
                onClick={() => handleMainAdd('cashOut')}
              >
                <FaPlus />
              </Button>
            </td>
          </tr>
          {data.cashIn.map((item, index) => (
            <tr key={index}>
              <td style={styles.cell}>
                {item.date}
              </td>
              <td style={styles.cell}>
                {isEditing('cashIn', index, 'description') ? (
                  <input
                    style={styles.editInput}
                    value={item.description}
                    onChange={(e) => handleMainSave('cashIn', index, 'description', e.target.value)}
                  />
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {item.description}
                    <Button 
                      style={styles.editButton}
                      onClick={() => handleMainEdit('cashIn', index, 'description')}
                    >
                      <FaEdit />
                    </Button>
                  </div>
                )}
              </td>
              <td style={styles.cell}>
                {isEditing('cashIn', index, 'receipt') ? (
                  <input
                    style={styles.editInput}
                    value={item.receipt}
                    onChange={(e) => handleMainSave('cashIn', index, 'receipt', e.target.value)}
                  />
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {item.receipt}
                    <Button 
                      style={styles.editButton}
                      onClick={() => handleMainEdit('cashIn', index, 'receipt')}
                    >
                      <FaEdit />
                    </Button>
                  </div>
                )}
              </td>
              <td style={styles.amountCell}>
                <EditableMainCell
                  value={item.amount}
                  isEditing={isEditing('cashIn', index, 'amount')}
                  onEdit={() => handleMainEdit('cashIn', index, 'amount')}
                  onSave={(newValue) => handleMainSave('cashIn', index, 'amount', newValue)}
                  onCancel={handleCancel}
                />
              </td>
              <td style={styles.cell}>
                {index < data.cashOut.length ? data.cashOut[index]?.date : ''}
              </td>
              <td style={styles.cell}>
                {index < data.cashOut.length && (
                  isEditing('cashOut', index, 'description') ? (
                    <input
                      style={styles.editInput}
                      value={data.cashOut[index].description}
                      onChange={(e) => handleMainSave('cashOut', index, 'description', e.target.value)}
                    />
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {data.cashOut[index]?.description}
                      <Button 
                        style={styles.editButton}
                        onClick={() => handleMainEdit('cashOut', index, 'description')}
                      >
                        <FaEdit />
                      </Button>
                    </div>
                  )
                )}
              </td>
              <td style={styles.amountCell}>
                {index < data.cashOut.length && (
                  <EditableMainCell
                    value={data.cashOut[index]?.amount}
                    isEditing={isEditing('cashOut', index, 'amount')}
                    onEdit={() => handleMainEdit('cashOut', index, 'amount')}
                    onSave={(newValue) => handleMainSave('cashOut', index, 'amount', newValue)}
                    onCancel={handleCancel}
                  />
                )}
              </td>
            </tr>
          ))}
          <tr style={styles.totalRow}>
            <td colSpan="3" style={styles.cell}>Today Cash</td>
            <td style={styles.amountCell}>{formatAmount(calculateTotal(data.cashIn))}</td>
            <td colSpan="2" style={styles.cell}>CASH OUT TOTAL</td>
            <td style={styles.amountCell}>{formatAmount(calculateTotal(data.cashOut))}</td>
          </tr>
                </tbody>
              </Table>
    </div>
  );

  const renderBankTable = () => (
    <div>
      <Table style={styles.mainTable}>
        <thead>
          <tr>
            <td colSpan="4" style={{ ...styles.cell, backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
              BANK IN
              <Button 
                style={{ ...styles.editButton, marginLeft: '10px' }}
                onClick={() => handleMainAdd('bankIn')}
              >
                <FaPlus />
              </Button>
            </td>
            <td colSpan="3" style={{ ...styles.cell, backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
              BANK OUT
              <Button 
                style={{ ...styles.editButton, marginLeft: '10px' }}
                onClick={() => handleMainAdd('bankOut')}
              >
                <FaPlus />
              </Button>
            </td>
          </tr>
        </thead>
                <tbody>
          {data.bankIn.map((item, index) => (
            <tr key={index}>
              <td style={styles.cell}>
                {item.date}
              </td>
              <td style={styles.cell}>
                {isEditing('bankIn', index, 'description') ? (
                  <input
                    style={styles.editInput}
                    value={item.description}
                    onChange={(e) => handleMainSave('bankIn', index, 'description', e.target.value)}
                  />
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {item.description}
                    <Button 
                      style={styles.editButton}
                      onClick={() => handleMainEdit('bankIn', index, 'description')}
                    >
                      <FaEdit />
                    </Button>
                  </div>
                )}
              </td>
              <td style={styles.cell}></td>
              <td style={styles.amountCell}>
                <EditableMainCell
                  value={item.amount}
                  isEditing={isEditing('bankIn', index, 'amount')}
                  onEdit={() => handleMainEdit('bankIn', index, 'amount')}
                  onSave={(newValue) => handleMainSave('bankIn', index, 'amount', newValue)}
                  onCancel={handleCancel}
                />
              </td>
              <td style={styles.cell}>
                {index < data.bankOut.length ? data.bankOut[index]?.date : ''}
              </td>
              <td style={styles.cell}>
                {index < data.bankOut.length && (
                  isEditing('bankOut', index, 'description') ? (
                    <input
                      style={styles.editInput}
                      value={data.bankOut[index].description}
                      onChange={(e) => handleMainSave('bankOut', index, 'description', e.target.value)}
                    />
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {data.bankOut[index]?.description}
                      <Button 
                        style={styles.editButton}
                        onClick={() => handleMainEdit('bankOut', index, 'description')}
                      >
                        <FaEdit />
                      </Button>
                    </div>
                  )
                )}
              </td>
              <td style={styles.amountCell}>
                {index < data.bankOut.length && (
                  <EditableMainCell
                    value={data.bankOut[index]?.amount}
                    isEditing={isEditing('bankOut', index, 'amount')}
                    onEdit={() => handleMainEdit('bankOut', index, 'amount')}
                    onSave={(newValue) => handleMainSave('bankOut', index, 'amount', newValue)}
                    onCancel={handleCancel}
                  />
                )}
              </td>
            </tr>
          ))}
          <tr style={styles.totalRow}>
            <td colSpan="3" style={styles.cell}>Today Bank</td>
            <td style={styles.amountCell}>{formatAmount(calculateTotal(data.bankIn))}</td>
            <td colSpan="2" style={styles.cell}>BANK OUT TOTAL</td>
            <td style={styles.amountCell}>{formatAmount(calculateTotal(data.bankOut))}</td>
          </tr>
                </tbody>
              </Table>
    </div>
  );

  const renderTotalsSection = () => {
    const grandTotal = calculateGrandTotal();
    const totalOut = calculateTotalOut();
    
    // Calculate today's closing balances
    const todayNetCash = calculateTodayNetCash();
    const todayNetBank = calculateTodayNetBank();
    
    return (
      <Row className="mt-4">
        <Col>
          <Table style={styles.mainTable}>
                <tbody>
              <tr style={styles.totalRow}>
                <td style={styles.cell}>GRAND TOTAL</td>
                <td style={styles.amountCell}>{formatAmount(grandTotal)}</td>
                <td style={styles.cell}>TOTAL OUT</td>
                <td style={styles.amountCell}>{formatAmount(totalOut)}</td>
              </tr>
              <tr style={styles.totalRow}>
                <td style={styles.cell}>NET CASH</td>
                <td style={styles.amountCell}>{formatAmount(todayNetCash)}</td>
                <td style={styles.cell}>NET BANK BALANCE</td>
                <td style={styles.amountCell}>{formatAmount(todayNetBank)}</td>
              </tr>
              <tr style={styles.totalRow}>
                <td style={styles.cell}>CLOSING BALANCE</td>
                <td style={styles.amountCell} colSpan="3">{formatAmount(todayNetCash + todayNetBank)}</td>
              </tr>
                </tbody>
              </Table>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid style={styles.container}>
      <div style={styles.header}>
        <div style={styles.companyName}>GHAZI HOLDINGS</div>
        <div style={styles.subHeader}>DAY BOOK {format(currentDate, 'MMMM yyyy').toUpperCase()}</div>
        <div style={styles.dateHeader}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <Button variant="light" onClick={handlePrevDay}>
              <FaArrowLeft /> Previous Day
            </Button>
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
            <Button variant="light" onClick={handleNextDay}>
              Next Day <FaArrowRight />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
      ) : (
        <>
          <Row>
            <Col md={12}>
              {renderMainTable()}
              {renderBankTable()}
            </Col>
          </Row>

          <div style={styles.sidePanelsRow}>
            {renderPanel('SCHEMES', 'schemes', data.schemes)}
            {renderPanel('TODAY AGENCY EXPENSES', 'agencyExpenses', data.agencyExpenses)}
            {renderPanel('PETROL', 'petrol', data.petrol)}
            {renderPanel('CASH SHORTAGE', 'cashShortage', data.cashShortage)}
            {renderPanel('ADVANCE SALARY', 'advanceSalary', data.advanceSalary)}
          </div>

          {renderTotalsSection()}
        </>
      )}
    </Container>
  );
};

export default DayBookScreen; 