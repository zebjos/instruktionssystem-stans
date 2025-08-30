import { useState } from "react";
import "./AdminGate.css"; // external CSS for styling

const ADMIN_CODE = "3333";

function AdminGate({ children }) {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleDigit = (digit) => {
    if (code.length < 4) {
      setCode((prev) => prev + digit);
    }
  };

  const handleClear = () => setCode("");
  const handleSubmit = () => {
    if (code === ADMIN_CODE) {
      setAuthenticated(true);
    } else {
      setCode("");
      alert("Fel kod!");
    }
  };

  if (authenticated) return children;

  return (
    <div className="admin-gate-container">
      <div className="admin-keypad">
        <div className="admin-display">
        {code.split("").map(() => "*").join("") + "_".repeat(4 - code.length)}
        </div>
        <div className="admin-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button key={n} onClick={() => handleDigit(n)} className="admin-btn">
              {n}
            </button>
          ))}
          <button onClick={handleClear} className="admin-btn admin-btn-red">✖</button>
          <button onClick={() => handleDigit(0)} className="admin-btn">0</button>
          <button onClick={handleSubmit} className="admin-btn admin-btn-green">✔</button>
        </div>
      </div>
    </div>
  );
}

export default AdminGate;