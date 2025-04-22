const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5004;
const database = require("./connection/mongodb");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

database();

app.use(
  cors({
    origin: "https://restaura-gules.vercel.app/", // Set specific origin, NOT '*'
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
