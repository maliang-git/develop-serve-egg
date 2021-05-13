'use strict';

const Controller = require('egg').Controller;
const { Get, Prefix, Post } = require('egg-shell-decorators');

@Prefix('/yk/user')
class UserController extends Controller {
  /**
   * 新增用户
   */
  @Post('/v1/add_user.do')
  async addUser() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      role: { type: 'integer', required: true }, // 角色
      name: { type: 'string', required: true }, // 姓名
      account: { type: 'string', required: true }, // 账号
      password: { type: 'string', required: true }, // 密码
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.user.addUser();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 分页查询用户列表
   */
  @Get('/v1/find_user_page.do')
  async findUser() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      page: { type: 'string', required: true }, // 当前页
      limit: { type: 'string', required: true }, // 每页条数
      name: { type: 'string', required: false }, // 姓名
      account: { type: 'string', required: false }, // 账号
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.user.findUser();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = UserController;
