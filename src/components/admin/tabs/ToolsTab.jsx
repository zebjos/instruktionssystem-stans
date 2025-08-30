import "./ToolsTab.css";
import API_BASE from "../../../utils/api";

function ToolsTab() {
  return (
    <div className="tools-tab">
      <h3>Exportera data</h3>
      <p>Här kan du exportera systemets artikeldata.</p>

      <div className="export-buttons">
        <a
          href={`${API_BASE}/api/export/articles`}
          download
          className="export-btn"
        >
          📄 Exportera som CSV
        </a>
      </div>
    </div>
  );
}

export default ToolsTab;
