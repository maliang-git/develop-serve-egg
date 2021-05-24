'use strict';
/**
 * 分类管理-前台相关不需要鉴权的接口
 */
const Controller = require('egg').Controller;
const { Get, Prefix } = require('egg-shell-decorators');
@Prefix('/nk/category')
class NkCategoryController extends Controller {
  /**
   * 根据分类CODE查询直接子级列表-分页
   */
  @Get('/v1/find_category_by_code_page.do')
  async findCategoryByCodePage() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      classifyCode: { type: 'string', required: true }, // 分类code
      isReturnContent: { type: 'string', required: false }, // 是否返回子级关联的文章(默认不返回 1:返回 0:不返回)
      isRecommend: { type: 'string', required: false }, // 筛选推荐的分类(默认不筛选 1:赛选 0:不筛选)
      isTop: { type: 'string', required: false }, // 筛选置顶的分类(默认不筛选 1:赛选 0:不筛选)
      page: { type: 'string', required: false },
      limit: { type: 'string', required: false },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.category.findCategoryByCodePage();
    } catch (error) {
      console.log('controller', error);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = NkCategoryController;
