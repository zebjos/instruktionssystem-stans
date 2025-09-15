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
            <a href={dept.host} target="_blank" className="master-btn">
              {dept.name}
            </a>
            <a href={`${dept.host}/info`} target="_blank" className="master-btn info-btn">
              Info ({dept.name})
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MasterPage;