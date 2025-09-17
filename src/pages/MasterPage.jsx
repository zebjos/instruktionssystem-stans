import { BookOpenCheck, ScanSearch, BookOpenText } from "lucide-react";
import "./MasterPage.css";

function MasterPage() {
  const departments = [
    {
      name: "Lackering",
      host: "http://192.168.0.235:5173",
    },
    {
      name: "Montering",
      host: "http://192.168.0.11:5173",
    },
    {
      name: "Kantpress",
      host: "http://192.168.0.12:5173",
    },
    {
      name: "Stans",
      host: "http://192.168.0.13:5173",
    },
  ];

  return (
    <div className="master-container">
      <img src="/Ljung_logo1-1.png" alt="Ljung logo" className="master-logo" />

      <div className="master-grid">
        {departments.map((dept) => (
          <div key={dept.name} className="master-column">
            <div className="button-wrapper">
              <a
                href={dept.host}
                target="_blank"
                rel="noopener noreferrer"
                className="master-btn"
              >
                {dept.name}
              </a>
              <a
                href={`${dept.host}/general`}
                target="_blank"
                rel="noopener noreferrer"
                className="info-icon-btn"
                title="Generell Information"
              >
                <BookOpenText size={25} />
              </a>
            </div>
          </div>
        ))}

        {/* ✅ Planner in same row, no info icon */}
        <div className="master-column">
          <div className="button-wrapper">
            <a
              href="https://ljungsarpsplanner.se"
              target="_blank"
              rel="noopener noreferrer"
              className="master-btn planner-btn"
            >
              Planner
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasterPage;