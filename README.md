# Login with node typescript 
Login created with Node typescript that can be used with ["Postman collections"](Postman%20collection).

## Features
 - JWT authentication
 - CRUD of users
 - Unit test


## Installation

To install the server, you must launch the following command in your console:

```
npm install
```

## Usage
After the installation, to launch the server you must go to the path where you have downloaded the project and launch the following command:

```
npm run dev
```

## Test
To launch the tests you only need to type the following command:

```
npm run test
```
The command "npm run test" launches the following line in the console:

```
jest --detectOpenHandles --collectCoverage
```

If you want to modify the tests without detecting open handles or without collect coverage, just remove the commands in the "script -> test" property of the "package.json" file.

## License

This project is licensed under MIT license. See the file ["LICENSE"](LICENSE) located at the root of the project for more details.
