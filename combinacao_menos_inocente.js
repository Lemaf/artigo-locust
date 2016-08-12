var http = require('http'),
    url  = require('url');

http.createServer(function (req, res) {

  var numero = parseInt(url.parse(req.url, true).query.numero);
  var i = 0;

    if (i < numero) {
      function forr() {
      console.log(i);
      i++;
      process.nextTick(forr);
    } else {
      res.end('Foram processados ' + numero + ' dados!');
    }
  }

  process.nextTick(forr);

}).listen(8080, function () {

  console.log('Pronto!');

});
