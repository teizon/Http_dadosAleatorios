const http = require('http');
const fs = require('fs');
const path = require('path');
const socketio = require('socket.io');

let data = []; // Array para armazenar os dados recebidos

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(filePath);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    readStream.pipe(res);
  } else if (req.url === '/data' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Parseie os dados recebidos e adicione-os ao array
      const newData = parseFloat(body);
      data.push(newData);

      // Emitir evento para o cliente informando que um novo dado foi adicionado
      io.emit('newDataAdded', newData);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
  } else if (req.url === '/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else {
    res.writeHead(404);
    res.end('Página não encontrada');
  }
});

// Configurar Socket.IO
const io = socketio(server);

io.on('connection', socket => {
  console.log('Cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
