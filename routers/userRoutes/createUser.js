const data = require("../../data");

module.exports = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const parsedBody = new URLSearchParams(body);
    const name = parsedBody.get("name");
    const age = parsedBody.get("age");

    if (name && age) {
      const user = { name, age: parseInt(age) };
      data.addUser(user);
      res.writeHead(201);
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(400);
      res.end(JSON.stringify({ message: "Name and age are required" }));
    }
  });
};
