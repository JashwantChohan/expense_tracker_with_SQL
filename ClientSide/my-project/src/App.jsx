import React, { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(0);
    const [tempBudget, setTempBudget] = useState("");
    const [editingExpense, setEditingExpense] = useState(null);

    // Fetch expenses from backend on initial load
    useEffect(() => {
        fetch("http://localhost:3000/expenses")
            .then((response) => response.json())
            .then((data) => setExpenses(data))
            .catch((error) => console.error("Error fetching expenses:", error));
    }, []);

    // Calculate the remaining budget
    const remainingBudget = budget - expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // add and update expense
    const handleAddOrUpdateExpense = (expense) => {
        const url = editingExpense
            ? `http://localhost:3000/expenses/${expense.id}` 
            : "http://localhost:3000/expenses";

        const method = editingExpense ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense),
        })
            .then((response) => response.json())
            .then((updatedExpense) => {
                if (editingExpense) {
                    // Update logic
                    setExpenses((prev) =>
                        prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp))
                    );
                } else {
                    // Add logic
                    setExpenses((prev) => [...prev, updatedExpense]);
                }
            })
            .catch((error) => console.error(`Error ${editingExpense ? "updating" : "adding"} expense:`, error));

        setEditingExpense(null); // Clear editing state
    };


    // Handle deleting an expense
    const handleDeleteExpense = async (id) => {
        console.log("Deleting expense with ID:", id);

        if (!id) {
            console.error("Error: ID is undefined in handleDeleteExpense");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/expenses/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Failed to delete expense: ${response.statusText}`);
            }

            // Refresh the expense list (or update state to reflect changes)
            console.log("Expense deleted successfully");
            setExpenses(expenses.filter((expense) => expense.id !== id));
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };




    // Handle setting the budget
    const handleSetBudget = () => {
        const newBudget = parseFloat(tempBudget);
        if (isNaN(newBudget) || newBudget <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }
        setBudget(newBudget);
        setTempBudget(""); // Reset the input field
    };

    return (
        <div className="font-sans  bg-white  p-1 	">
            <div className=" max-w-5xl mt-12 mb-12 ml-auto mr-auto p-5 rounded-lg bg-slate-50 shadow-lg	  mx-auto  space-y-6">
                <h1 className="text-2xl gap-2 mb-5 flex justify-center items-center font-bold">Expense Tracker</h1>

                {/* Set Budget Section */}
                <div className="space-y-4 ">
                    <h2 className=" text-lg font-bold">Set Budget</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            value={tempBudget}
                            onChange={(e) => setTempBudget(e.target.value)}
                            className="border p-2 flex-grow"
                            placeholder="Enter Budget"
                        />
                        <button
                            onClick={handleSetBudget}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Set Budget
                        </button>
                    </div>
                    <p className="text-gray-600">Current Budget: ${budget.toFixed(2)}</p>
                </div>

                {/* Expense Form Section */}
                <ExpenseForm
                    onSubmit={handleAddOrUpdateExpense}
                    editingExpense={editingExpense}
                    remainingBudget={remainingBudget}
                    categories={["Food", "Transport", "Utilities"]}
                />

                {/* Expenses List Section */}
                <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDeleteExpense} />

                {/* Budget Summary Section */}
                <div className="mt-4">
                    <p className="text-lg">
                        <strong>Total Expenses:</strong> ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                    </p>
                    <p className={`text-lg ${remainingBudget < 0 ? "text-red-500" : "text-green-500"}`}>
                        <strong>Remaining Budget:</strong> ${remainingBudget.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
