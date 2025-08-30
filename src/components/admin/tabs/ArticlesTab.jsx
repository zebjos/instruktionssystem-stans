import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ArticlesTab.css";
import API_BASE from "../../../utils/api";

function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE}/api/articles`)
      .then((res) => {
        setArticles(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error("Kunde inte hämta artiklar", err));
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredList = articles.filter(a =>
      a.article_number.toLowerCase().includes(lower) &&
      (customerFilter === "" || a.customer === customerFilter)
    );
    setFiltered(filteredList);
  }, [search, customerFilter, articles]);

  const handleDelete = (id) => {
    if (!window.confirm("Är du säker på att du vill ta bort artikeln?")) return;

    axios.delete(`${API_BASE}/api/articles/${id}`)
      .then(() => {
        setArticles(prev => prev.filter(a => a.article_id !== id));
      })
      .catch((err) => console.error("Kunde inte ta bort artikel", err));
  };

  const customers = [...new Set(articles.map(a => a.customer))];

  const renderStatus = (value) => {
    return value
      ? <span className="status exists">✓ Finns</span>
      : <span className="status missing">✗ Saknas</span>;
  };

  const renderMediaStatus = (mc) => {
    const total = mc.hangning + mc.packning;
    let emoji = "🔴";
    if (mc.hangning > 0 && mc.packning > 0) {
      emoji = "🟢";
    } else if (mc.hangning > 0 || mc.packning > 0) {
      emoji = "🟠";
    }

    return (
      <span className="media-status">
        <span className="media-numbers">{mc.hangning} / {mc.packning}</span>
        <span className="media-emoji">{emoji}</span>
      </span>
    );
  };

  return (
    <div className="articles-tab">
      <div className="articles-controls">
        <input
          type="text"
          placeholder="Sök artikelnummer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
        >
          <option value="">Alla kunder</option>
          {customers.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <table className="articles-table">
        <thead>
          <tr>
            <th>Artikelnummer</th>
            <th>Kund</th>
            <th>Hängkommentar</th>
            <th>Packkommentar</th>
            <th className="media-count">Media</th>
            <th>Senast ändrad</th>
            <th className="actions">Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(article => (
            <tr key={article.article_id}>
              <td>
                <a
                  href={`/instructions/${article.article_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link"
                >
                  {article.article_number}
                </a>
              </td>
              <td>{article.customer}</td>
              <td>{renderStatus(article.hang_comment)}</td>
              <td>{renderStatus(article.pack_comment)}</td>
              <td className="media-count">
                {article.media_count
                  ? renderMediaStatus(article.media_count)
                  : "-"}
              </td>
              <td>
                {article.updated_at
                  ? new Date(article.updated_at).toLocaleString("sv-SE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>
              <td className="actions">
                <button
                  onClick={() => handleDelete(article.article_id)}
                  className="delete-btn"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="7">Inga artiklar matchar.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArticlesTab;