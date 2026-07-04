const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const uploadDir = path.join(__dirname, "upload_images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }
  const uploadedFiles = req.files.map((file) => ({
    filename: file.filename,
    path: `/upload_images/${file.filename}`,
  }));
  res.json({ message: "Files uploaded successfully!", files: uploadedFiles });
});

app.use((err, req, res, next) =>
  res.status(500).json({ success: false, error: err.message }),
);

app
  .listen(PORT, () =>
    console.log(`\n  ClickFit running at http://localhost:${PORT}\n`),
  )
  .on("error", (err) => {
    if (err.code === "EADDRINUSE")
      console.error(
        `\n  Port ${PORT} is already in use. Stop the old server first (Ctrl+C in its terminal).\n`,
      );
    else console.error("\n  Server error:", err.message, "\n");
    process.exit(1);
  });
