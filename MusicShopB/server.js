//deklaracja korzystania z modułu dotenv(.env)
require('dotenv').config();

//deklaracja korzystania z modułu http
const http = require('http');

const app = require('./index');

//tworzenie servera
const server = http.createServer(app);
server.listen(process.env.PORT);
