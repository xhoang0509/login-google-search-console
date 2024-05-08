# Flow

## 1. Đăng nhập tài khoản google vào Google App

[https://APP_URL/google-auth](https://APP_URL/google-auth)

```bash
curl --location --request POST 'http://localhost:3333/google-auth' \
--data ''
```

## 2. Đăng nhập tài khoản Gmail trên Selenium

[https://APP_URL/chromium/google-account/login](https://APP_URL/chromium/google-account/login)

```bash
curl --location --request POST 'http://localhost:3333/chromium/google-account/login' \
--data ''
```

## 3. Kiểm tra Google Account đã đăng nhập chưa

[https://APP_URL/chromium/google-account/check](https://APP_URL/chromium/google-account/check)

```bash
curl --location --request POST 'http://localhost:3333/chromium/google-account/check' \
--data ''
```
