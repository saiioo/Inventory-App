import React from 'react';
import InventoryList from './InventoryList'; // Import InventoryList component
import './App.css'; // Import CSS styles
import InventoryItemForm from './InventoryItemForm'; // Import InventoryItemForm component

const App = () => {
  return (
    <div className='main-app'> {/* Main container div */}
      <h1 className='inven-heading'>Inventory</h1> {/* Heading for the inventory */}
      <InventoryItemForm /> {/* Render InventoryItemForm component */}
      <InventoryList /> {/* Render InventoryList component */}
    </div>
  );
};

export default App; // Export the App component as default

