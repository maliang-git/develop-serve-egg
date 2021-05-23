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
      classifyId: { type: 'string', required: true }, // 所属分类id
      codeType: { type: 'integer', required: true }, // 内容code生成方式 （1：系统生成 2：自定义）
      contentCode: { type: 'string', required: false }, // 自定义的内容CODE
      name: { type: 'string', required: true }, // 内容标题
      subName: { type: 'string', required: true }, // 内容副标题
      abstract: { type: 'string', required: true }, // 内容摘要
      enName: { type: 'string', required: false }, // 英文名称
      seoTitle: { type: 'string', required: false }, // seo-title
      seoDescription: { type: 'string', required: false }, // seo-description
      seoKeywords: { type: 'string', required: false }, // seo-Keywords
      content: { type: 'string', required: true }, // 内容
      baseReadNum: { type: 'integer', required: true }, // 基础阅读量
      realReadNum: { type: 'integer', required: false }, // 真实阅读量
      totalReadNum: { type: 'integer', required: false }, // 总阅读量
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
  /**
   * 分页查询内容
   */
  @Get('/v1/find_content_page.do')
  async findContentPage() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      page: { type: 'string', required: true }, // 当前页
      limit: { type: 'string', required: true }, // 每页条数
      classifyId: { type: 'string', required: false }, // 分类ID
      status: { type: 'string', required: false },
      name: { type: 'string', required: false },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.content.findContentPage();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据ID查询内容详情
   */
  @Get('/v1/find_content_by_id.do')
  async findContentById() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.content.findContentById();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 编辑内容
   */
  @Post('/v1/update_content.do')
  async updateContent() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
      classifyId: { type: 'string', required: true }, // 所属分类id
      codeType: { type: 'integer', required: true }, // 内容code生成方式 （1：系统生成 2：自定义）
      contentCode: { type: 'string', required: false }, // 自定义的内容CODE
      name: { type: 'string', required: true }, // 内容标题
      subName: { type: 'string', required: true }, // 内容副标题
      abstract: { type: 'string', required: true }, // 内容摘要
      enName: { type: 'string', required: false }, // 英文名称
      seoTitle: { type: 'string', required: false }, // seo-title
      seoDescription: { type: 'string', required: false }, // seo-description
      seoKeywords: { type: 'string', required: false }, // seo-Keywords
      content: { type: 'string', required: true }, // 内容
      baseReadNum: { type: 'integer', required: true }, // 基础阅读量
      realReadNum: { type: 'integer', required: false }, // 真实阅读量
      totalReadNum: { type: 'integer', required: false }, // 总阅读量
      status: { type: 'integer', required: false }, // 是否发布 （1，发布 0，不发布）
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
      await service.content.updateContent();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 删除内容
   */
  @Post('/v1/delete_content.do')
  async deleteContent() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.content.deleteContent();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 发布、撤回内容
   */
  @Post('/v1/update_content_status.do')
  async updateContentStatus() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
      status: { type: 'integer', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.content.updateContentStatus();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = contentController;
