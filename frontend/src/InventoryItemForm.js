import React, { useState } from 'react';
import axios from 'axios';
import './InventoryItemForm.css';

const InventoryItemForm = () => {
  const [name, setName] = useState(''); // State for item name input
  const [quantity, setQuantity] = useState('');  // State for item quantity input

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add new item to server
      const response = await axios.post('http://localhost:3000/inventory', { name, quantity });
      console.log('Item added:', response.data);
      // Reset form fields
      setName('');
      setQuantity('');
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <div className="form-container">
      <h4>Add Item</h4>
      <form onSubmit={handleSubmit} className="form-inline">
        <label className="form-label">
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
        </label>
        <label className="form-label">
          Quantity:
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="form-input" />
        </label>
        <button type="submit" className="form-button">Add</button>
      </form>
    </div>
  );
};

export default InventoryItemForm;
