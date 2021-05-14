module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // 此处的写法，目的是为了将 /api 替换成 https://127.0.0.1:8000
                target: 'https://127.0.0.1:8000',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}