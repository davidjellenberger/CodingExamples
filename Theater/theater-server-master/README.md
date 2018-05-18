# CSCI 390: Senior Capstone
Elijah Verdoorn, Deandre Bauswell, David Ellenberger

Fall 2017

# Technologies

To get started developing on this project, you'll need the following technologies configured on your machine:
 - Node.js
 - NPM
 - MySQL

The project relies heavily on the following packages:
 - Express
 - Sequelize

# Installation

To begin developing, do the following:

1. Clone this repo
2. Start MySQL
3. Run `scripts/initDatabase.sql` on your local MySQL instance
4. Install node packages with `$ npm install`
5. Migrate the database by running the migrations found in the `migrations` folder. This can be accomplished by running `$ npm run db:migrate:up`
6. Start a development server with `$ npm start`

Happy hacking!!

# Testing

This code is tested with _Jest_. To run the tests, ensure that you have created the database in your local MySQL instance, then do the following:

1. Run migrations on testing database with `npm run db:migrate:up:test`
2. Run tests with `npm test`

All tests should pass before merge requests are created.

# Documentation

This code is documented with JSDoc, and uses the NPM package _apidoc_ to generate useful representations of that documentation. To generate docs for this code:

1. Clone this repo
2. Install apidoc (`npm install -g apidoc`)
3. Create folder `doc`, where documents will be stored
4. Run `npm run document` to generate docs
5. Open `docs/index.html` in a web browser
