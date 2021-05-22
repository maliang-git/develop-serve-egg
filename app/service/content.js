'use strict';
const Service = require('egg').Service;
class contentService extends Service {
  /**
   * 新增内容
   */
  async addContent() {
    const { ctx } = this;
    const { codeType, contentCode } = ctx.request.body;
    try {
      // 自定义内容CODE
      if (codeType === 0) {
        if (contentCode.indexOf('NO') === 0) {
          ctx.helper.fail({
            ctx,
            code: 422,
            res: {},
            detailMessage: '自定义内容编号请勿以NO开头',
          });
          return;
        }
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
        //  系统自增内容CODE;
        let { count } = await ctx.model.Counter.findOneAndUpdate(
          { _id: 'contentCountGenerator' }, // 这里的_id值以后用的地方都不要改的， 因为我们始终查询的是一个sequence
          { $inc: { count: 1 } }, // 这里的$inc是原子操作，所以不要担心锁竞争的情况
          {
            new: true,
            upsert: true,
          }
        );
        ctx.request.body.contentCode = `NO_CONTENT_${count}`;
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
        .populate({
          path: 'classifyId',
          select: 'name code _id path',
        })
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
      }).populate({
        path: 'classifyId',
        select: 'name code _id path',
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
      // 自定义code
      if (reqData.codeType === 0) {
        if (reqData.contentCode.indexOf('NO') === 0) {
          ctx.helper.fail({
            ctx,
            code: 422,
            res: {},
            detailMessage: '自定义内容编号请勿以NO开头',
          });
          return;
        }
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
        //  系统自增内容CODE;
        let { count } = await ctx.model.Counter.findOneAndUpdate(
          { _id: 'contentCountGenerator' }, // 这里的_id值以后用的地方都不要改的， 因为我们始终查询的是一个sequence
          { $inc: { count: 1 } }, // 这里的$inc是原子操作，所以不要担心锁竞争的情况
          {
            new: true,
            upsert: true,
          }
        );
        ctx.request.body.contentCode = `NO_CONTENT_${count}`;
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
  /**
   * 根据内容code查询内容详情
   */
  async findContentByCode() {
    const { ctx } = this;
    const { contentCode } = ctx.request.query;
    try {
      const result = await ctx.model.Content.findOne({
        contentCode,
        isDelete: 0,
        status: 1,
      });
      if (!result) {
        ctx.helper.fail({ ctx, code: 500, res: '未找到该内容' });
        return;
      }
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
