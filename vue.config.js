module.exports = {
  chainWebpack: config => {
    config.externals({ fsevents: "require('fsevents')" })
    config.module.rule('node')
      .test(/.node$/)
      .use('node-loader')
      .loader('node-loader')
      .end()
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ['github'],
        productName: 'Botpress File Browser Test',
        npmRebuild: false,
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        win: {
          target: [
            'nsis',
            'portable'
          ]
        }
      }

    }

  }
}
