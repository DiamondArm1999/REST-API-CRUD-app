## Двигаемся по архитектуре проекта и объясняем - почему и зачем мы создали много отдельных js файликов:
### Чтобы все в 1 месте не городить, создаем отдельно server.js и routers:
1. Слишком большой файл one-file, в котором собрана всяяяя логика принятия HTTP-запросов, мы **оптимизировали в server.js**, в котором мы импортируем только наш обработчик запросов. 
2. То есть файлику оставляем функциональность, связанную непосредственно с серверной частью
---
### Теперь нам нужно определить, что делает router: а он у нас проверяет - взаимодействуем ли мы с users! Если нет, то 404, если да, то двигаемся по HTTP-запросам дальше.
1. Вынесли мы функциональщину с users в отдельный файлик, т.к. у нас могут быть и другие запросы к серверу, не связанные с users!
2. Вдруг к нам постучатся и попросят передать данные о товарах каких-нибудь из нашего супер-крутого приложения?
3. Поэтому мы заранее выносим эту логику в **routes.js** файлик
---
### Для продолжения логики с выделением маршрутов мы выяснили, что запросы с users лучше вынести в отдельный файл - **userRoutes** (это наш маршрутизатор), который и собирает все возможные запросы и выводит нас соответствующие обработчики каждого из HTTP-запросов
1. Всю логику с userRoutes мы вынесли в отдельную папку, внутри нашего проекта
2. Для того, чтобы использовать логику из вышестоящих по уровню папок, мы юзаем относительный путь с `..` двумя точками
---
### Чтобы работать с данными полученными из запросов мы выносим логику работы с данными в отдельный файл - data.js
1. Файл определяет все действия, которые мы проводим с нашими пользователями, которых мы по-хорошему должны хранить в БД. Однако мы пока до этого не дошли, поэтому юзаем `[]` пустой массив из пользователей и проводим базовую работу с ним в каждом из методов (получить, удалить, изменить, добавить пользователя) - ВОООТ оно наше золотце CRUD.
2. Ну и чтобы это все дело затестить нужно запустить **server.js** через команду *node*. После чего спойкойненько переходим в Postman
---

## Методы и функции, использованные для написания приложения (важно: здесь нет строгой привязки к файлам):
### server.js:
1. createServer([requestListener])
   - *requestListener* (необяз.) - функция обработчика запросов, т.е. вызывается при получении любого запроса. Эта функция получает два аргумента: req (объект запроса) и res (объект ответа). **ОБЪЕКТЫ**!!!
   1) *req* (объект запроса): Содержит информацию о входящем запросе, такую как заголовки, метод, URL и тело запроса.
   2) *res* (объект ответа): Используется для отправки ответа клиенту. Содержит методы для установки статуса, заголовков и тела ответа.
```js
const server = http.createServer(routerHandler);
```
---
2. server.listen(port, [hostname], [backlog], [callback]);
   - *hostname* (необяз.) - либо указываем IP (или хоста), либо слушаем все доступные хосты
   - *backlog* (необяз.) - максимальное количество ожидающих соединений
   - *callback* (необяз.) - функция обратного вызова, вызываемая при запуске сервера
```js
const PORT = 3000;
server.listen(PORT, () => {
console.log(`Server is running on ${PORT}`);
});
```
---
### Request & Response Objects:
[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) - встроенный interface запроса, довольно много информации от разработчиков
[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) - точно такой же интерфейс, но для ответов.

Поверх этих объектов nodeJS Express имеет методы (а здесь [дискуссия по end() & send()](https://stackoverflow.com/questions/29555290/what-is-the-difference-between-res-end-and-res-send) методам и их обработке ответов)
res.end() ==> https://expressjs.com/en/4x/api.html#res.end
res.send() ==> https://expressjs.com/en/4x/api.html#res.send

req.on(*eventName*, *listener*) ==> https://nodejs.org/docs/latest/api/events.html#emitteroneventname-listener  (метод .on() - устанавливает прослушивание (listener - колбэк функция) на eventName)
req.url ==> Contains the URL of the request.

---
### router.js:
1. url.parse(urlString, [parseQueryString], [slashesDenoteHost]); 
   - *urlString* (обяз.) - **Строка**, содержащая URL-адрес, который нужно разобрать.
   - *parseQueryString* (необяз.) - Булево. Если true, то параметры запроса будут разобраны и превращены в объект. По умолчанию - false.
   - *slashesDenoteHost* (необяз.) - Булево. Если true, то двойные слеши будут рассматриваться как начало компонента хоста. Это полезно для относительных URL. По умолчанию - false.
   - URL 

Функция url.parse() используется для анализа URL-адресов в Node.js. Она разбирает строку URL на **объект** с различными компонентами, такими как *протокол, хост, путь и параметры запроса*:
```js
Url {
  protocol: 'http:',     //Протокол URL (например, 'http:')
  slashes: true,         // Булево значение, указывающее, присутствуют ли двойные слеши в URL.
  auth: null,            // Данные авторизации (если есть) в формате 'username'(для URL 'http://user:pass@example.com')
  host: 'example.com:8080',  // host:port (если порт есть)
  port: '8080',            // Номер порта (если указан)
  hostname: 'example.com',  // Хост без порта
  hash: '#hash',            // Фрагмент URL, находящийся после символа `#`. Этот фрагмент используется для якорных ссылок на странице.
  search: '?search=test',    // Строка запроса, находящаяся после символа `?`. Она содержит параметры запроса.
  query: { search: 'test' },  //Объект, представляющий параметры запроса, если `parseQueryString` = `true`. В противном случае это строка.
  pathname: '/pathname/',  // Путь URL, который следует после хоста и порта, но до строки запроса или хеша.
// Путь указывает на конкретный ресурс на сервере. Он может быть путем к файлу или к динамически генерируемому ресурсу.
  path: '/pathname/?search=test', // Путь URL вместе со строкой запроса.
  href: 'http://example.com:8080/pathname/?search=test#hash' // Полный URL-адрес, который был разобран.
}
```

---
### Обновление пользователя:
```js
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
};
```

##### Почему нужно обрабатывать тело запроса вручную
Node.js не предоставляет встроенного способа обработки тела запроса, потому что это может быть сделано разными способами в зависимости от формата данных (JSON, URL-encoded, multipart/form-data и т.д.). Поэтому вам нужно явно указывать, как обрабатывать данные, поступающие в запросе.

##### [Request Body](https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction#request-body) - выжимка из официального сайта:
When receiving a `POST` or `PUT` request, the request body might be important to your application. Getting at the body data is a little more involved than accessing request headers. The `request` object that's passed in to a handler implements the [`ReadableStream`](https://nodejs.org/api/stream.html#stream_class_stream_readable) interface. This stream can be listened to or piped elsewhere just like any other stream. We can grab the data right out of the stream by listening to the stream's `'data'` and `'end'` events.

The chunk emitted in each `'data'` event is a [`Buffer`](https://nodejs.org/api/buffer.html). If you know it's going to be string data, the best thing to do is collect the data in an array, then at the `'end'`, concatenate and stringify it.

```js
let body = [];
request
  .on('data', chunk => {
    body.push(chunk);
  })
  .on('end', () => {
    body = Buffer.concat(body).toString();
    // at this point, `body` has the entire request body stored in it as a string
  });
```

В общем, есть поток данных для каждого запроса, и мы с помощью листенеров можем прослушать стрим, а также идентифицировать конец стрима, но так как данные могут передаваться частями (чанками), нам приходится кувыркаться и собирать всеее данные, прежде чем начать их обработку.

---

## Для работы с postgresql в node.js обращаемся к этой [библиотеке](https://github.com/brianc/node-sql):
### для схемы работы sql queries используем [sqllite doc](https://www.sqlite.org/lang.html)
### для быстрых туториалов по командам:  [tutorial](https://www.tutorialspoint.com/postgresql/postgresql_constraints.htm)
### also see cheat sheet:
![[Cheat-sheet-postgres-sql.png]]
