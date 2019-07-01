# **Mini WP** (Portofolio Project Week 2)
Website : http://mini-wordpress.alvinchristian7.icu/
----------------------------------------

## MongoDB Schema

### User
`data = { name: String, email: String, password: String, image_url: String, cart: Array, address: String }`

### Products
`data = { seller: [ref('User')], favorite: [ref('User')], featured : Boolean, name : String, description : String, image_url : String, category : String }`

### Transactions
`data = { seller: ref('User'), buyer: ref('User'), products : [ref('Product')], status : String, confirmation : String, subTotal : Number }`

### Transactions
`data = { user: ref('User'), product : ref('Product'), description : String }`

## Endpoint

### *Doesn't Require Token*

#### User Routes
| Routes                | Method | Request Body                           | Response Data      | Description                                 |
| --------------------- | ------ | -------------------------------------- | ------------------ | ------------------------------------------- |
| `/user/register`     | POST   | `{ name, email, password, image_url }` | `{ access-token }` | > Register with new user info               |
| `/user/login`        | POST   | `{ email, password }`                  | `{ access-token }` | Login and get an access token and name      |
| `/user/signingoogle` | POST   | `{ id_token : String }`                         | `{ access-token }` | Sign in with Google and get an access token |

### *Require Token* (`{ headers: { access-token : String } }`)

#### User Routes
| Routes      | Method | Request Body       | Response Data      | Description                                             |
| ----------- | ------ | ------------------ | ------------------ | ------------------------------------------------------- |
| `/user/me` | GET    | -                  | `{ access-token }` | Get info of user currently logged in by access token    |
| `/user/me` | PATCH  | `data (pick each)` | `{ access-token }` | Update info of user currently logged in by access token |

#### Products Routes
| Routes                                                                | Method | Request Body       | Response Data | Description                                                                           |
| --------------------------------------------------------------------- | ------ | ------------------ | ------------- | ------------------------------------------------------------------------------------- |
| `/product`                                                              | POST   | `data`             | `data`        | Create a product (Authenticated user only)                                               |
| `/product`                                                              | GET    | -                  | `[data]`      | Get all user's products (Authenticated user only)                                        |
| `/product?name=STRING&seller=STRING&favorite=STRING&category=STRING` | GET    | -                  | `[data]`      | Search user's products by name / seller / category / favorite (Authenticated user only) |
| `/product/:id`                                                          | GET    | -                  | `data`        | Get a product by ID (Owners only)                                                        |
| `/product/favorite/:id`                                                          | PATCH  | `data (pick each)` | `data`        | Add product to user favorite by user ID currently logged in (Owners only)                        |
| `/product/:id`                                                          | PATCH  | `data (pick each)` | `data`        | Update field(s) of a product with new data(s) by ID (Owners only)                        |
| `/product/:id`                                                          | PUT    | `data`             | `data`        | Update all fields of a product with new datas by ID (Owners only)                        |
| `/product/:id`                                                          | DELETE | -                  | `data`        | Delete a product by ID (Owners only)                                                     |

#### Transactions Routes
| Routes                                                                | Method | Request Body       | Response Data | Description                                                                           |
| --------------------------------------------------------------------- | ------ | ------------------ | ------------- | ------------------------------------------------------------------------------------- |
| `/transaction`                                                              | POST   | `data`             | `data`        | Create a transaction (Authenticated user only)                                               |
| `/transaction`                                                              | GET    | -                  | `[data]`      | Get all user's transactions (Authenticated user only)                                        |
| `/transaction?name=STRING&seller=STRING&favorite=STRING&category=STRING` | GET    | -                  | `[data]`      | Search user's transactions by name / seller / category / favorite (Authenticated user only) |
| `/transaction/:id`                                                          | GET    | -                  | `data`        | Get a transaction by ID (Owners only)                                                        |
| `/transaction/:id`                                                          | PATCH  | `data (pick each)` | `data`        | Update field(s) of a transaction with new data(s) by ID (Owners only)                        |
| `/transaction/:id`                                                          | PUT    | `data`             | `data`        | Update all fields of a transaction with new datas by ID (Owners only)                        |
| `/transaction/:id`                                                          | DELETE | -                  | `data`        | Delete a transaction by ID (Owners only)                                                     |

#### Notifications Routes
| Routes                                                                | Method | Request Body       | Response Data | Description                                                                           |
| --------------------------------------------------------------------- | ------ | ------------------ | ------------- | ------------------------------------------------------------------------------------- |
| `/notification`                                                              | POST   | `data`             | `data`        | Create a notification (Authenticated user only)                                               |
| `/notification`                                                              | GET    | -                  | `[data]`      | Get all user's notifications (Authenticated user only)                                        |
