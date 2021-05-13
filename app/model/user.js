'use strict';

module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const userSchema = new Schema({
    role: { type: Number }, // 角色（0：普通用户 1：管理员 3:超级管理员）
    name: { type: String }, // 姓名
    account: { type: String }, // 账号
    password: { type: String }, // 密码
  });
  return mongoose.model('User', userSchema, 'user'); //返回model
};
