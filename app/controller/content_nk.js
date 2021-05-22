'use strict';
/**
 * 内容管理-前台相关不需要鉴权的接口
 */
const Controller = require('egg').Controller;
const { Get, Prefix } = require('egg-shell-decorators');

@Prefix('/nk/content')
class NkContentController extends Controller {
  /**
   * 根据内容code查询内容详情
   */
  @Get('/v1/find_content_by_code.do')
  async findContentByCode() {
    const { ctx, service, app } = this;
    try {
      // 定义参数校验规则
      const rules = {
        contentCode: { type: 'string', required: true },
      };
      // 参数校验
      const valiErrors = app.validator.validate(rules, ctx.request.query);
      // 参数校验未通过
      if (valiErrors) {
        ctx.helper.fail({ ctx, code: 422, res: valiErrors });
        return;
      }
      await service.content.findContentByCode();
    } catch (error) {
      console.log('controller', err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  //   /**
  //    * 查询所有状态的导航-非树形
  //    */
  //   @Get('/v1/find_all_menu.do')
  //   async findAllMenu() {
  //     const { ctx, service } = this;
  //     try {
  //       await service.menu.findAllMenu();
  //     } catch (error) {
  //       ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
  //     }
  //   }
}
module.exports = NkContentController;
