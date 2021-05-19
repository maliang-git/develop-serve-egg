'use strict';
/**
 * 导航管理
 */
const Controller = require('egg').Controller;
const { Get, Prefix, Post } = require('egg-shell-decorators');

@Prefix('/yk/menu')
class MenuController extends Controller {
  /**
   * 新增导航
   */
  @Post('/v1/add_menu.do')
  async addMenu() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      pid: { type: 'string', require: true }, // 父级id
      name: { type: 'string', require: true }, // 导航名称
      enName: { type: 'string', require: true }, // 英文名称
      jumpType: { type: 'integer', require: true }, // 导航跳转类型 1：内链  2：外链
      customPath: { type: 'string' }, // 自定义组件路径
      sort: { type: 'integer' }, // 排序 （越大越靠前）
      status: { type: 'integer' }, // 状态 （1，启用 0，禁用）
      remark: { type: 'string' }, // 备注描述
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.menu.addMenu();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 查询所有嵌套导航
   */
  @Get('/v1/find_menu.do')
  async findMenu() {
    const { ctx, service, app } = this;
    try {
      await service.menu.findMenu();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = MenuController;
