'use strict';
/**
 * 分类管理
 */
const Controller = require('egg').Controller;
const { Get, Prefix, Post } = require('egg-shell-decorators');
@Prefix('/yk/category')
class CategoryController extends Controller {
  /**
   * 新增导航
   */
  @Post('/v1/add_category.do')
  async addCategory() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      pid: { type: 'string', required: false },
      name: { type: 'string', required: true },
      picUrl: { type: 'string', required: false },
      code: { type: 'string', required: true },
      sort: { type: 'integer', required: true },
      status: { type: 'integer', required: true },
      remark: { type: 'string', required: false },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.category.addCategory();
    } catch (error) {
      console.log(error);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 查询分类树形(根据ID、状态查询子级，不传查所有)
   */
  @Get('/v1/find_category_tree.do')
  async findCategoryTree() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: false }, // 父级id
      status: { type: 'string', required: false }, // 状态
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.category.findCategoryTree();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 编辑分类
   */
  @Post('/v1/update_category.do')
  async updateCategory() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
      name: { type: 'string', required: true },
      picUrl: { type: 'string', required: false },
      code: { type: 'string', required: true },
      sort: { type: 'integer', required: true },
      status: { type: 'integer', required: true },
      remark: { type: 'string', required: false },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.category.updateCategory();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 删除分类
   */
  @Post('/v1/delete_category.do')
  async deleteCategory() {
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
      await service.category.deleteCategory();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 启用禁用分类
   */
  @Post('/v1/update_category_status.do')
  async updateCategoryStatus() {
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
      await service.category.updateCategoryStatus();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据分类名称查询分类
   */
  @Get('/v1/find_category_by_name.do')
  async findCategoryByName() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      name: { type: 'string', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.category.findCategoryByName();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = CategoryController;
