module.exports = {
  externals: {
    fsevents: "require('fsevents')"
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ['github'],
        productName: 'Botpress File Browser Test',
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
