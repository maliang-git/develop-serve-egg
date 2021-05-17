'use strict';

const Controller = require('egg').Controller;
const { Get, Prefix, Post } = require('egg-shell-decorators');

@Prefix('/yk/content')
class contentController extends Controller {
  /**
   * 新增内容
   */
  @Post('/v1/add_content.do')
  async addContent() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      classifyName: { type: 'string', required: true }, // 所属分类名称
      classifyCode: { type: 'string', required: true }, // 所属分类CODE
      classifyId: { type: 'string', required: true }, // 所属分类id
      name: { type: 'string', required: true }, // 内容标题
      subName: { type: 'string', required: true }, // 内容副标题
      abstract: { type: 'string', required: true }, // 内容摘要
      enName: { type: 'string', required: false }, // 英文名称
      seoTitle: { type: 'string', required: false }, // seo-title
      seoDescription: { type: 'string', required: false }, // seo-description
      seoKeywords: { type: 'string', required: false }, // seo-Keywords
      content: { type: 'string', required: true }, // 内容
      baseReadNum: { type: 'integer', required: true }, // 基础阅读量
      realReadNum: { type: 'integer', required: true }, // 真实阅读量
      totalReadNum: { type: 'integer', required: true }, // 总阅读量
      isTop: { type: 'integer', required: true }, // 是否置顶 （1，置顶 0，不置顶）
      isRecommend: { type: 'integer', required: true }, // 是否推荐 （1，推荐 0，不推荐）
      sort: { type: 'integer', required: true }, // 排序 越大越靠前
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.content.addContent();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = contentController;
