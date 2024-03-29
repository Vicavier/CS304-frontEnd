// const { defineConfig } = require('@vue/cli-service')
const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ]
  },
  transpileDependencies: true,
  devServer:{
    client:{
      overlay:false,
    }
  }
})

// module.exports = {
//   lintOnSave:false, //关闭语法检查
// }
