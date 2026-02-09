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
  "name": "user@example.com",
  "email": "user@example.com",
  "password": "12345"
}
```

Request

```json
{
  "message": "Registered success!",
  "safeUser": {
    "name": "user name",
    "email": "user email",
    "id": 123,
    "securityStamp": "UUID string",
    "createdAt": "Date",
    "updatedAt": "Date"
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

