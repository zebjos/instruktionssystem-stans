import { useEffect, useState } from "react";
import axios from "axios";
import "./CustomersTab.css";
import API_BASE from "../../../utils/api";

function CustomersTab() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState("");
  const [error, setError] = useState(null);

  // Fetch customers with article count
  const fetchCustomers = () => {
    axios.get(`${API_BASE}/api/customers/with-articles`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Failed to fetch customers", err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.trim()) return;

    axios.post(`${API_BASE}/api/customers`, { name: newCustomer.trim() })
      .then(() => {
        setNewCustomer("");
        setError(null);
        fetchCustomers();
      })
      .catch((err) => {
        console.error("Failed to add customer", err);
        setError("Kunden kunde inte läggas till.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Ta bort kund?")) return;

    axios.delete(`${API_BASE}/api/customers/${id}`)
      .then(() => fetchCustomers())
      .catch((err) => {
        console.error("Failed to remove customer", err);
        setError("Kunde inte ta bort kund.");
      });
  };

  return (
    <div className="customers-tab">
      <form className="customer-form" onSubmit={handleAddCustomer}>
        <input
          type="text"
          value={newCustomer}
          onChange={(e) => setNewCustomer(e.target.value)}
          placeholder="Ny kund - namn enligt Produktionsunderlag"
        />
        <button type="submit">Lägg till kund</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      <table className="customers-table">
        <thead>
          <tr>
            <th>Kundnamn</th>
            <th>Antal artiklar</th>
            <th>Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(cust => (
            <tr key={cust.customer_id}>
              <td>{cust.name}</td>
              <td>{cust.article_count}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(cust.customer_id)}
                  disabled={cust.article_count > 0}
                  title={cust.article_count > 0 ? "Kan inte ta bort – har artiklar" : "Ta bort"}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan="3">Inga kunder hittades.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomersTab;