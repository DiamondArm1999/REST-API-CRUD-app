// деструктурирующее присвоение, общеепринятое соглашение
const { Client } = require("pg");
const { getUserById } = require("./data");

// создания объекта со всей необходимой информацией
const client = new Client({
  user: "testuser", // enter your testuser
  host: "localhost",
  database: "testdb", // enter your db
  password: "xxxxxxxx", // enter your testuser password
  port: 5432,
});

// создание подключения (будем юзать client для взаимодействия с БД)
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to PostgreSQl!");
});

// создадим таблицу users, если уже не создана!!!!
// IF NOT EXISTS - чтобы ошибку не кидало, если уже существует таблица

/* client.query(queryText:string, <values:string[]>, callback:Function(err:Error, rows:Object[]))
 Execute a query with the text of queryText and optional parameters specified in the values array. 
 All values are passed to the PostgreSQL backend server and executed as a parameterized statement. 
 The callback is required and is called with an Error object in the event of a query error, 
 otherwise it is passed an array of result objects. Each element in this array is 
 a dictionary of results with keys for column names and their values as the values for those columns.
*/

client.query(
  `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age SMALLINT NOT NULL
  );
`,
  (err, res) => {
    if (err) {
      console.log("Error creating userstable", err);
    } else {
      console.log("Table users created successfully");
    }
  }
);

// экспортные функции для взаимодействия с БД:
module.exports = {
  // вставка данных в таблицу
  addUser: async function (user) {
    if (!user || !user.name || !user.age) {
      console.log("Error: Invalid user object");
      return;
    }

    try {
      const res = await client.query(
        "INSERT INTO users (name, age) VALUES ($1, $2) RETURNING *",
        [user.name, user.age]
      );
      return res.rows[0];
    } catch (err) {
      console.log("Error inserting user", err);
    }
  },

  // выборка данных из таблицы
  getUserById: async function (id) {
    try {
      const res = await client.query("SELECT * FROM users WHERE id = $1", [id]);
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error getting user by ID", err);
      return null;
    }
  },

  // выборка всех пользователей
  getUsers: async function () {
    try {
      const res = await client.query("SELECT * FROM users");
      return res.rows;
    } catch (err) {
      console.log("Error getting users", err);
      return [];
    }
  },

  // обновление данных в таблице
  updateUser: async function (id, updatedUser) {
    try {
      const res = await client.query(
        "UPDATE users SET name = $1, age = $2 WHERE id = $3 RETURNING *",
        [updatedUser.name, updatedUser.age, id]
      );
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      console.log("Error updating user", err);
      return null;
    }
  },

  // удаление данных из таблицы: Здесь загвоздка, наложил constraint на возраст
  // теперь при обновлении данных требует чтобы возраст не был null
  deleteUser: async function (id) {
    try {
      const res = await client.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
      );
      if (res.rows.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("Error deleting user", err);
      return false;
    }
  },
};
