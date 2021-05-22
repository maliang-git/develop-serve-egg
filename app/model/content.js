/**
 * 内容
 */
'use strict';
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const contentSchema = new Schema({
    classifyName: { type: String }, // 所属分类名称
    classifyCode: { type: String }, // 所属分类CODE
    classifyId: { type: String }, // 所属分类id
    codeType: { type: Number }, // 内容code生成方式 （1：系统生成 2：自定义）
    contentCode: { type: String }, //  自定义的内容CODE
    name: { type: String }, // 内容标题
    subName: { type: String }, // 内容副标题
    abstract: { type: String }, // 内容摘要
    enName: { type: String }, // 英文名称
    seoTitle: { type: String }, // seo-title
    seoDescription: { type: String }, // seo-description
    seoKeywords: { type: String }, // seo-Keywords
    content: { type: String }, // 内容
    baseReadNum: { type: Number }, // 基础阅读量
    realReadNum: { type: Number, default: 0 }, // 真实阅读量
    totalReadNum: { type: Number, default: 0 }, // 总阅读量
    isTop: { type: Number }, // 是否置顶  1，置顶 0，不置顶
    isRecommend: { type: Number }, // 是否推荐 1，推荐 0，不推荐
    sort: { type: Number, default: 0 }, // 排序 越大越靠前
    status: { type: Number, default: 0 }, // 状态 （0：未发布 1：已发布）
    createdTime: { type: String }, // 创建时间
    createdBy: { type: String }, // 创建人
    updateTime: { type: String }, // 更新时间
    updateBy: { type: String }, // 更新人
    isDelete: { type: Number, default: 0 }, // 是否已删除 （1：是 0：否）
  });
  return mongoose.model('Content', contentSchema, 'content'); //返回model
};
