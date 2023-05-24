const http = require('http');
const fs = require('fs');
const path = require('path');

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

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
