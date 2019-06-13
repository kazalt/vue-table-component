module.exports = {
  chainWebpack: (config) => {
    config.entry('main').add('./src/index.js');
  }
};
