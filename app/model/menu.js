/**
 * 导航
 */
'use strict';
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const menuSchema = new Schema({
    pid: { type: String, default: '-1' }, // 父级id
    fullId: { type: String, default: '-1' }, // 所有层级的ID
    fullName: { type: String }, // 所有层级的Name
    name: { type: String }, // 导航名称
    enName: { type: String }, // 英文名称
    jumpType: { type: Number }, // 导航跳转类型 1：内链  2：外链
    routePath: { type: String }, // 路由地址
    routeParmas: { type: String }, // 路由参数
    url: { type: String }, // 外链地址
    pagePath: { type: String }, // 页面组件路径
    customPath: { type: String }, // 自定义组件路径
    sort: { type: Number }, // 排序 （越大越靠前）
    status: { type: Number, default: 1 }, // 状态 （1，启用 0，禁用）
    remark: { type: String }, // 备注描述
    createdTime: { type: String }, // 创建时间
    createdBy: { type: String }, // 创建人
    updateTime: { type: String }, // 更新时间
    updateBy: { type: String }, // 更新人
    isDelete: { type: Number, default: 0 }, // 是否已删除 （1：是 0：否）
  });
  return mongoose.model('Menu', menuSchema, 'menu'); //返回model
};
