'use strict';
const Service = require('egg').Service;
class ClassifyService extends Service {
  /**
   * 新增分类
   */
  async addClassify() {
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
      let isRepeat;
      const { pid, code } = ctx.request.body;
      isRepeat = await ctx.model.ClassifyCode.findOne({
        code,
        isDelete: 0,
      }); // 条件查询
      if (isRepeat) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '分类code已存在',
        });
        return;
      }
      // 新增一级分类
      if (pid === '1') {
        await ctx.model.Classify.create(ctx.request.body);
        await ctx.model.ClassifyCode.create({ code });
        ctx.helper.success({
          ctx,
          code: 200,
        });
        return;
      }
      // 新增子级分类
      isRepeat = await ctx.model.Classify.findById(pid); // 条件查询
      if (!isRepeat) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '未找到该父级分类',
        });
        return;
      }
      ctx.request.body.children = [];
      isRepeat.children.push(ctx.request.body);
      const addChild = isRepeat.children;
      await ctx.model.Classify.updateOne(
        { _id: pid },
        { $addToSet: { children: addChild } }
      );
      await ctx.model.ClassifyCode.create({ code });
      ctx.helper.success({
        ctx,
        code: 200,
      });
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据ID获取子级
   */
  async findClassifyById() {
    const { ctx } = this;
    try {
      const { _id } = ctx.request.query;
      let classifyList;
      if (_id === '1') {
        classifyList = await ctx.model.Classify.find({ pid: _id });
        ctx.helper.success({
          ctx,
          code: 200,
          res: classifyList || [],
        });
        return;
      }
      classifyList = await ctx.model.Classify.findById(_id); // 条件查询
      ctx.helper.fail({
        ctx,
        code: 422,
        res: classifyList ? classifyList.children : [],
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}
module.exports = ClassifyService;
