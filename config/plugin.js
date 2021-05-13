'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  validate: {
    enable: true,
    package: 'egg-validate', // 参数验证
  },
  cors: {
    enable: true,
    package: 'egg-cors', // 跨域请求插件
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose', // 添加mongoose插件
  },
};
