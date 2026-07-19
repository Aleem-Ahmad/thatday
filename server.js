const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  // Decode URL in case of spaces/special chars
  let decodedUrl = decodeURIComponent(req.url);
  // Strip query parameters
  decodedUrl = decodedUrl.split('?')[0];

  let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
  const ext = path.extname(filePath);

  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.statusCode = 500;
        res.end('Internal Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
