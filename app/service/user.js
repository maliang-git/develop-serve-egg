'use strict';
const Service = require('egg').Service;
class UserService extends Service {
  /**
   * 新增用户
   */
  async addUser() {
    const { ctx } = this;
    try {
      const isRepeat = await ctx.model.User.find({
        account: ctx.request.body.account,
      }); // 条件查询
      console.log(99, isRepeat.length > 0);
      if (isRepeat.length > 0) {
        console.log(132, isRepeat);
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '该账号已存在！',
        });
        return;
      }
      await ctx.model.User.create(ctx.request.body); // 插入一条
      ctx.helper.success({
        ctx,
        code: 200,
      });
    } catch (err) {
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 查询用户
   */
  async findUser() {
    const { ctx } = this;
    try {
      const { page, limit, name, account } = ctx.request.query;
      let index = (page - 1) * limit;
      const obj = {};
      if (name) {
        obj.name = name;
      }
      if (account) {
        obj.account = account;
      }
      let result = [],
        total = 0;
      if (obj === {}) {
        result = await ctx.model.User.find().skip(index).limit(limit); // 分页查询
        total = await ctx.model.User.count();
      } else {
        result = await ctx.model.User.find(obj).skip(index).limit(limit); // 分页条件查询
        total = await ctx.model.User.find(obj).count();
      }
      ctx.helper.success({
        ctx,
        code: 200,
        res: {
          page,
          limit,
          total: total,
          list: result,
        },
      });
    } catch (err) {
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}
module.exports = UserService;
