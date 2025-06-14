import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProductScreen = () => {
  // Placeholder data - replace with actual data from your backend
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', category: 'Category A', price: 100, stock: 50 },
    { id: 2, name: 'Product 2', category: 'Category B', price: 200, stock: 30 },
    { id: 3, name: 'Product 3', category: 'Category A', price: 150, stock: 40 },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="mb-0" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#2c3e50' }}>
            Products
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
          >
            <FaPlus size={14} />
            Add Product
          </Button>
        </Col>
      </Row>

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
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
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
    </motion.div>
  );
};

export default ProductScreen; 