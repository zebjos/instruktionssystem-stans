import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import axios from "axios";
import "./Instructions.css";
import API_BASE from "../utils/api";
import { EditIcon, Upload } from "lucide-react";

function Instructions() {
  const { articleNumber } = useParams();

  const [customer, setCustomer] = useState(""); // ✅ NEW
  const [hangning, setHangning] = useState([]);
  const [packning, setPackning] = useState([]);
  const [hangComment, setHangComment] = useState("");
  const [packComment, setPackComment] = useState("");
  const [hangCreatedBy, setHangCreatedBy] = useState("");
  const [packCreatedBy, setPackCreatedBy] = useState("");
  const [hangUpdatedAt, setHangUpdatedAt] = useState("");
  const [packUpdatedAt, setPackUpdatedAt] = useState("");

  const [isEditingHang, setIsEditingHang] = useState(false);
  const [isEditingPack, setIsEditingPack] = useState(false);
  const [newHangComment, setNewHangComment] = useState("");
  const [newPackComment, setNewPackComment] = useState("");
  const [newHangAuthor, setNewHangAuthor] = useState("");
  const [newPackAuthor, setNewPackAuthor] = useState("");

  useEffect(() => {
    fetchArticleData();
  }, [articleNumber]);

  const fetchArticleData = () => {
    axios
      .get(`${API_BASE}/api/instructions/${articleNumber}`)
      .then((res) => {
        setCustomer(res.data.customer || ""); // ✅ Capture actual customer
        setHangning(res.data.hangning);
        setPackning(res.data.packning);
        setHangComment(res.data.hang_comment);
        setPackComment(res.data.pack_comment);
        setHangCreatedBy(res.data.hang_created_by || "");
        setPackCreatedBy(res.data.pack_created_by || "");
        setHangUpdatedAt(res.data.hang_updated_at || "");
        setPackUpdatedAt(res.data.pack_updated_at || "");
        setNewHangComment(res.data.hang_comment || "");
        setNewPackComment(res.data.pack_comment || "");
        setNewHangAuthor(res.data.hang_created_by || "");
        setNewPackAuthor(res.data.pack_created_by || "");
      })
      .catch((err) => console.error("Failed to fetch instructions", err));
  };

  const handleUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (!customer) {
      alert("Kund saknas i artikelinformationen.");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("articleNumber", articleNumber);
      formData.append("type", type);
      formData.append("customer", customer); // ✅ Use actual customer

      await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`✅ Uppladdning till ${type} klar!`);
      fetchArticleData();
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Fel vid uppladdning");
    }
  };

  const renderMedia = (src, type) => {
    const fullSrc = `${API_BASE}${src}`;
    const parts = src.split("/");
    const customer = parts[2];
    const filename = parts[5];

    const handleDelete = async () => {
      const confirmed = window.confirm(`Ta bort filen ${filename}?`);
      if (!confirmed) return;

      try {
        await axios.delete(`${API_BASE}/api/media`, {
          data: { customer, type, filename },
        });

        if (type === "hängning") {
          setHangning((prev) => prev.filter((f) => f !== src));
        } else {
          setPackning((prev) => prev.filter((f) => f !== src));
        }
      } catch (err) {
        console.error("Failed to delete media:", err);
        alert("Kunde inte ta bort filen.");
      }
    };

    return (
      <div key={src} className="media-item">
        {src.match(/\.(mp4|mov)$/i) ? (
          <Plyr
            source={{
              type: "video",
              sources: [{ src: fullSrc, type: "video/mp4" }],
            }}
          />
        ) : (
          <img className="instructions-media" src={fullSrc} alt="" />
        )}
        <button className="delete-button" onClick={handleDelete}>
          ✕
        </button>
      </div>
    );
  };

  const saveHangComment = () => {
    axios
      .put(`${API_BASE}/api/instructions/${articleNumber}`, {
        hang_comment: newHangComment,
        pack_comment: packComment ?? null,
        hang_created_by: newHangAuthor,
        pack_created_by: packCreatedBy ?? null,
      })
      .then(() => {
        setHangComment(newHangComment);
        setHangCreatedBy(newHangAuthor);
        setHangUpdatedAt(new Date().toISOString());
        setIsEditingHang(false);
      })
      .catch((err) => console.error("Failed to save hang comment", err));
  };

  const savePackComment = () => {
    axios
      .put(`${API_BASE}/api/instructions/${articleNumber}`, {
        hang_comment: hangComment ?? null,
        pack_comment: newPackComment,
        hang_created_by: hangCreatedBy ?? null,
        pack_created_by: newPackAuthor,
      })
      .then(() => {
        setPackComment(newPackComment);
        setPackCreatedBy(newPackAuthor);
        setPackUpdatedAt(new Date().toISOString());
        setIsEditingPack(false);
      })
      .catch((err) => console.error("Failed to save pack comment", err));
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Okänt";
    const date = new Date(isoString);
    return date.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="instructions-container">
      <h2 className="instructions-title">
        Instruktioner för:{" "}
        <span style={{ fontWeight: "normal" }}>{articleNumber}</span>
      </h2>

      {/* --- HÄNGNING --- */}
      <section className="instructions-section">
        <div className="section-header">
          <h3 className="instructions-subtitle">Stansning</h3>
          <label className="upload-label-inline">
            <Upload size={18} /> Ladda upp
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleUpload(e, "hängning")}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="instructions-comment">
          {!isEditingHang && (
            <button
              className="edit-button"
              onClick={() => setIsEditingHang(true)}
            >
              <EditIcon size={18} />
            </button>
          )}
          {isEditingHang ? (
            <>
              <textarea
                value={newHangComment}
                onChange={(e) => setNewHangComment(e.target.value)}
              />
              <input
                type="text"
                value={newHangAuthor}
                onChange={(e) => setNewHangAuthor(e.target.value)}
                placeholder="Namn (skapad av)"
                className="author-input"
              />
              <div className="instructions-buttons">
                <button onClick={saveHangComment}>Spara</button>
                <button onClick={() => setIsEditingHang(false)}>Avbryt</button>
              </div>
            </>
          ) : (
            <>
              {hangComment || "Ingen kommentar tillgänglig ännu."}
              <p>
                <strong>Instruktion av:</strong> {hangCreatedBy || "Okänt"}
              </p>
              <p>
                <em>Senast uppdaterad: {formatDate(hangUpdatedAt)}</em>
              </p>
            </>
          )}
        </div>

        {useMemo(() => hangning.map((m) => renderMedia(m, "hängning")), [hangning])}
      </section>

      <hr />

      {/* --- PACKNING --- */}
      <section className="instructions-section">
        <div className="section-header">
          <h3 className="instructions-subtitle">Packning</h3>
          <label className="upload-label-inline">
            <Upload size={18} /> Ladda upp
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleUpload(e, "packning")}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="instructions-comment">
          {!isEditingPack && (
            <button
              className="edit-button"
              onClick={() => setIsEditingPack(true)}
            >
              <EditIcon size={18} />
            </button>
          )}
          {isEditingPack ? (
            <>
              <textarea
                value={newPackComment}
                onChange={(e) => setNewPackComment(e.target.value)}
              />
              <input
                type="text"
                value={newPackAuthor}
                onChange={(e) => setNewPackAuthor(e.target.value)}
                placeholder="Namn (skapad av)"
                className="author-input"
              />
              <div className="instructions-buttons">
                <button onClick={savePackComment}>Spara</button>
                <button onClick={() => setIsEditingPack(false)}>Avbryt</button>
              </div>
            </>
          ) : (
            <>
              {packComment || "Ingen kommentar tillgänglig ännu."}
              <p>
                <strong>Instruktion av:</strong> {packCreatedBy || "Okänt"}
              </p>
              <p>
                <em>Senast uppdaterad: {formatDate(packUpdatedAt)}</em>
              </p>
            </>
          )}
        </div>

        {useMemo(() => packning.map((m) => renderMedia(m, "packning")), [packning])}
      </section>
    </div>
  );
}

export default Instructions;