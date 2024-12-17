import React, { useState, useEffect } from "react";

const ExpenseForm = ({
    onSubmit, // Function to handle adding or editing an expense
    editingExpense, // Expense object being edited
    remainingBudget, // Budget to validate expenses
    categories = [], // Available categories for selection
}) => {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState(""); // For showing validation error messages

    useEffect(() => {
        if (editingExpense) {
            setName(editingExpense.name || "");
            setAmount(editingExpense.amount || "");
            setCategory(editingExpense.category || "");
            setDate(editingExpense.date || "");
        }else {
            // Reset fields when there's no expense being edited
            setName("");
            setAmount("");
            setCategory("");
            setDate("");
        }
    }, [editingExpense]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Input validation
        if (!name || !amount || !category || !date) {
            setError("Please fill in all fields correctly.");
            return;
        }

        const expenseAmount = parseFloat(amount);
        if (expenseAmount > remainingBudget) {
            setError("Expense amount exceeds the remaining budget!");
            return;
        }

        const expenseData = {
            id: editingExpense?.id,
            name,
            amount: expenseAmount, // Ensure we use the parsed number here
            category,
            date,
        };

        onSubmit(expenseData); // Trigger the parent handler
        setError(""); // Clear error after submission

        // Reset fields after submission
        setName("");
        setAmount("");
        setCategory("");
        setDate("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex justify-center items-center gap-3 bg-gray-100 py-2 rounded-md shadow-md">
            <div>
                <label className="block text-sm rounded-lg font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full border p-2 rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm rounded-lg font-medium text-gray-700">Amount</label>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount || 0} // Using 0 as default for empty input
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full border p-2 rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm rounded-lg font-medium text-gray-700">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full border p-2 rounded-md"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm rounded-lg font-medium text-gray-700">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full border p-2 rounded-md"
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>} 

            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                {editingExpense ? "Update Expense" : "Add Expense"}
            </button>
        </form>
    );
};

export default ExpenseForm;
