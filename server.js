/**
 * TANEI 静态服务 + 登录/注册 API
 * 运行: node server.js
 * 访问: http://127.0.0.1:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const ROOT = __dirname;

const PRIVATE_KEY_PATH = path.join(ROOT, '../TN私钥/tanei.pem');
let privateKey = null;
try {
  privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
} catch (e) {
  console.warn('未找到私钥，API 将返回演示模式提示');
}

function decryptRSA(encryptedBase64) {
  if (!privateKey) throw new Error('私钥未配置');
  const decrypted = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(encryptedBase64, 'base64')
  );
  return JSON.parse(decrypted.toString('utf8'));
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pem': 'application/x-pem-file',
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (req.method === 'POST' && url === '/api/login') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { data, timestamp } = JSON.parse(body);
        const payload = decryptRSA(data);
        const { u: username, p: password, t } = payload;
        if (Date.now() - parseInt(t) > 300000) {
          return sendJSON(res, 200, { success: false, message: '请求已过期' });
        }
        sendJSON(res, 200, { success: true, redirect: '/index.html' });
      } catch (e) {
        sendJSON(res, 200, { success: false, message: '解密失败或数据无效' });
      }
    });
    return;
  }

  if (req.method === 'POST' && url === '/api/register') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { data, timestamp } = JSON.parse(body);
        const payload = decryptRSA(data);
        const { u: username, e: email, p: password, t } = payload;
        if (Date.now() - parseInt(t) > 300000) {
          return sendJSON(res, 200, { success: false, message: '请求已过期' });
        }
        sendJSON(res, 200, { success: true, message: '注册成功' });
      } catch (e) {
        sendJSON(res, 200, { success: false, message: '解密失败或数据无效' });
      }
    });
    return;
  }

  const filePath = path.join(ROOT, url === '/' ? 'index.html' : url);
  if (!filePath.startsWith(ROOT)) {
    return send404(res);
  }
  fs.readFile(filePath, (err, data) => {
    if (err) return send404(res);
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

function sendJSON(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
}

server.listen(PORT, () => {
  console.log(`TANEI 服务已启动: http://127.0.0.1:${PORT}`);
  if (!privateKey) console.log('提示: 未配置私钥，请将 TN私钥/tanei.pem 放在项目根目录');
});
