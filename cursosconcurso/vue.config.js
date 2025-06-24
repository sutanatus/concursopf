const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        // Adicione estas linhas para logs úteis:
        onProxyReq: (proxyReq) => {
          console.log(`Proxy: ${proxyReq.path} -> ${proxyReq.getHeader('host')}${proxyReq.path}`)
        },
        // Timeout aumentado para requisições pesadas
        proxyTimeout: 30000
      }
    },
    // Adicione para melhor feedback no console
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },
  
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/styles/variables.scss";
          @import "@/assets/styles/mixins.scss";
        `
      }
    }
  },
  
  publicPath: process.env.NODE_ENV === 'production'
    ? '/flashcards-app/'
    : '/',
  
  // Adicione esta configuração para melhor performance
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    }
  }
})