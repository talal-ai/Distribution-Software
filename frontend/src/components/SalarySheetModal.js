import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';

const salarySheetData = [
  { date: 'Thursday, May 1, 2025', cashShortage: 2030, advanceSalary: '', details: '', extraCash: '' },
  { date: 'Friday, May 2, 2025', cashShortage: '', advanceSalary: '', details: '', extraCash: '' },
  { date: 'Saturday, May 3, 2025', cashShortage: 1770, advanceSalary: '', details: '', extraCash: '' },
  // ... more rows as needed ...
  { date: 'Thursday, May 29, 2025', cashShortage: 15380, advanceSalary: 4000, details: '', extraCash: '' },
  { date: 'Friday, May 30, 2025', cashShortage: 300, advanceSalary: '', details: '', extraCash: '' },
  { date: 'Saturday, May 31, 2025', cashShortage: '', advanceSalary: '', details: '', extraCash: '' },
];

const summary = {
  salary: 24750,
  incentive: 9900,
  totalSalary: 24750,
  totalCashShortage: 43904,
  totalAdvanceSalary: 7000,
  totalExtraCash: 1700,
  remainingSalary: -24454,
  remainingSalary2: -16324,
};

const cellStyle = {
  border: '1px solid #888',
  textAlign: 'center',
  padding: '6px',
  fontSize: '14px',
};
const headerStyle = {
  ...cellStyle,
  background: '#bdb76b',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
};
const dateColStyle = {
  ...cellStyle,
  background: '#e6e6fa',
  fontWeight: 'bold',
};
const cashShortageCol = { ...cellStyle, background: '#c9c9f7' };
const advanceSalaryCol = { ...cellStyle, background: '#e0c9f7' };
const detailsCol = { ...cellStyle, background: '#e6f7c9' };
const extraCashCol = { ...cellStyle, background: '#c9eaf7' };
const summaryHeader = { ...cellStyle, background: '#444', color: '#fff', fontWeight: 'bold' };
const summaryCell = { ...cellStyle, background: '#f7f7f7', fontWeight: 'bold' };
const summaryNegative = { ...summaryCell, color: '#b71c1c', background: '#fddede' };
const summaryPositive = { ...summaryCell, color: '#1b5e20', background: '#e0f2f1' };

const SalarySheetModal = ({ show, onHide, salesman = 'AMIR' }) => (
  <Modal show={show} onHide={onHide} size="xl" centered>
    <Modal.Header closeButton style={{ background: '#444', color: '#fff' }}>
      <Modal.Title style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 }}>
        {salesman.toUpperCase()} SALARY SHEET
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ background: '#f4f4f4', padding: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <Table bordered responsive style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={headerStyle}>DATE</th>
              <th style={headerStyle}>CASH SHORTAGE</th>
              <th style={headerStyle}>ADVANCE SALARY</th>
              <th style={headerStyle}>DETAILS</th>
              <th style={headerStyle}>EXTRA CASH</th>
            </tr>
          </thead>
          <tbody>
            {salarySheetData.map((row, idx) => (
              <tr key={idx}>
                <td style={dateColStyle}>{row.date}</td>
                <td style={cashShortageCol}>{row.cashShortage}</td>
                <td style={advanceSalaryCol}>{row.advanceSalary}</td>
                <td style={detailsCol}>{row.details}</td>
                <td style={extraCashCol}>{row.extraCash}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* Summary Row */}
      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <Table bordered responsive style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={summaryHeader}>SALARY</th>
              <th style={summaryHeader}>INCENTIVE</th>
              <th style={summaryHeader}>TOTAL SALARY</th>
              <th style={summaryHeader}>TOTAL CASH SHORTAGE</th>
              <th style={summaryHeader}>TOTAL ADVANCE SALARY</th>
              <th style={summaryHeader}>TOTAL EXTRA CASH</th>
              <th style={summaryHeader}>REMAINING SALARY</th>
              <th style={summaryHeader}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={summaryCell}>{summary.salary}</td>
              <td style={summaryCell}>{summary.incentive}</td>
              <td style={summaryCell}>{summary.totalSalary}</td>
              <td style={cashShortageCol}>{summary.totalCashShortage}</td>
              <td style={advanceSalaryCol}>{summary.totalAdvanceSalary}</td>
              <td style={extraCashCol}>{summary.totalExtraCash}</td>
              <td style={summaryNegative}>{summary.remainingSalary}</td>
              <td style={summaryNegative}>{summary.remainingSalary2}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Modal.Body>
    <Modal.Footer style={{ background: '#f4f4f4' }}>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default SalarySheetModal; 