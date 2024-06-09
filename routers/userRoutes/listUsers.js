const data = require("../../data");

// Здесь нам не нужен else, т.к. можем вернуть и пустой результат
module.exports = (req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify(data.getUsers()));
};
