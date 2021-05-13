/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620907179607_4201';

  // add your middleware config here
  // 配置指定的前端地址
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
    // credentials: true,
  };
  config.security = {
    // 关闭csrf验证
    csrf: false,
    // 白名单
    domainWhiteList: ['*'],
  };
  // 连接mongodb的配置
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/develop',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
