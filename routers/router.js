// Импортируем модуль url
const url = require("url");

// Импортируем обработчики ГРУПП маршрутов, могут быть и другие вместо userRoutes
const userRoutes = require("./userRoutes/userRoutes");

// Функция для обработки запросов
const routeHandler = (req, res) => {
  // url.parse(urlString, [parseQueryString], [slashesDenoteHost]);
  // - urlString (обяз.) - Строка, содержащая URL-адрес, который нужно разобрать.
  // - parseQueryString (необяз.) - Булево. Если true, то параметры запроса
  //            будут разобраны и превращены в объект. По умолчанию - false.
  // - slashesDenoteHost (необяз.) - Булево. Если true, то двойные слеши будут
  //            рассматриваться как начало компонента хоста.
  //            Это полезно для относительных URL. По умолчанию - false.
  const parsedUrl = url.parse(req.url, true);
  
  // Путь URL, который следует после хоста и порта, но до строки запроса или хеша. Путь указывает на
  // конкретный ресурс на сервере. Он может быть путем к файлу или к динамически генерируемому ресурсу.
  const path = parsedUrl.pathname;

  if (path === "/users" || path.startsWith("/users/")) {
    userRoutes(req, res);
  } else {
    // .setHeader(Name, Value): (Имя заголовка, который вы хотите установить + значение)
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
};

// Экспортируем обработчик маршрутов!!! Указываем чтобы другие файлы импортировали эту функцию
module.exports = routeHandler;
