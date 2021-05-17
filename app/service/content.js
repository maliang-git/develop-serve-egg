'use strict';
const Service = require('egg').Service;
class contentService extends Service {
  /**
   * 新增内容
   */
  async addContent() {
    const { ctx } = this;
    try {
      ctx.request.body.createdTime = ctx.helper.dateReset(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
      ctx.request.body.updateTime = ctx.helper.dateReset(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
      await ctx.model.Content.create(ctx.request.body); // 插入一条
      ctx.helper.success({
        ctx,
        code: 200,
      });
    } catch (err) {
      console.log(23, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}
module.exports = contentService;
