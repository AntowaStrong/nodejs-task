# Node.js Task

### 1. Install dependencies
---
To install project depednedcies, follow to the **/sources** folder and run next command:
> npm install
  

### 2. Configuration
---
To set up application configuration, follow to the **/sources** folder and create file  **/.env** from  **/.env.example**:
> cat .env.example > .env

Then, change the needed enviroment parameters. Parameter list:

Name | Default | Description
-----|---------|------------
HTTPS | false | SSL
SSL_CERT | null | Path to ssl cert.
SSL_KEY | null | Path to ssl key.
PORT | 3001 | Application port.
MYSQL_NAME | db | DB table name.
MYSQL_HOST | localhost | DB host.
MYSQL_USERNAME | root | DB username.
MYSQL_PASSWORD | root | DB password.
MYSQL_PORT | 3306 | DB port.
MYSQL_DIALECT | mysql | DB dialect.
MYSQL_SOCKETPATH | null | Path to mysql socket file, for connection via socket.
MYSQL_DEBUG | false | Sequelize debug flag.


### 3. Setup DB
---
To set up the required tables for the database, follow to the **/sources** the directory and run migration command:
> npm run migrations


### 4. Run
---
To run application, follow to the **/sources** folder and run one of the next commands:
> npm run app  
> Or  
> node index


### 5. Tests
---
To run tests, follow to the **/sources** folder and run next command: 
> npm run test
