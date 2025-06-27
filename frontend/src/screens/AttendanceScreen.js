import React, { useState, useEffect } from 'react'
import { Table, Row, Col, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import './AttendanceScreen.css'

const AttendanceScreen = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(2025)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: 'SALESMAN',
    employeeId: ''
  })

  // Position options
  const POSITIONS = [
    'ADMIN',
    'BDE',
    'KPO',
    'SALESMAN'
  ]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate()
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'P': return 'attendance-present'
      case 'S': return 'attendance-sick'
      case 'A': return 'attendance-absent'
      case 'V': return 'attendance-vacation'
      case 'F': return 'attendance-friday'
      default: return ''
    }
  }

  const [employees, setEmployees] = useState([
    {
      id: '1',
      name: 'BABAR',
      position: 'SALESMAN',
      attendance: Array(getDaysInMonth(month, year)).fill('P'),
      totals: { P: 22, S: 2, A: 1, V: 2, F: 3 }
    }
  ])

  const handleAddEmployee = (e) => {
    e.preventDefault()
    const newId = (employees.length + 1).toString()
    const newEmployeeData = {
      ...newEmployee,
      id: newId,
      attendance: Array(getDaysInMonth(month, year)).fill('P'),
      totals: { P: 0, S: 0, A: 0, V: 0, F: 0 }
    }
    setEmployees([...employees, newEmployeeData])
    setNewEmployee({
      name: '',
      position: 'SALESMAN',
      employeeId: ''
    })
  }

  const handleUpdateAttendance = (employeeId, dayIndex, newStatus) => {
    setEmployees(employees.map(emp => {
      if (emp.id === employeeId) {
        const newAttendance = [...emp.attendance]
        newAttendance[dayIndex] = newStatus
        
        // Recalculate totals
        const newTotals = newAttendance.reduce((acc, status) => {
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, { P: 0, S: 0, A: 0, V: 0, F: 0 })
        
        return {
          ...emp,
          attendance: newAttendance,
          totals: newTotals
        }
      }
      return emp
    }))
  }

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Monthly Employee Attendance</h1>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="attendance-header-card">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h5>Month</h5>
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="form-control"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <h5>Year</h5>
                  <select 
                    value={year} 
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="form-control"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <option key={2025 + i} value={2025 + i}>
                        {2025 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="attendance-legend">
        <div className="legend-item attendance-present">P - Present</div>
        <div className="legend-item attendance-sick">S - Sick Leave</div>
        <div className="legend-item attendance-absent">A - Absent</div>
        <div className="legend-item attendance-vacation">V - Vacation</div>
        <div className="legend-item attendance-friday">F - Friday</div>
      </div>

      <div className="table-responsive">
        <Table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Position</th>
              {Array.from({ length: getDaysInMonth(month, year) }, (_, i) => (
                <th key={i + 1}>{i + 1}</th>
              ))}
              <th>P</th>
              <th>S</th>
              <th>A</th>
              <th>V</th>
              <th>F</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                {employee.attendance.map((status, index) => (
                  <td 
                    key={index} 
                    className={getStatusColor(status)}
                    onClick={() => {
                      const statuses = ['P', 'S', 'A', 'V', 'F']
                      const currentIndex = statuses.indexOf(status)
                      const nextStatus = statuses[(currentIndex + 1) % statuses.length]
                      handleUpdateAttendance(employee.id, index, nextStatus)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {status}
                  </td>
                ))}
                <td>{employee.totals.P}</td>
                <td>{employee.totals.S}</td>
                <td>{employee.totals.A}</td>
                <td>{employee.totals.V}</td>
                <td>{employee.totals.F}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Add Employee Form */}
      <div className="add-employee-section mt-4">
        <h2 className="section-title">Add Employee</h2>
        <Form onSubmit={handleAddEmployee} className="add-employee-form">
          <Row>
            <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Employee Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter employee name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter employee ID"
                  value={newEmployee.employeeId}
                  onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
                <Form.Select
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  required
                >
                  {POSITIONS.map(position => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-end">
            <Button type="submit" variant="primary" className="add-employee-btn">
              Add Employee
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AttendanceScreen 