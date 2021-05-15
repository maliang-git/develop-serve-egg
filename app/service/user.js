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
      if (isRepeat.length > 0) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '该账号已存在！',
        });
        return;
      }
      ctx.request.body.createdTime = ctx.helper.dateReset(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
      ctx.request.body.updateTime = ctx.helper.dateReset(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
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
      const index = (page - 1) * limit;
      // 分页、条件查询
      const result = await ctx.model.User.find(
        {
          isDelete: { $ne: 1 }, // $ne 不等于
          name: { $regex: name },
          account: { $regex: account },
        },
        {
          password: 0, // 不返回密码
        }
      )
        .skip(index)
        .limit(Number(limit));
      // 根据条件查询总数
      const total = await ctx.model.User.find({
        isDelete: { $ne: 1 },
        name: { $regex: name },
        account: { $regex: account },
      }).countDocuments();
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
  /**
   * 修改用户
   */
  async updateUser() {
    const { ctx } = this;
    const { _id, role, name, password } = ctx.request.body;
    try {
      const isRepeat = await ctx.model.User.findByIdAndUpdate(
        _id,
        {
          role,
          name,
          password,
          updateTime: ctx.helper.dateReset(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        },
        { new: true }
      );
      if (isRepeat) {
        ctx.helper.success({
          ctx,
          code: 200,
        });
        return;
      } else {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '该账号不存在！',
        });
        return;
      }
    } catch (err) {
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 删除用户
   */
  async deleteUser() {
    const { ctx } = this;
    const { _id } = ctx.request.body;
    try {
      const isRepeat = await ctx.model.User.findByIdAndUpdate(
        _id,
        {
          isDelete: 1,
        },
        { new: true }
      );
      if (isRepeat) {
        ctx.helper.success({
          ctx,
          code: 200,
        });
        return;
      } else {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '该账号不存在！',
        });
        return;
      }
    } catch (err) {
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}
module.exports = UserService;
