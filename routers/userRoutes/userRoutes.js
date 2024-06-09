// Импортируем модуль url
const url = require("url");

// Импортируем все наши методы работы с БД (типа БД)
const createUser = require("./createUser");
const deleteUser = require("./deleteUser");
const getUser = require("./getUser");
const listUsers = require("./listUsers");
const updateUser = require("./updateUser");

// Функция для обработки основных видов HTTP-запросов для CRUD-операций
const userRoutes = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const path = parsedUrl.pathname;

  res.setHeader("Content-Type", "application/json");

  if (path === "/users" && method === "GET") {
    listUsers(req, res);
  } else if (path === "/users" && method === "POST") {
    createUser(req, res);
  } else if (path.startsWith("/users/") && method === "GET") {
    getUser(req, res);
  } else if (path.startsWith("/users/") && method === "PUT") {
    updateUser(req, res);
  } else if (path.startsWith("/users/") && method === "DELETE") {
    deleteUser(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found in users" }));
  }
};

module.exports = userRoutes;
