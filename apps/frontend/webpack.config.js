const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.plugins.push(
    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html',
      filename: './subjects/index.html',
    })
  )
  return config
})
