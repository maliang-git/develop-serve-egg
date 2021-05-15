/**
 * 分类
 */
'use strict';
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const classifySchema = new Schema({
    pid: { type: String, default: '1' }, // 父级id
    name: { type: String }, // 分类名称
    code: { type: String }, // 分类编码
    level: { type: Number, default: 1 }, // 层级
    sort: { type: Number }, // 排序 （越小越靠前）
    status: { type: Number, default: 1 }, // 状态 （1，启用 0，禁用）
    remark: { type: String }, // 备注描述
    createdTime: { type: String }, // 创建时间
    createdBy: { type: String }, // 创建人
    updateTime: { type: String }, // 更新时间
    updateBy: { type: String }, // 更新人
    isDelete: { type: Number, default: 0 }, // 是否已删除 （1：是 0：否）
    children: { type: Array, default: [] }, // 子集
  });
  return mongoose.model('Classify', classifySchema, 'classify'); //返回model
};