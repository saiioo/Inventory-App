import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InventoryList.css";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]); // State for storing inventory data
  const [showPopup, setShowPopup] = useState(false); // State for showing/hiding popup
  const [itemId, setItemId] = useState(""); // State for storing item id to be updated
  const [updatedQuantity, setUpdatedQuantity] = useState(""); // State for storing updated quantity

  // Fetch inventory data from server
  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:3000/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []); // Run fetchInventory() on component mount

  // Handle click event for edit button
  const handleEditClick = (id) => {
    setShowPopup(true); // Show popup
    setItemId(id); // Set item id to be updated
  };

  // Handle click event for update button
  const handleUpdateClick = async () => {
    try {
      await axios.put(`http://localhost:3000/inventory/${itemId}`, {
        quantity: updatedQuantity, // Update quantity of item with updatedQuantity
      });
      setShowPopup(false); // Hide popup
      setUpdatedQuantity(""); // Reset updatedQuantity state
      setItemId(""); // Reset itemId state
      fetchInventory(); // Fetch updated inventory data
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  // Handle click event for delete button
  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/inventory/${id}`); // Delete item with given id
      fetchInventory(); // Fetch updated inventory data
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Handle click event for update inventory button
  const handleUpdateInventoryClick = () => {
    fetchInventory(); // Fetch updated inventory data
  };

  return (
    <div className="inven">
      <button className="update-inventory" onClick={handleUpdateInventoryClick}>Update Inventory</button>
      <div>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    className="edit"
                    onClick={() => handleEditClick(item._id)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDeleteClick(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Update Quantity</h2>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={updatedQuantity}
              onChange={(e) => setUpdatedQuantity(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleUpdateClick}>Update</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InventoryList;
