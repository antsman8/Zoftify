FROM node:18.16.0

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Удаляем node_modules/bcrypt и переустанавливаем его
RUN rm -rf node_modules/bcrypt
RUN npm install bcrypt

# Собираем приложение
RUN npm run build

CMD ["node", "dist/main"]