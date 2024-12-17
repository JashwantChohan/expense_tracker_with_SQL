const ExpenseList = ({ expenses, onEdit, onDelete }) => {
    return (
        <table className="w-full border">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((expense, index) => {
                    // Debugging log to check the expense data
                    console.log("Expense at index", index, ":", expense);

                    return (
                        <tr key={expense.id || index} className="border">
                            <td>{expense.name}</td>
                            <td>${!isNaN(expense.amount) ? expense.amount.toFixed(2) : "Invalid amount"}</td>
                            <td>{expense.category}</td>
                            <td>{expense.date}</td>
                            <td>
                                <button
                                    className="bg-green-500 my-1 mx-1 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={() => {
                                        console.log("Editing expense:", expense);
                                        onEdit(expense);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={() => {
                                        if (!expense.id) {
                                            console.error("Error: Missing _id for expense:", expense);
                                            return;
                                        }
                                        console.log("Deleting expense with ID:", expense.id);
                                        onDelete(expense.id);
                                    }}
                                >
                                    Delete
                                </button>

                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ExpenseList;
