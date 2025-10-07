import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../utils/api";
import StatusDot from "../utils/StatusDot";

function ArticlesList() {
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

  const customers = [...new Set(articles.map(a => a.customer))];

  const renderStatus = (hang, pack) => (
    <span className="status-pair">
      <span className={hang ? "status exists" : "status missing"}>
        {hang ? "✓" : "✗"}
      </span>
      {" / "}
      <span className={pack ? "status exists" : "status missing"}>
        {pack ? "✓" : "✗"}
      </span>
    </span>
  );

  const renderMediaStatus = (mc) => {
    let color = "red";   // default = no media
    let filled = true;   // we want solid dots
  
    if (mc.hangning > 0 && mc.packning > 0) {
      color = "green";   // both have media
    } else if (mc.hangning > 0 || mc.packning > 0) {
      color = "orange";  // only one has media
    }
  
    return (
      <span className="media-status">
        <span className="media-numbers">{mc.hangning} / {mc.packning}</span>
        <StatusDot color={color} filled={filled} size={16} />
      </span>
    );
  };

  const renderUpdatedAt = (hangDate, packDate) => {
    const formatDate = (date) => {
      if (!date) return "-";
      return new Date(date).toLocaleString("sv-SE", {
        year: "numeric",
        month: "short",
      });
    };

    return (
      <span className="updated-pair">
        {formatDate(hangDate)} / {formatDate(packDate)}
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
            <th>Kommentar (S/P)</th>
            <th className="media-count">Media (S/P)</th>
            <th>Senast ändrad (S/P)</th>
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
              <td>{renderStatus(article.hang_comment, article.pack_comment)}</td>
              <td className="media-count">
                {article.media_count
                  ? renderMediaStatus(article.media_count)
                  : "-"}
              </td>
              <td>
                {renderUpdatedAt(article.hang_updated_at, article.pack_updated_at)}
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="5">Inga artiklar matchar.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArticlesList;