// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const cors = require('cors'); // Import cors package


// Initialize Express app
const app = express();
app.use(express.json());

// Enable CORS middleware
app.use(cors()); // Enable CORS

// Connect to MongoDB database
mongoose.connect('mongodb+srv://Manikanta:Manikanta@cluster0.zra4vkn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Failed to connect to MongoDB:', error));

// Create InventoryItem schema
const inventoryItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number
});

// Create InventoryItem model
const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

// Create RESTful API endpoints
// ... Existing code ...

// GET /inventory - Retrieve the entire inventory
app.get('/inventory', async (req, res) => {
    try {
        const inventory = await InventoryItem.find();
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve inventory' });
    }
});

// GET /inventory/:id - Retrieve a single item from the inventory
app.get('/inventory/:id', async (req, res) => {
    try {
        const inventoryItem = await InventoryItem.findById(req.params.id);
        if (inventoryItem) {
            res.json(inventoryItem);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve item' });
    }
});

// POST /inventory - Add a new item to the inventory
app.post('/inventory', async (req, res) => {
    console.log(req.body)
    try {
        const inventoryItem = new InventoryItem(req.body);
        await inventoryItem.save();
        io.emit('itemAdded', inventoryItem);
        res.json(inventoryItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// PUT /inventory/:id - Update an existing item in the inventory
app.put('/inventory/:id', async (req, res) => {
    console.log(req.body)
    try {
        const inventoryItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (inventoryItem) {
            io.emit('itemUpdated', inventoryItem);
            res.json(inventoryItem);
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' , err:error}) ;
    }
});

// DELETE /inventory/:id - Remove an item from the inventory
app.delete('/inventory/:id', async (req, res) => {
    try {
        const inventoryItem = await InventoryItem.findByIdAndDelete(req.params.id);
        if (inventoryItem) {
            io.emit('itemDeleted', req.params.id);
            res.json({ message: 'Item deleted' });
        } else {
            res.status(404).json({ error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});


// Start the server
const server = app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

// Initialize Socket.IO
const io = socketio(server);

// Listen for socket connections
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Listen for 'itemAdded' event
    socket.on('itemAdded', async (inventoryItem) => {
        try {
            const newItem = new InventoryItem(inventoryItem);
            await newItem.save();
            io.emit('itemAdded', newItem);
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    });

    // Listen for 'itemUpdated' event
    socket.on('itemUpdated', async (inventoryItem) => {
        try {
            const updatedItem = await InventoryItem.findByIdAndUpdate(inventoryItem._id, inventoryItem, { new: true });
            if (updatedItem) {
                io.emit('itemUpdated', updatedItem);
            }
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    });

    // Listen for 'itemDeleted' event
    socket.on('itemDeleted', async (itemId) => {
        try {
            const deletedItem = await InventoryItem.findByIdAndDelete(itemId);
            if (deletedItem) {
                io.emit('itemDeleted', itemId);
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
