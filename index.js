const http = require('http');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
	const reqURL = new URL(path.join('http:/', req.headers.host, req.url));
	const route = reqURL.pathname;
	const whiteList = ['/styles.css', '/app.js'];
	let contentType;
	let page;

	switch (route) {
		case '/':
			page = 'index.html';
			break;
		case '/about':
			page = 'about.html';
			break;
		case '/contact':
			page = 'contact.html';
			break;
		case '/login':
			page = 'login.html';
			break;
		case '/register':
			page = 'register.html';
			break;
		default:
			page = whiteList.includes(route) ? route : '404.html';
			break;
	}

	switch (path.extname(page)) {
		case '.html':
			contentType = 'text/html';
			break;
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.css':
			contentType = 'text/css';
			break;
		case '.ico':
			contentType = 'image/vnd.microsoft.icon';
			break;
	}

	fs.readFile(path.join(__dirname, 'public', page), 'utf-8', (err, data) => {
		if (err) {
			fs.appendFile(
				path.join(__dirname, 'error.txt'),
				`Date: ${Date.now()} Error: ${err.message}\n`,
				() => {}
			);
			res.writeHead(500);
			res.end('<h1>Server Error</h1>');
		} else {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(data);
		}
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}...`);
});
