# JSONServer + JWT Auth

A Fake REST API using json-server with JWT authentication. 


## Install

```bash
$ npm install
$ npm run start-auth
```

Might need to run
```
npm audit fix
```

## How to register?

You can register by sending a POST request to

```
POST http://localhost:8000/auth/register
```
with the following data 

```
{
  "name": "budi",
  "password": "12345",
  "address": "kediri",
  "phone_number": "08212222"
}
```

You should receive an message with the following format 

```
{
    "message": "Register success!"
}
```

## How to login?

You can login by sending a POST request to

```
POST http://localhost:8000/auth/login
```
with the following data 

```
{
  "name": "budi",
  "password": "12345",  
}
```

You should receive an access token with the following format 

```
{
    "access_token": <ACCESS_TOKEN>
}
```

## How to get data products?

You can get the data products by sending a GET request to

```
GET http://localhost:8000/products (get all products)
GET http://localhost:8000/products/1 (get product by id)
GET http://localhost:8000/products?q=lap (get products by search string lap)
GET http://localhost:8000/products?_page=1&_limit=2 (get products by page and limit)
```

## How to add product?

You can add product by sending a POST request to

```
POST http://localhost:8000/products
```
with the following data 

```
{
    "name": "Kabel",
    "price": 1500,
    "quantity": 129
}
```
You should send this authorization with any request to the protected endpoints

```
Authorization: Bearer <ACCESS_TOKEN>
```

## How to update product?

You can add product by sending a PUT request to

```
POST http://localhost:8000/products/5
```
with the following data 

```
{
    "name": "Kabel USB Type C",
    "price": 15000,
    "quantity": 19    
}
```
You should send this authorization with any request to the protected endpoints

```
Authorization: Bearer <ACCESS_TOKEN>
```

## How to delete product?

You can add product by sending a DELETE request to

```
POST http://localhost:8000/products/3
```

You should send this authorization with any request to the protected endpoints

```
Authorization: Bearer <ACCESS_TOKEN>
```

Check out these tutorials:
- [Create a Fake REST API with JSON-Server](https://www.youtube.com/watch?v=1zkgdLZEdwM)
- [Setup fake json server with authentication for API testing](https://www.youtube.com/watch?v=fY4tOjzacOM)

