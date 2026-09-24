// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const roomRoutes = require("./routes/roomRoutes");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const complaintRoutes = require("./routes/complaintRoutes");
// const messRoutes = require("./routes/messRoutes");
// const aiRoutes = require("./routes/aiRoutes");


// dotenv.config();

// const app = express();

// // Connect MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);
// app.use("/api/rooms", roomRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/mess", messRoutes);
// app.use("/api/ai", aiRoutes);



// // Test route
// app.get("/", (req, res) => {
//     res.json({
//         message: "Smart Hostel Life API is running"
//     });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
//2
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const messRoutes = require("./routes/messRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Smart Hostel Life API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});