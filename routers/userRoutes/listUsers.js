const data = require("../../pg-data");

// Здесь нам не нужен else, т.к. можем вернуть и пустой результат
module.exports = async (req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify(await data.getUsers()));
};
