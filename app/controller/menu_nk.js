'use strict';
/**
 * 导航管理-前台相关不需要鉴权的接口
 */
const Controller = require('egg').Controller;
const { Get, Prefix } = require('egg-shell-decorators');

@Prefix('/nk/menu')
class NkMenuController extends Controller {
  /**
   * 查询所有启用状态的导航树
   */
  @Get('/v1/find_menu_tree.do')
  async findMenuTreeEnable() {
    const { ctx, service } = this;
    try {
      await service.menu.findMenuTreeEnable();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 查询所有状态的导航-非树形
   */
  @Get('/v1/find_all_menu.do')
  async findAllMenu() {
    const { ctx, service } = this;
    try {
      await service.menu.findAllMenu();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}
module.exports = NkMenuController;
