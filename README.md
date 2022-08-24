# api-server

## create package json

npm init // for start backend project
set package name
set description
set entrypoint ==> app.js

## install node modules

npm install nodemon

## after installing

> go to package.json
> add "script" :{

    "start" : "nodemon app.js",
    }

## start

npm start

## create web server

npm install express

## set and read environment variables

npm install dotenv
// create .env file to add custome environment variables

// previously node use app.use(bodyParser.json()) but
now it us use as app.use(express.json())

## HTTP request logger

npm i morgan

## connect backend to db

npm install mongoose

## Cross origin resource sharing

npm install cors
