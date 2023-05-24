const http = require('http');
const fs = require('fs');

let chartData = [];

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // Carrega o arquivo HTML com o gráfico
    fs.readFile('index.html', 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Erro interno do servidor');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  } else if (req.url === '/data' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      chartData = JSON.parse(body);
      res.statusCode = 200;
      res.end('Valores recebidos com sucesso');
    });
  } else if (req.url === '/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(chartData));
  } else {
    res.writeHead(404);
    res.end('Página não encontrada');
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
