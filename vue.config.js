module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/oauth-login/'
    : '/',
  devServer: {
    disableHostCheck: true
  }
}