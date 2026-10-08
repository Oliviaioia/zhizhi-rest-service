const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
http.createServer((req,res)=>{
  let route; try { route=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400).end();return;}
  if(route==='/') route='/web/index.html';
  if(!/^\/(web|shared)\//.test(route)){res.writeHead(404).end();return;}
  const file=path.resolve(root,'.'+route);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;} res.setHeader('Content-Type',({'html':'text/html; charset=utf-8','css':'text/css; charset=utf-8','js':'text/javascript; charset=utf-8','svg':'image/svg+xml'})[file.split('.').pop()]||'application/octet-stream');res.end(data);});
}).listen(4173,'127.0.0.1',()=>console.log('知止预览 http://127.0.0.1:4173'));
