import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(process.cwd(), "students_results.json");
const STUDENTS_LIST_FILE = path.join(process.cwd(), "students_list.json");
const QUESTIONS_FILE = path.join(process.cwd(), "questions.json");
const CONFIG_FILE = path.join(process.cwd(), "admin_config.json");
const MESSAGES_FILE = path.join(process.cwd(), "messages.json");

// Initial data
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
if (!fs.existsSync(STUDENTS_LIST_FILE)) fs.writeFileSync(STUDENTS_LIST_FILE, JSON.stringify([]));
if (!fs.existsSync(QUESTIONS_FILE)) fs.writeFileSync(QUESTIONS_FILE, JSON.stringify({
  presentSimple: [],
  presentContinuous: [],
  pastSimple: []
}));
if (!fs.existsSync(CONFIG_FILE)) fs.writeFileSync(CONFIG_FILE, JSON.stringify({ adminUser: "halil", adminPass: "1236" }));
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));

// WebSocket Logic
io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("send-message", (data) => {
    const { room, sender, text, timestamp } = data;
    const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
    const newMessage = { room, sender, text, timestamp };
    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages.slice(-100)));
    io.to(room).emit("receive-message", newMessage);
  });
});

// API Routes
app.get("/api/messages/:room", (req, res) => {
  const { room } = req.params;
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
  res.json(messages.filter((m: any) => m.room === room));
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  if (username === config.adminUser && password === config.adminPass) {
    res.json({ success: true, token: "mock-token" });
  } else {
    res.status(401).json({ success: false, message: "Geçersiz kullanıcı adı veya şifre" });
  }
});

app.post("/api/student/login", (req, res) => {
  const { number, password } = req.body;
  const students = JSON.parse(fs.readFileSync(STUDENTS_LIST_FILE, "utf-8"));
  const student = students.find((s: any) => s.number === number && s.password === password);
  if (student) {
    res.json({ success: true, student });
  } else {
    res.status(401).json({ success: false, message: "Geçersiz numara veya şifre" });
  }
});

app.post("/api/admin/register-student", (req, res) => {
  const newStudent = req.body;
  const students = JSON.parse(fs.readFileSync(STUDENTS_LIST_FILE, "utf-8"));
  students.push({ ...newStudent, id: Date.now() });
  fs.writeFileSync(STUDENTS_LIST_FILE, JSON.stringify(students));
  res.json({ success: true });
});

app.get("/api/admin/students-list", (req, res) => {
  const students = JSON.parse(fs.readFileSync(STUDENTS_LIST_FILE, "utf-8"));
  res.json(students);
});

app.post("/api/admin/add-question", (req, res) => {
  const { category, question } = req.body;
  const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, "utf-8"));
  questions[category].push({ ...question, id: Date.now() });
  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions));
  res.json({ success: true });
});

app.get("/api/questions", (req, res) => {
  const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, "utf-8"));
  res.json(questions);
});

app.post("/api/admin/change-profile", (req, res) => {
  const { newUsername, newPassword } = req.body;
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  if (newUsername) config.adminUser = newUsername;
  if (newPassword) config.adminPass = newPassword;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
  res.json({ success: true, message: "Profil güncellendi" });
});

app.post("/api/submit-score", (req, res) => {
  const studentData = req.body;
  const results = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  results.push({ ...studentData, id: Date.now() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(results));
  res.json({ success: true });
});

app.get("/api/students", (req, res) => {
  const results = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  res.json(results);
});

app.get("/api/leaderboard", (req, res) => {
  const results = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  // Group by student number and get max score
  const leaderboard: Record<string, any> = {};
  results.forEach((r: any) => {
    if (!leaderboard[r.studentNumber] || r.score > leaderboard[r.studentNumber].score) {
      leaderboard[r.studentNumber] = {
        name: r.studentName,
        score: r.score,
        correct: r.correctAnswers
      };
    }
  });
  const sorted = Object.values(leaderboard).sort((a, b) => b.score - a.score).slice(0, 10);
  res.json(sorted);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
