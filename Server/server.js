const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies

// Database Connection
const sequelize = new Sequelize(
  process.env.DB_NAME || "expense_tracker",  // Database name
  process.env.DB_USER || "root",            // MySQL username
  process.env.DB_PASS || "password",        // MySQL password
  {
    host: process.env.DB_HOST || "localhost", // MySQL server host
    dialect: "mysql",                          // Specify MySQL
  }
);

// Test Database Connection
sequelize
  .authenticate()
  .then(() => console.log("Connected to MySQL Database"))
  .catch((err) => console.error("Database connection error:", err));

// Define Expense Model
const Expense = sequelize.define("Expense", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync()
    .then(() => console.log("Database synchronized"))
    .catch((err) => console.error("Error synchronizing database:", err));

// API Routes

// Get all expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err });
  }
});

// Add a new expense
app.post("/expenses", async (req, res) => {
  const { name, amount, category, date } = req.body;

  if (!name || !amount || !category || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newExpense = await Expense.create({ name, amount, category, date });
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ message: "Error adding expense", error: err });
  }
});

// Update an expense by ID
app.put("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.update(req.body);
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: "Error updating expense", error: err });
  }
});

// Delete an expense by ID
app.delete("/expenses/:id", async (req, res) => {
  console.log("Received DELETE request for ID:", req.params.id);

  try {
      const rowsDeleted = await Expense.destroy({ where: { id: req.params.id } });
      if (!rowsDeleted) {
          return res.status(404).json({ message: "Expense not found" });
      }
      res.status(204).send();
  } catch (err) {
      console.error("Error deleting expense:", err);
      res.status(500).json({ message: "Error deleting expense", error: err });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
