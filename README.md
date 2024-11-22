
# Server

This directory contains the backend server for the **Admin Dashboard** application. It is built using **Node.js** and **Express.js**, with a **MongoDB** database for storing data related to users, roles, and permissions.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Users](#users)
  - [Roles](#roles)
  - [Permissions](#permissions)
- [Database Models](#database-models)

## Installation

1. Clone the repository and install the dependencies:
   ```sh
   git clone <repository-url>
   cd server
   npm install
   ```

## Configuration

Create a `.env` file in the `server` directory and add the following environment variables:

```
PORT=5000
atlas_database_url=<your-mongodb-uri>  // if using MongoDB Atlas
local_database_url=<your-mongodb-uri>  // if using locally
```

Ensure to navigate to `/server/config/database.js` and uncomment the necessary URL for database connection:

```js
const url = process.env.atlas_database_url;  // for global database
// const url = process.env.local_database_url;    // for local database
```

Ensure MongoDB is running and accessible at the URI specified in the `.env` file.

## Running the Server

To start the server, run:

```sh
npm start
```

The server will start on the port specified in the `.env` file (default is 5000).

## API Endpoints

### Users
- **GET `/api/users`**: Get all users with their roles and permissions.
- **POST `/api/users`**: Create a new user.
- **PUT `/api/users/:id`**: Update an existing user.
- **DELETE `/api/users/:id`**: Delete a user.

### Roles
- **GET `/api/roles`**: Get all roles with populated permissions.
- **POST `/api/roles`**: Create a new role.
- **PUT `/api/roles/:id`**: Update an existing role.
- **DELETE `/api/roles/:id`**: Delete a role.

### Permissions
- **GET `/api/permissions`**: Get all permissions.
- **POST `/api/permissions`**: Create or update a permission group.
- **PUT `/api/permissions/:groupId/:id`**: Update a specific permission within a group.
- **DELETE `/api/permissions/:groupId/:id`**: Delete a permission withing a group and if no permission then delete the group.

## Database Models

- **User**: Represents a user in the system.
- **Role**: Represents a role assigned to users.
- **Permission**: Represents permissions assigned to roles.

For more details on the models and their schemas, refer to the files in the `model` directory.

## Notes

- The server uses **Next.js** for serving static files and handling client-side routing.
- Ensure that the **Next.js application** is built and available in the **standalone directory** before starting the server.
  
For any issues or contributions, please open an issue or submit a pull request.