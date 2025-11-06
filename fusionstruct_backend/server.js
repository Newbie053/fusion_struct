const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// CORS setup for multiple subdomains
app.use(cors({
  origin: [
    "https://fusionstructengineering.com",
    "https://admin.fusionstructengineering.com",
    "http://localhost:5000/",
    "http://127.0.0.1:5500/"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const contactRoutes = require('./routes/contactRoutes');

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/properties", propertyRoutes);
app.use('/api/contact', contactRoutes);

app.get("/", (req, res) => {
  res.send("FusionStruct Backend API is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
