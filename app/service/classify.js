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
      const addChild = ctx.request.body;
      await ctx.model.Classify.updateOne(
        { _id: pid },
        {
          $push: {
            children: addChild,
          },
        }
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
        classifyList = await ctx.model.Classify.find({
          pid: _id,
        });
        ctx.helper.success({
          ctx,
          code: 200,
          res: classifyList || [],
        });
        return;
      }
      classifyList = await ctx.model.Classify.find({
        isDelete: 0,
        'children._id': _id,
      }); // 条件查询
      ctx.helper.success({
        ctx,
        code: 200,
        res: classifyList.children || [],
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 编辑分类
   */
  async updateClassify() {
    const { ctx } = this;
    try {
      const parmasData = ctx.request.body;
      await ctx.model.ClassifyCode.findOneAndUpdate(
        {
          code: parmasData.code,
          isDelete: 0,
        },
        {
          $set: {
            code: parmasData.code,
          },
        }
      );
      let classifyList;
      if (parmasData.level == 1) {
        classifyList = await ctx.model.Classify.findOneAndUpdate(
          {
            _id: parmasData._id,
          },
          {
            $set: {
              name: parmasData.name,
              code: parmasData.code,
              sort: parmasData.sort,
              status: parmasData.status,
              remark: parmasData.remark,
              updateTime: ctx.helper.dateReset(
                new Date(),
                'yyyy-MM-dd hh:mm:ss'
              ),
            },
          },
          { new: true }
        );
        ctx.helper.success({
          ctx,
          code: 200,
          res: classifyList,
        });
        return;
      }
      classifyList = await ctx.model.Classify.findOneAndUpdate(
        {
          'children._id': parmasData._id,
        },
        {
          $set: {
            'children.$.name': parmasData.name,
            'children.$.code': parmasData.code,
            'children.$.sort': parmasData.sort,
            'children.$.status': parmasData.status,
            'children.$.remark': parmasData.remark,
            'children.$.updateTime': ctx.helper.dateReset(
              new Date(),
              'yyyy-MM-dd hh:mm:ss'
            ),
          },
        },
        { new: true }
      );
      const data = classifyList.children.find(
        (item) => item._id == parmasData._id
      );
      ctx.helper.success({
        ctx,
        code: 200,
        res: data,
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 删除分类
   */
  async deleteClassify() {
    const { ctx } = this;
    const parmasData = ctx.request.body;
    try {
      console.log(8, parmasData);
      await ctx.model.ClassifyCode.findOneAndDelete({
        code: parmasData.code,
        isDelete: 0,
      });
      if (parmasData.level === 1) {
        await ctx.model.Classify.findOneAndDelete({
          _id: parmasData._id,
        });
        ctx.helper.success({
          ctx,
          code: 200,
        });
        return;
      }
      await ctx.model.Classify.updateOne(
        {
          'children._id': parmasData._id,
        },
        {
          $pull: {
            children: { _id: parmasData._id },
          },
        }
      );
      ctx.helper.success({
        ctx,
        code: 200,
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 启用禁用分类
   */
  async updateClassifyStatus() {
    const { ctx } = this;
    const parmasData = ctx.request.body;
    try {
      let classifyList;
      if (parmasData.level == 1) {
        classifyList = await ctx.model.Classify.findOneAndUpdate(
          {
            _id: parmasData._id,
          },
          {
            $set: {
              status: parmasData.status,
              updateTime: ctx.helper.dateReset(
                new Date(),
                'yyyy-MM-dd hh:mm:ss'
              ),
            },
          },
          { new: true }
        );
        ctx.helper.success({
          ctx,
          code: 200,
          res: classifyList,
        });
        return;
      }
      classifyList = await ctx.model.Classify.findOneAndUpdate(
        {
          'children._id': parmasData._id,
        },
        {
          $set: {
            'children.$.status': parmasData.status,
            'children.$.updateTime': ctx.helper.dateReset(
              new Date(),
              'yyyy-MM-dd hh:mm:ss'
            ),
          },
        },
        { new: true }
      );
      const data = classifyList.children.find(
        (item) => item._id == parmasData._id
      );
      ctx.helper.success({
        ctx,
        code: 200,
        res: data,
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据分类名称查询分类
   */
  async findClassifyByName() {
    const { ctx } = this;
    const { name } = ctx.request.query;
    try {
      let listOne = await ctx.model.Classify.find(
        {
          name,
        },
        { children: 0 }
      );
      let listTwo = await ctx.model.Classify.find({
        'children.name': name,
      });
      let classifyList = [];
      listTwo.forEach((item) => {
        console.log(item);
        let data = item.children.filter((item) => item.name === name);

        classifyList = classifyList.concat(data);
      });
      classifyList = classifyList.concat(listOne);
      ctx.helper.success({
        ctx,
        code: 200,
        res: classifyList,
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
