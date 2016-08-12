var http = require('http'),
    url  = require('url');

function fatorial(n) {
  console.log('fatorial: ' + n);
  return (n <= 1) ? 1 : n * fatorial(n - 1);
}

http.createServer(function (req, res) {

  var query = url.parse(req.url, true).query;
  var n = parseInt(query.n);
  var r = parseInt(query.r);

  console.log('...');
  var numerador = fatorial(n);
  console.log('___');
  var denominador = fatorial(r);
  console.log('***');
  denominador *= fatorial(n - r);

  res.end('Resultado: ' + (numerador / denominador));

}).listen(8080, function () {
  console.log('Pronto!');

});
