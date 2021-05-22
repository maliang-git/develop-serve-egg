'use strict';
const Service = require('egg').Service;
class contentService extends Service {
  /**
   * 新增内容
   */
  async addContent() {
    const { ctx } = this;
    const { contentCode } = ctx.request.body;
    try {
      if (contentCode) {
        let isRepeat = await ctx.model.Content.findOne({
          contentCode,
          isDelete: 0,
        }); // 条件查询
        if (isRepeat) {
          ctx.helper.fail({
            ctx,
            code: 422,
            res: {},
            detailMessage: '内容编号已存在',
          });
          return;
        }
      } else {
        // 查询当前系统生成的最大编号
        let isHaveData = await ctx.model.Content.find({
          isDelete: 0,
          contentCode: { $regex: 'CONTENT_' }, // 模糊匹配
        })
          .sort({ contentCode: -1 })
          .skip(0)
          .limit(1);
        // 没有则初始生成
        if (!isHaveData.length) {
          ctx.request.body.contentCode = 'CONTENT_00001';
        } else {
          // 有则+1
          const codeArr = isHaveData[0].contentCode.split('_');
          ctx.request.body.contentCode = codeArr[0] + (codeArr[1] + 1);
        }
      }
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
  /**
   * 分页查询内容
   */
  async findContentPage() {
    const { ctx } = this;
    const { page, limit, classifyCode, status, name } = ctx.request.query;
    try {
      const index = (page - 1) * limit;
      let term = {
        isDelete: { $ne: 1 },
      };
      if (classifyCode) {
        term.classifyCode = { $eq: classifyCode };
      }
      if (status) {
        term.status = { $eq: status };
      }
      if (name) {
        term.name = { $regex: name };
      }
      // 分页、条件查询
      const result = await ctx.model.Content.find(term)
        .skip(index)
        .limit(Number(limit));
      // 根据条件查询总数
      const total = await ctx.model.Content.find(term).countDocuments();
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
      console.log(123, err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据ID查询内容详情
   */
  async findContentById() {
    const { ctx } = this;
    const { _id } = ctx.request.query;
    try {
      const result = await ctx.model.Content.findOne({
        _id,
        isDelete: 0,
      });
      if (result) {
        ctx.helper.success({
          ctx,
          code: 200,
          res: result,
        });
        return;
      }
      ctx.helper.fail({ ctx, code: 500, res: '未找到该内容' });
    } catch (err) {
      // ctx.logger.error(err);
      console.log(123, err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 编辑内容
   */
  async updateContent() {
    const { ctx } = this;
    const reqData = ctx.request.body;
    try {
      if (reqData.contentCode) {
        let isRepeat = await ctx.model.Content.findOne({
          contentCode: reqData.contentCode,
          isDelete: 0,
          _id: { $ne: reqData._id },
        }); // 条件查询
        if (isRepeat) {
          ctx.helper.fail({
            ctx,
            code: 422,
            res: {},
            detailMessage: '内容编号已存在',
          });
          return;
        }
      } else {
        // 查询当前系统生成的最大编号
        let isHaveData = await ctx.model.Content.find({
          isDelete: 0,
          contentCode: { $regex: 'CONTENT_' }, // 模糊匹配
        })
          .sort({ contentCode: -1 })
          .skip(0)
          .limit(1);
        // 没有则初始生成
        if (!isHaveData.length) {
          ctx.request.body.contentCode = 'CONTENT_00001';
        } else {
          // 有则+1
          const codeArr = isHaveData[0].contentCode.split('_');
          ctx.request.body.contentCode = codeArr[0] + (codeArr[1] + 1);
        }
      }
      const result = await ctx.model.Content.findById(reqData._id);
      if (!result) {
        ctx.helper.fail({ ctx, code: 500, res: '未找到该内容' });
        return;
      }
      const updateTime = ctx.helper.dateReset(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
      await ctx.model.Content.findByIdAndUpdate(reqData._id, {
        $set: {
          classifyCode: reqData.classifyCode,
          classifyName: reqData.classifyName,
          classifyId: reqData.classifyId,
          codeType: reqData.codeType,
          contentCode: reqData.contentCode,
          name: reqData.name,
          subName: reqData.subName,
          abstract: reqData.abstract,
          enName: reqData.enName,
          seoTitle: reqData.seoTitle,
          seoDescription: reqData.seoDescription,
          seoKeywords: reqData.seoKeywords,
          content: reqData.content,
          baseReadNum: reqData.baseReadNum,
          totalReadNum: result.realReadNum + reqData.baseReadNum,
          isTop: reqData.isTop,
          isRecommend: reqData.isRecommend,
          sort: reqData.sort,
          updateTime,
        },
      });
      ctx.helper.success({
        ctx,
        code: 200,
        res: result,
      });
    } catch (err) {
      // ctx.logger.error(err);
      console.log(123, err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 删除内容
   */
  async deleteContent() {
    const { ctx } = this;
    const { _id } = ctx.request.body;
    try {
      const result = await ctx.model.Content.findById(_id);
      if (!result) {
        ctx.helper.fail({ ctx, code: 500, res: '未找到该内容' });
        return;
      }
      await ctx.model.Content.findByIdAndUpdate(_id, {
        $set: {
          isDelete: 1,
        },
      });
      ctx.helper.success({
        ctx,
        code: 200,
        res: result,
      });
    } catch (err) {
      // ctx.logger.error(err);
      console.log(123, err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 发布、撤回内容
   */
  async updateContentStatus() {
    const { ctx } = this;
    const { _id, status } = ctx.request.body;
    try {
      const result = await ctx.model.Content.findById(_id);
      if (!result) {
        ctx.helper.fail({ ctx, code: 500, res: '未找到该内容' });
        return;
      }
      await ctx.model.Content.findByIdAndUpdate(_id, {
        $set: {
          status,
        },
      });
      ctx.helper.success({
        ctx,
        code: 200,
        res: result,
      });
    } catch (err) {
      // ctx.logger.error(err);
      console.log(123, err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}
module.exports = contentService;
