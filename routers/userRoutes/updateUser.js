const data = require("../../data");

module.exports = (req, res) => {
  const id = parseInt(req.url.split("/")[2]);

  // Поехали обрабатывать тело запроса:
  // создали переменную для хранения тела запроса
  let body = "";

  // Добавляются обработчики событий для сборки данных из тела запроса.
  // Каждый раз, когда приходит кусок данных (chunk), он добавляется к body.
  req.on("data", (chunk) => {
    body += chunk;
  });
  // Когда все данные будут получены, мы можем обработать их. Ловим конец данных.
  req.on("end", () => {
    // парсим тело запроса и инициализируем объект для хранения обновленных данных
    const parsedBody = new URLSearchParams(body);
    const updatedData = {};

    // Нам нужнр сделать проверку на числовое значение age, если не age,
    // то просто добавляем в обновленные данные.
    parsedBody.forEach((value, key) => {
      updatedData[key] = key === "age" ? parseInt(value) : value;
    });

    // наконец-то обновляем пользователя импортированным методом
    const updatedUser = data.updateUser(id, updatedData);

    // обрабатываем результат
    if (updatedUser) {
      res.writeHead(200);
      res.end(JSON.stringify(updatedUser));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "User is not found" }));
    }
  });
};
