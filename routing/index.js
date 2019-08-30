const url = require('url');
const fs = require('fs');

const define = function (req, res, postData) {

    const urlParsed = url.parse(req.url, true);
    let path = urlParsed.pathname;
    prePath = __dirname;
    if(/\./.test(path)) {
        if(path == 'favicon.png') {
          let readStream = fs.createReadStream(prePath+path);
          readStream.pipe(res);
          return;
        }
        else{
         if(/\.mp3$/gi.test(path)) {
            res.writeHead(200, {
              'Content-Type': 'audio/mpeg'
            });
          }
          else if(/\.css$/gi.test(path)) {
            res.writeHead(200, {
              'Content-Type': 'text/css'
            });
          }
          else if(/\.js$/gi.test(path)) {
            res.writeHead(200, {
              'Content-Type': 'application/javascript'
            });
          }
          let readStream = fs.createReadStream(prePath+path);
          readStream.pipe(res);
          return;
        }
      }
    
    try {
        let dynPath = './dynamic/' + path;
      let routeDestination = require(dynPath);
      routeDestination.promise(res,postData,req).then(
        result => {
          res.writeHead(200);
          res.end(result);
          return;
        },
        error => {
          let endMessage = {};
          endMessage.error = 1;
          endMessage.errorName = error;
          res.end(JSON.stringify(endMessage));
          return;
        }
      );
    } catch (err) {
        let filePath = prePath + '/static' + path + '/index.html';
        fs.readFile(filePath, 'utf-8', (err, html) => {
            if (err) {
                let nopath = '/nopage/index.html';
                fs.readFile(nopath, (err, html) => {
                    if (!err) {
                        res.writeHead(404, {
                            'Content-Type': 'text/html'
                        });
                        res.end(html);
                    } else {
                        let text = "Something went wrong. Please contact webmaster";
                        res.writeHead(404, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(text);
                    }
                });
            } else {
                res.writeHead(200, {
                    'Cotent-Type': 'text/html'
                });
                res.end(html);
            }
        });
    }
};

exports.define = define;