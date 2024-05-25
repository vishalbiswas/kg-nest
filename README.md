# CSV to JSON converter

## Description

Sample app to convert CSV data to JSON and insert into database.

## Setup

Copy `.env.sample` to `.env` and add your relevant configuration values.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints

### 1. POST /

Converts a CSV string from the request body to JSON.

**Example Request:**

```csv
name.firstName, name.lastName, age, address.line1, address.line2, address.city, address.state, gender\nRohit, Prasad, 35, A-563 Rakshak Society, New Pune Road, Pune, Maharashtra, male
```

**Response:**

```json
[
  {
    "name.firstName": "Rohit",
    "name.lastName": "Prasad",
    "age": 35,
    "address.line1": "A-563 Rakshak Society",
    "address.line2": "New Pune Road",
    "address.city": "Pune",
    "address.state": "Maharashtra",
    "gender": "male"
  }
]
```

### 2. POST /file

Reads a CSV file from a path specified in the configuration, converts it to JSON, and inserts the data into a database.

**Response:**

```json
{
  "count": 100000
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Assumptions

1. CSV file is expected to have UTF-8 encoding
2. First Name and Last Name are mandatory
3. Separator (,) can not be used in values

## License

Nest is [MIT licensed](LICENSE).
