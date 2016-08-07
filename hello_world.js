var http = require('http'),
    url  = require('url');

http.createServer(function (req, res) {

  var nome = url.parse(req.url, true).query.nome;
  res.end('Hello ' + nome + '!');

}).listen(8080, function () {

  console.log('Pronto!');

});
