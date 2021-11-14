const http = require('http')
const express = require('express') //Requiring Express

const app = express()
app.use(express.static('public'))

app.set('port', '3000')

const server = http.createServer(app)
server.on('listening', () => {
 console.log('Listening on port 3000')
})

server.listen('3000')
