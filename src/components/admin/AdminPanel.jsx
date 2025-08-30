import { useState } from "react";
import ArticlesTab from "./tabs/ArticlesTab";
import CustomersTab from "./tabs/CustomersTab";
import ToolsTab from "./tabs/ToolsTab";
import "./AdminPanel.css";

function AdminPanel() {
  const [tab, setTab] = useState("articles");

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <button
          className={tab === "articles" ? "active" : ""}
          onClick={() => setTab("articles")}
        >
          Artiklar
        </button>
        <button
          className={tab === "customers" ? "active" : ""}
          onClick={() => setTab("customers")}
        >
          Kunder
        </button>
        <button
          className={tab === "tools" ? "active" : ""}
          onClick={() => setTab("tools")}
        >
          Verktyg
        </button>
      </aside>

      <main className="admin-content">
        {tab === "articles" && <ArticlesTab />}
        {tab === "customers" && <CustomersTab />}
        {tab === "tools" && <ToolsTab />}
      </main>
    </div>
  );
}

export default AdminPanel;