var http = require('http'),
		parse  = require('url').parse;

function fatorial(n) {
	return (n <= 1) ? 1 : n * fatorial(n - 1);
}

http.createServer(function (req, res) {
	var url = parse(req.url, true);

	if (url.pathname === '/combinacao') {
		var n = parseInt(url.query.n),
		    r = parseInt(url.query.r);

		res.end('Ok: ' + (fatorial(n) / (fatorial(r) * fatorial(n - r))));
	} else {
		res.end();
	}

}).listen(8080, function () {
	console.log('Pronto!');

});
