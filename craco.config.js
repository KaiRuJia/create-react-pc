const CracoLessPlugin = require('craco-less')
const path = require('path')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        cssLoaderOptions: {
          modules: {
            localIdentName: '[local]_[hash:base64:5]'
          }
        }
      }
    }
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  webpack: {
    alias: {
      'src': path.resolve(__dirname, 'src')
    }
  }
}
