/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    '/api/': {
      // 要代理的地址
      // target: 'http://61.175.230.9:8012',
      target: 'http://localhost:5103',
      changeOrigin: true,
    },
    '/gis/': {
      // 要代理的地址
      target: 'http://61.175.230.9:8012',
      // target: 'https://fgcs.hunantv.com:8002', // 湖南tv
      // target: 'http://localhost:7221',
      // target: 'http://192.168.31.94:8000',
      // target: 'http://39.102.103.37:8023',
      // 重写路径
      pathRewrite: { '^/gis': '' },
      changeOrigin: true,
      secure: false,
    },
  },
  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
