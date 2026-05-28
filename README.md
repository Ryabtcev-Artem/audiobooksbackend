# Audiobooks Backend

Простой backend для хранения просмотров книг.

## API

- `GET /views` — возвращает объект всех просмотров.
- `GET /views/:bookId` — возвращает количество просмотров для одной книги.
- `POST /views/:bookId/increment` — увеличивает счётчик просмотров для книги на 1.
- `POST /views/:bookId` — устанавливает значение просмотров для книги.

## Запуск

```bash
cd backend
npm install
npm start
```

Если нужно изменить порт, задайте `PORT`:

```bash
PORT=5000 npm start
```

## Пример запроса из фронтенда

```js
await fetch('https://your-backend.example.com/views/1/increment', {
  method: 'POST',
});
```
