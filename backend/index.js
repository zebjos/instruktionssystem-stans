const express = require("express");
const path = require("path");
const cors = require("cors")
const fs = require("fs");
const db = require("./db");
const { Parser } = require("json2csv");
const multer = require("multer");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fsPromises = require("fs").promises;

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Adjust path in .env depending on what we are running it on
const ROOT_PATH = process.env.ROOT_PATH || "/Users/zyzz/Desktop/produktionsunderlag";

app.use("/media", express.static(ROOT_PATH));

// Automatically add missing columns (non-destructive)
function ensureSchemaUpToDate() {
  const existingColumns = db.prepare(`PRAGMA table_info(article)`).all().map(col => col.name);

  if (!existingColumns.includes("hang_created_by")) {
    db.prepare(`ALTER TABLE article ADD COLUMN hang_created_by TEXT`).run();
    console.log("✅ Added column: hang_created_by");
  }

  if (!existingColumns.includes("pack_created_by")) {
    db.prepare(`ALTER TABLE article ADD COLUMN pack_created_by TEXT`).run();
    console.log("✅ Added column: pack_created_by");
  }

  if (!existingColumns.includes("hang_updated_at")) {
    db.prepare(`ALTER TABLE article ADD COLUMN hang_updated_at TEXT`).run();
    console.log("✅ Added column: hang_updated_at");
  }

  if (!existingColumns.includes("pack_updated_at")) {
    db.prepare(`ALTER TABLE article ADD COLUMN pack_updated_at TEXT`).run();
    console.log("✅ Added column: pack_updated_at");
  }
}

ensureSchemaUpToDate();

// testt
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/api/upload", upload.array("files"), async (req, res) => {
  const { customer, articleNumber, type } = req.body;

  if (!req.files || req.files.length === 0 || !customer || !articleNumber || !type) {
    return res.status(400).json({ error: "Missing file(s) or metadata" });
  }

  const targetDir = path.join(ROOT_PATH, customer, "bilder", type);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const existingCount = fs.readdirSync(targetDir)
    .filter(f => f.startsWith(articleNumber))
    .length;

  let index = existingCount;

  try {
    for (const file of req.files) {
      index += 1;
      const ext = path.extname(file.originalname).toLowerCase();
      const baseFilename = `${articleNumber}_${index}`;
      const outputPath = (newExt) =>
        path.join(targetDir, `${baseFilename}.${newExt}`);

      if (ext === ".heic") {
        await sharp(file.buffer)
          .jpeg({ quality: 90 })
          .toFile(outputPath("jpg"));
      } else if (ext === ".mov" || ext === ".hevc" || ext === ".mp4") {
        const tmpDir = path.join(__dirname, "tmp");
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        const tmpPath = path.join(tmpDir, `${baseFilename}${ext}`);
        fs.writeFileSync(tmpPath, file.buffer);
        await new Promise((resolve, reject) => {
          ffmpeg(tmpPath)
            .toFormat("mp4")
            .on("end", () => {
              fs.unlinkSync(tmpPath);
              resolve();
            })
            .on("error", reject)
            .save(outputPath("mp4"));
        });
      } else {
        fs.writeFileSync(outputPath(ext.replace(".", "")), file.buffer);
      }
    }

    res.json({ success: true, uploaded: req.files.length });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", detail: err.message });
  }
});

// Get instructions and media file paths for a given article number
app.get("/api/instructions/:articleNumber", (req, res) => {
  const articleNumber = req.params.articleNumber.toUpperCase();
  console.log("Looking up article:", articleNumber);

  try {
    // Fetch article with related customer and comments
    const result = db.prepare(`
      SELECT 
        a.article_number,
        c.name AS customer,
        a.hang_comment,
        a.pack_comment,
        a.hang_created_by,
        a.pack_created_by,
        a.hang_updated_at,
        a.pack_updated_at
      FROM article a
      JOIN customer c ON a.customer_id = c.customer_id
      WHERE a.article_number = ? COLLATE NOCASE
    `).get(articleNumber);

    if (!result) {
      return res.status(404).json({ error: "Article not found in the system" });
    }

    const { customer, hang_comment, pack_comment, hang_created_by, pack_created_by, hang_updated_at, pack_updated_at } = result;

    // Build file path to image/video folders
    const basePath = path.join(ROOT_PATH, customer, "bilder");

    const loadFiles = (subfolder) => {
      const dir = path.join(basePath, subfolder);
      console.log("Looking in:", JSON.stringify(dir));
      if (!fs.existsSync(dir)) {
        console.warn("Directory does not exist:", dir);
        return [];
      }
      const files = fs.readdirSync(dir)
        .filter(f => f.startsWith(articleNumber));
      return files.map(f => `/media/${customer}/bilder/${subfolder}/${f}`);
    };

    res.json({
      hangning: loadFiles("hängning"),
      packning: loadFiles("packning"),
      hang_comment,
      pack_comment,
      hang_created_by,
      pack_created_by,
      hang_updated_at,
      pack_updated_at
    });
  } catch (err) {
    console.error("Database error:", err.message);
    return res.status(500).json({ error: "Internal server error", detail: err.message });
  }
});


// Update comments and names for a specific article
app.put("/api/instructions/:articleNumber", (req, res) => {
  const { articleNumber } = req.params;
  const hangComment = req.body.hang_comment ?? null;
  const packComment = req.body.pack_comment ?? null;
  const hangCreatedBy = req.body.hang_created_by ?? null;
  const packCreatedBy = req.body.pack_created_by ?? null;
  const now = new Date().toISOString();

  try {
    const stmt = db.prepare(`
      UPDATE article
      SET 
        hang_comment = ?, 
        pack_comment = ?, 
        hang_created_by = ?, 
        pack_created_by = ?, 
        hang_updated_at = CASE WHEN ? IS NOT NULL THEN ? ELSE hang_updated_at END,
        pack_updated_at = CASE WHEN ? IS NOT NULL THEN ? ELSE pack_updated_at END
      WHERE article_number = ? COLLATE NOCASE
    `);

    const result = stmt.run(
      hangComment,
      packComment,
      hangCreatedBy,
      packCreatedBy,
      hangComment, now,
      packComment, now,
      articleNumber
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "No article found with that number" });
    }

    res.status(200).json({ message: "Instructions updated successfully" });
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add a new article with associated customer
app.post("/api/articles", (req, res) => {
  const { articleNumber, customerId } = req.body;

  if (!articleNumber || !customerId) {
    return res.status(400).json({ error: "Both article number and customer required" });
  }

  try {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO article (article_number, customer_id, updated_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(articleNumber, customerId, now);

    res.status(201).json({ message: "Article added." });
  } catch (err) {
    console.error("Failed to insert customer", err);
    res.status(500).json({ error: "Couldnt save article" });
  }
});


// Get list of all customers
app.get("/api/customers", (req, res) => {
  try {
    const customers = db.prepare("SELECT customer_id, name FROM customer").all();
    res.json(customers);
  } catch (err) {
    console.error("Error while retrieving customers:", err);
    res.status(500).json({ error: "Couldnt retrieve customer list" });
  }
});


// Add a new customer
app.post("/api/customers", (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Kundnamn krävs." });

  try {
    const stmt = db.prepare("INSERT INTO customer (name) VALUES (?)");
    stmt.run(name);
    res.status(201).json({ message: "Customer added" });
  } catch (err) {
    console.error("Fel vid kund-insert:", err);
    res.status(500).json({ error: "Couldnt add customer" });
  }
});


// Get list of all articles with associated customer names
app.get("/api/articles", (req, res) => {
  try {
    const articles = db.prepare(`
      SELECT 
        a.article_id,
        a.article_number,
        c.name AS customer,
        a.hang_comment,
        a.pack_comment,
        a.hang_created_by,
        a.pack_created_by,
        a.hang_updated_at,
        a.pack_updated_at
      FROM article a
      JOIN customer c ON a.customer_id = c.customer_id
      ORDER BY customer ASC
    `).all();

    const withMediaCounts = articles.map(article => {
      const customerPath = path.join(ROOT_PATH, article.customer, "bilder");

      const countFiles = (subfolder) => {
        const dir = path.join(customerPath, subfolder);
        if (!fs.existsSync(dir)) return 0;

        return fs.readdirSync(dir).filter(f => f.startsWith(article.article_number)).length;
      };

      const hangMedia = countFiles("hängning");
      const packMedia = countFiles("packning");

      return {
        ...article,
        media_count: {
          hangning: hangMedia,
          packning: packMedia
        }
      };
    });

    res.json(withMediaCounts);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Failed to get articles" });
  }
});


// Delete an article by its ID
app.delete("/api/articles/:id", (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare("DELETE FROM article WHERE article_id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({ message: "Article removed" });
  } catch (err) {
    console.error("Error deleting article:", err);
    res.status(500).json({ error: "Failed to delete article" });
  }
});


// Delete customer only if there are no articles tied to it
app.delete("/api/customers/:id", (req, res) => {
  const { id } = req.params;

  // Check for existing articles
  const articleCheck = db.prepare("SELECT COUNT(*) as count FROM article WHERE customer_id = ?").get(id);
  if (articleCheck.count > 0) {
    return res.status(400).json({ error: "Cannot delete customer with linked articles" });
  }

  try {
    const stmt = db.prepare("DELETE FROM customer WHERE customer_id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});


// Export all articles as a CSV file

app.get("/api/export/articles", (req, res) => {
  try {
    const articles = db.prepare(`
      SELECT 
        a.article_id,
        a.article_number,
        c.name AS customer,
        a.hang_comment,
        a.pack_comment,
        a.updated_at
      FROM article a
      JOIN customer c ON a.customer_id = c.customer_id
    `).all();

    // Lägg till media_count
    const withMediaCounts = articles.map(article => {
      const customerPath = path.join(ROOT_PATH, article.customer, "bilder");

      const countFiles = (subfolder) => {
        const dir = path.join(customerPath, subfolder);
        if (!fs.existsSync(dir)) return 0;
        return fs.readdirSync(dir).filter(f => f.startsWith(article.article_number)).length;
      };

      const hangCount = countFiles("hängning");
      const packCount = countFiles("packning");

      return {
        ...article,
        media_hangning: hangCount,
        media_packning: packCount
      };
    });

    // Definiera kolumner i CSV
    const fields = [
      "article_id",
      "article_number",
      "customer",
      "hang_comment",
      "pack_comment",
      "updated_at",
      "media_hangning",
      "media_packning"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(withMediaCounts);

    res.header("Content-Type", "text/csv");
    res.attachment("articles_export.csv");
    res.send(csv);
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});


// Get list of customers with count of associated articles
app.get("/api/customers/with-articles", (req, res) => {
  try {
    const result = db.prepare(`
      SELECT 
        c.customer_id,
        c.name,
        COUNT(a.article_id) AS article_count
      FROM customer c
      LEFT JOIN article a ON a.customer_id = c.customer_id
      GROUP BY c.customer_id
      ORDER BY article_count DESC
    `).all();

    res.json(result);
  } catch (err) {
    console.error("Error getting customers with counts:", err);
    res.status(500).json({ error: "Could not retrieve customers" });
  }
});


// Check if an article number already exists
app.get("/api/articles/exists", (req, res) => {
  const query = req.query.q || "";

  try {
    const row = db
      .prepare("SELECT 1 FROM article WHERE article_number = ? LIMIT 1")
      .get(query);

    res.json({ exists: !!row });
  } catch (err) {
    console.error("Exist check error:", err);
    res.status(500).json({ exists: false });
  }
});

// Endpoint to delete media
app.delete("/api/media", async (req, res) => {
  const { customer, type, filename } = req.body;

  if (!customer || !type || !filename) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const filePath = path.join(ROOT_PATH, customer, "bilder", type, filename);
  console.log("Attempting to delete:", filePath);

  try {
    await fsPromises.access(filePath); // check existence
    await fsPromises.unlink(filePath); // async deletion
    res.json({ success: true, message: "File deleted" });
  } catch (err) {
    console.error("File deletion error:", err);
    res.status(500).json({ error: "Failed to delete file", detail: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
