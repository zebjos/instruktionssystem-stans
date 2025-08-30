import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../utils/api";
import "./AddArticle.css"; // reuse existing styles

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [articleNumber, setArticleNumber] = useState("");
  const [type, setType] = useState("hängning");
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/customers`)
      .then((res) => setCustomers(res.data))
      .catch((err) => {
        console.error("Failed to load customers", err);
        setStatus("❌ Kunde inte hämta kundlistan.");
      });
  }, []);

  const handleUpload = async () => {
    if (files.length === 0 || !selectedCustomer || !articleNumber) {
      setStatus("Alla fält krävs.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("customer", selectedCustomer);
    formData.append("articleNumber", articleNumber);
    formData.append("type", type);

    try {
      setStatus("⏳ Laddar upp...");
      await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("✅ Uppladdning klar");
      setFiles([]);
      setArticleNumber("");
      setSelectedCustomer("");
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("❌ Fel vid uppladdning");
    }
  };

  return (
    <div className="add-article-container">
      <h2>Ladda upp media</h2>
      <form className="add-article-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          Kund:
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Välj kund...</option>
            {customers.map((cust) => (
              <option key={cust.customer_id} value={cust.name}>
                {cust.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Artikelnummer:
          <input
            type="text"
            value={articleNumber}
            onChange={(e) => setArticleNumber(e.target.value.toUpperCase())}
          />
        </label>

        <label>
          Typ:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="hängning">Hängning</option>
            <option value="packning">Packning</option>
          </select>
        </label>

        <label>
          Filer:
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => {
              const selected = Array.from(e.target.files);
              setFiles((prev) => [...prev, ...selected]);
            }}
          />
        </label>

        {files.length > 0 && (
          <ul>
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        )}

        <button type="button" onClick={handleUpload}>
          Ladda upp
        </button>

        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
}

export default UploadPage;