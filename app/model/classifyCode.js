/**
 * 分类CODE
 */
'use strict';
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const classifyCodeSchema = new Schema({
    code: { type: String }, // 分类编码
    isDelete: { type: Number, default: 0 }, // 是否已删除 （1：是 0：否）
  });
  return mongoose.model('ClassifyCode', classifyCodeSchema, 'classifyCode'); //返回model
};
