import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../utils/api";

function Home() {
  const [articleNumber, setArticleNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = articleNumber.trim();

    if (trimmed === "") {
      setError("Artikelnummer krävs.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/articles/exists?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (data.exists) {
        navigate(`/instructions/${trimmed}`);
      } else {
        setError("Artikeln finns inte i databasen.");
      }
    } catch (err) {
      console.error("Validation error:", err);
      setError("Kunde inte kontrollera artikeln. Försök igen.");
    }
  };

  return (
    <main className="home">
      <img src="/Ljung_logo1-1.png" alt="Ljung logo" className="logo" />
      <p>Sök efter ett artikelnummer för att visa instruktioner för kantpress och packning.</p>
      <form className="search-form" onSubmit={handleSubmit} autoComplete="off">
      <div className="search-controls">
        <input
          type="text"
          id="article"
          value={articleNumber}
          onChange={(e) => {
            setArticleNumber(e.target.value.toUpperCase());
            setError(""); // Clear error when typing
          }}
          placeholder="t.ex. 1234-0045"
        />
        <button type="submit">Sök</button>
      </div>
      <p className="error">{error}</p>

      </form>
    </main>
  );
}

export default Home;