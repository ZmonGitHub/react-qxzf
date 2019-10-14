const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    // 代理规则
    app.use('/api', proxy({
        // 目标服务器
            target: 'http://localhost:3000',
            // 跨域就需要true
            changeOrigin: true,
            pathRewrite: {
                // 将 /api 开头的内容，替换为 '' 空字符串
                '^/api': ''
              }
    }))
}