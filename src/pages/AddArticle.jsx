import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddArticle.css";
import API_BASE from "../utils/api";

function AddArticle() {
  const [articleNumber, setArticleNumber] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Kunde inte hämta kundlista", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!articleNumber || !selectedCustomerId) {
      setStatus("Fyll i både artikelnummer och välj kund.");
      return;
    }

    try {
      // check if article already exists
      const existsRes = await axios.get(`${API_BASE}/api/articles/exists?q=${articleNumber}`);
      if (existsRes.data.exists) {
        setStatus("✅ Artikeln finns redan — öppnar den nu...");
        setTimeout(() => navigate(`/instructions/${articleNumber}`), 800);
        return;
      }

      // create new one if not exists
      const res = await axios.post(`${API_BASE}/api/articles`, {
        articleNumber,
        customerId: selectedCustomerId,
      });

      setStatus("✅ Artikeln har lagts till! - öppnar den nu...");
      setTimeout(() => navigate(`/instructions/${articleNumber}`), 800);

    } catch (err) {
      console.error("Failed to add article", err);
      setStatus("❌ Kunde inte lägga till artikel.");
    }
  };

  return (
    <div className="add-article-container">
      <h2>Lägg till ny artikel</h2>
      <form onSubmit={handleSubmit} className="add-article-form">
        <label>
          Artikelnummer:
          <input
            type="text"
            value={articleNumber}
            onChange={(e) => setArticleNumber(e.target.value.toUpperCase())}
          />
        </label>

        <label>
          Kund:
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">Välj kund...</option>
            {customers.map((cust) => (
              <option key={cust.customer_id} value={cust.customer_id}>
                {cust.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Lägg till artikel</button>

        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
}

export default AddArticle;