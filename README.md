# Conduit API Nest

[RealWorld API](https://github.com/gothinkster/realworld/blob/master/api/README.md) via [NestJS](https://nestjs.com/)

# Getting started

## Installation

### Clone the repository

```
git clone git@github.com:PoOwAa/Conduit-api-nest.git
```

### Switch to the repo folder

```
cd conduit
```

### Install dependencies

```
npm install
```

### Copy the config file and set JWT secret key

```
cp .env.example .env
```

## Database

The application uses Sequelize with a mySQL database.

Create a new mysql database with the name `conduit`

Set mysql database settings in .env

```.env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your-mysql-username
DATABASE_PASS=your-mysql-password
DATABASE_NAME=conduit
```
