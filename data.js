// Инициализируем массив для хранения пользователей
// пока нет БД, будем для каждой сессии держать свои данные
let users = [];

// Генерация уникального ID для пользователей
// Будем вести счетчик ID, начиная с 1
let currentID = 1;

// Функция для обработки запросов, которые мы все экспортируем

module.exports = {
  getUsers: () => users,
  addUser: (user) => {
    user.id = currentID++;
    users.push(user);
  },
  updateUser: (id, updatedData) => {
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      return users[userIndex];
    }
    return null;
  },
  deleteUser: (id) => {
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      return true;
    }

    return false;
  },

  getUserById: (id) => users.find((u) => u.id === id),
};
