module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'jjimport.com',
        productName: "Herramientas JJ",
        publish: ['github'],
        publish: [
          {
            provider: "github",
            owner: "devmiguel23",
            repo: "tools-import"
          }
        ],
        win: {
          "publish": [
            "github"
          ],
          target: [
            "nsis",
          ],
          icon: 'public/favicon.ico',
          // requestedExecutionLevel: "requireAdministrator"
        },
        nsis: {
          installerIcon: "public/favicon.ico",
          uninstallerIcon: "public/favicon.ico",
          uninstallDisplayName: "Uninstall",
          // license: "license.txt",
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        }
      },
      nodeIntegration: true,
      // customFileProtocol: './'
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
}