# Tabasco Backend

[Live link](https://tabasco.netlify.app/) [Frontend repo](https://github.com/jasonHYLam/Tabasco/tree/main)

This is the server for Tabasco (social media site). It is developed using NodeJS, Express, MongoDB, and features additional technologies including PassportJS, BcryptJS, Multer, Cloudinary. It is deployed using Adaptable.io.

RESTful APIs are written and organised into routes with corresponding controllers in their respective directories. Routes are authorized to prevent non-logged in users from accessing the APIs. Tests for most route actions are written, and follow a pattern of a mock user logging in, testing that the initial data is correct, accessing the route, and testing that the data has changed as expected.

## Features

- Image uploads using Multer and storage using Cloudinary
- Backend tests with Supertest and MongoMemoryServer
- MongoDB database
- Express-sessions for cookie/sessions handling
- Authentication checks for all GET routes
- Login functionality using PassportJS
- Password hashing using BcryptJS
