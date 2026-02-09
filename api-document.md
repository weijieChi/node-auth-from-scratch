# API

## server check

Request:
GET `/`

Response:

```json
{
  "message": "server is running."
}
```

## 帳號相關

### 註冊

基本上預設前端或做 checkPassword 比對，傳到後端只有 password 欄位

Request
POST `/user/register`

```json
{
  "name": "user5@example.com",
  "email": "user5@example.com",
  "password": "12345"
}
```

Request

```json
{
  "message": "Registered success!",
  "safeUser": {
    "id": 7,
    "name": "user5",
    "email": "user5@example.com",
    "securityStamp": "61deb639-25af-4401-8c83-73c1db759c2e",
    "createdAt": "2026-02-09T11:15:00.787Z",
    "updatedAt": "2026-02-09T11:15:00.787Z"
  }
}
```

### 登入

因為登入設計成可以支援 session cookie 登入和 jwt 登入，靠 json 的 authStrategy 分別為 `"session"` 還是 `"jwt"` 來決定走 session 登入流程還是發 jwt token

POST `/auth/login`

session 登入
Request

```json
{
  "email": "user1@example.com",
  "password": "12345",
  "authStrategy": "session"
}
```

Response

```json
{
  "user": {
    "id": 1,
    "name": "user1",
    "email": "user1@example.com"
  },
  "authType": "session"
}
```

JWT 登入
Request

```json
{
  "email": "user1@example.com",
  "password": "12345",
  "authStrategy": "jwt"
}
```

Response

```json
{
  "user": {
    "id": 1,
    "name": "user1",
    "email": "user1@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInR5cGUiOiJBQ0NFU1MiLCJpYXQiOjE3NzA2MzU4NDksImV4cCI6MTc3MDYzNjE0OX0.dWpt9rigS0Vly28OrdBFQSL9zcfH7YgNVjgGcjsuXA4",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImp0aSI6IjAxOWM0MjFlLWVlN2YtNzc1ZS05ZjlkLTQ2ODUxYjBmZGI2ZiIsInR5cGUiOiJSRUZSRVNIIiwic2VjdXJpdHlTdGFtcCI6IjVhMzk4ZTY2LTM3N2UtNDM3MC1iNzI4LTNkYmUyOTc2ZmUyNyIsImlhdCI6MTc3MDYzNTg0OSwiZXhwIjoxNzcwNjM3MDQ5fQ.yvGGvLdjiTRE59jaoIw35dJCtamgahNQ240XD3EnifQ"
}
```

登出 logout
POST `/auth/logout`
JWT logout
在 request 帶有 refreshToken 就會執行 JWT 登出，並把該裝置的 refreshToken 在後端資料庫註銷

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImp0aSI6IjAxOWM0MjFlLWVlN2YtNzc1ZS05ZjlkLTQ2ODUxYjBmZGI2ZiIsInR5cGUiOiJSRUZSRVNIIiwic2VjdXJpdHlTdGFtcCI6IjVhMzk4ZTY2LTM3N2UtNDM3MC1iNzI4LTNkYmUyOTc2ZmUyNyIsImlhdCI6MTc3MDYzNTg0OSwiZXhwIjoxNzcwNjM3MDQ5fQ.yvGGvLdjiTRE59jaoIw35dJCtamgahNQ240XD3EnifQ"
}
```

session logout
如果在 `/auth/logout` 沒有在 request json 放 refreshToken ，那後端會檢查 request 是否有 sid cookie ，如果有就執行 session logout

查看帳號資料
GET `/user/profile/`
在 Request headers 需要在放入有效的 accessToken

```
Authorization: Bearer [Your JWT accessToken]
```
或是有效的 session `sid` cookie

Response
```json
{
    "id": 1,
    "name": "user1",
    "email": "user1@example.com",
    "securityStamp": "5a398e66-377e-4370-b728-3dbe2976fe27",
    "createdAt": "2026-01-28T15:19:28.067Z",
    "updatedAt": "2026-01-28T15:19:28.067Z"
}
```

