const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || "change-me-in-railway";
const tokenDuration = process.env.TOKEN_DURATION || "8h";

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin no permitido por CORS."));
    }
  })
);

function parseUsers() {
  const rawUsers = process.env.AUTHORIZED_USERS_JSON || "[]";

  try {
    const users = JSON.parse(rawUsers);

    if (!Array.isArray(users)) {
      return [];
    }

    return users
      .slice(0, 5)
      .filter((user) => user && user.username && user.password)
      .map((user) => ({
        username: String(user.username).trim().toLowerCase(),
        password: String(user.password),
        name: String(user.name || user.username).trim()
      }));
  } catch (error) {
    console.error("No fue posible leer AUTHORIZED_USERS_JSON.", error);
    return [];
  }
}

function findUser(username) {
  const normalized = String(username || "").trim().toLowerCase();
  return parseUsers().find((user) => user.username === normalized);
}

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Falta un token valido." });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "La sesion expiro o no es valida." });
  }
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    configuredUsers: parseUsers().length
  });
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    res.status(400).json({ message: "Usuario y contrasena son obligatorios." });
    return;
  }

  const user = findUser(username);

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Credenciales incorrectas." });
    return;
  }

  const token = jwt.sign(
    {
      username: user.username,
      name: user.name
    },
    jwtSecret,
    { expiresIn: tokenDuration }
  );

  res.json({
    token,
    user: {
      username: user.username,
      name: user.name
    }
  });
});

app.get("/auth/verify", authMiddleware, (req, res) => {
  res.json({
    ok: true,
    user: {
      username: req.user.username,
      name: req.user.name
    }
  });
});

app.listen(port, () => {
  console.log(`RK Ducto backend escuchando en el puerto ${port}`);
});

