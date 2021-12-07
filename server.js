const http = require('http')
const path = require('path')
const fs = require('fs')
const { parse } = require('qs')

const port = 3000

const mimeTypes = {
  '.js': 'application/javascript; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
}

const dbUsers = JSON.parse(fs.readFileSync('./user.db.json', 'utf-8'))
console.log('dbUsers:', dbUsers)


const server = http.createServer((req, resp) => {
  const file = path.join('./dist', req.url)

  console.log('-', file, req.url)

  // 如果请求url为 ‘/api/info?name=xxx’ [API]
  const [p, query] = req.url.split('?')
  
  if (p === '/api/info') {
    const qs = parse(query)         //parse()方法：name=xxx => {name: 'xxx'}
    console.log('?', query, qs)

    resp.setHeader('Content-Type', 'application/json; charset=utf-8')
    if (qs.name in dbUsers) {
      resp.end(JSON.stringify(dbUsers[qs.name]))
      return
    }

    resp.statusCode = 404
    resp.end(JSON.stringify({ error: { message: 'user not found', statusCode: 404 } }))
    return
  }

  // 查找是否是dist目录里的文件 [静态资源, js, css, png/jpg/webp, ttf, mp3]
  //existsSync('path')检查路径是否存在；返回true/false
  if (fs.existsSync(file)) {
    const stat = fs.statSync(file)
    if (stat.isFile()) {
      const contents = fs.readFileSync(file)
      resp.setHeader('Content-Type', mimeTypes[path.extname(file)] || 'binary')
      resp.write(contents)
      resp.end()
      return
    }
  }

  // 文件未发现， fallback 到 dist/index.html [spa index.html]
  const contents = fs.readFileSync('./dist/index.html', )
  resp.setHeader('Content-Type', mimeTypes['.html'])
  resp.write(contents)
  resp.end()
})

server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}/`)
})
