'use strict';
const Service = require('egg').Service;
const TOP_LEVEL_RETAIN = 'TOP_LEVEL_RETAIN'; // 自定义顶级分类CODE
class ClassifyService extends Service {
  /**
   * 新增分类
   */
  async addCategory() {
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
      const { pid, code } = ctx.request.body;
      let isRepeat = await ctx.model.Category.findOne({
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
      if (!pid) {
        let topLevel = null;
        // 判断是否存在顶级分类
        topLevel = await ctx.model.Category.findOne({
          code: TOP_LEVEL_RETAIN,
        });
        if (!topLevel) {
          // 创建默认顶级分类
          topLevel = await ctx.model.Category.create({
            name: '顶级分类', // 分类名称
            code: TOP_LEVEL_RETAIN, // 分类编码
            sort: 1, // 排序 （越小越靠前）
            status: 1, // 状态 （1，启用 0，禁用）
            remark: '顶级分类', // 备注描述
            createdTime: ctx.helper.dateReset(
              new Date(),
              'yyyy-MM-dd hh:mm:ss'
            ),
            updateTime: ctx.helper.dateReset(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          });
        }
        const newChild = Object.assign(ctx.request.body, {
          parent: topLevel,
        });
        // 在顶级分类下创建一级分类
        await ctx.model.Category.create(newChild);
        ctx.helper.success({
          ctx,
          code: 200,
        });
        return;
      }
      // 新增子级分类
      let parentClass = await ctx.model.Category.findById(pid); // 条件查询
      if (!parentClass) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '未找到该父级分类',
        });
        return;
      }
      const newChild = Object.assign(ctx.request.body, {
        parent: parentClass,
      });
      await ctx.model.Category.create(newChild);
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
   * 查询分类树形(根据ID、状态查询子级，不传查所有)
   */
  async findCategoryTree() {
    const { ctx } = this;
    try {
      const { _id, status } = ctx.request.query;
      let parentNode = null;
      if (_id) {
        parentNode = await ctx.model.Category.findOne({
          _id,
          isDelete: 0,
        });
      } else {
        parentNode = await ctx.model.Category.findOne({
          code: TOP_LEVEL_RETAIN,
          isDelete: 0,
        });
      }
      const filters =
        status == 0 || status == 1 ? { isDelete: 0, status } : { isDelete: 0 };
      const treeNode = await parentNode.getChildrenTree({
        filters, //  过滤
        // fields: '_id name', // 字段选择
        options: { sort: { sort: -1 } }, //  排序
        // populate: 'repos',
        // minLevel: 2,
        // maxLevel: 4,
      });
      ctx.helper.success({
        ctx,
        code: 200,
        res: treeNode,
      });
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 编辑分类
   */
  async updateCategory() {
    const { ctx } = this;
    let params = ctx.request.body;
    try {
      let isRepeat = await ctx.model.Category.findOne({
        code: params.code,
        isDelete: 0,
        _id: { $ne: params._id }, // 不等于
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
      let categoryData = await ctx.model.Category.findOneAndUpdate(
        {
          _id: params._id,
        },
        {
          $set: {
            name: params.name,
            code: params.code,
            picUrl: params.picUrl,
            sort: params.sort,
            status: params.status,
            remark: params.remark,
            updateTime: ctx.helper.dateReset(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          },
        },
        { new: true }
      );
      ctx.helper.success({
        ctx,
        code: 200,
        res: categoryData,
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
  async deleteCategory() {
    const { ctx } = this;
    let { _id } = ctx.request.body;
    try {
      // 删除前验证是否存在子级分类
      let parentNode = await ctx.model.Category.findById(_id);
      const children = await parentNode.getAllChildren({
        isDelete: 0,
      });
      if (children.length) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '该分类下存在子级，请先删除子级',
        });
        return;
      }
      let categoryData = await ctx.model.Category.findByIdAndUpdate(
        _id,
        {
          $set: {
            isDelete: 1,
            updateTime: ctx.helper.dateReset(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          },
        },
        { new: true }
      );
      ctx.helper.success({
        ctx,
        code: 200,
        res: categoryData,
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
  async updateCategoryStatus() {
    const { ctx } = this;
    let { _id, status } = ctx.request.body;
    try {
      let parentNode = await ctx.model.Category.findById(_id);
      // 禁用判断子级是否都已禁用，判断是都关联已发布的文章
      if (status === 0) {
        // 获取所有子级
        const children = await parentNode.getAllChildren({
          isDelete: 0,
          status: 1, //  过滤
        });
        if (children.length) {
          ctx.helper.fail({
            ctx,
            code: 422,
            res: {},
            detailMessage: '该分类存在启用的子级分类，请先处理',
          });
          return;
        }
        const menuList = await ctx.model.Content.find({
          classifyId: _id,
          status: 1,
          isDelete: 0,
        });
        if (menuList.length) {
          ctx.helper.fail({
            ctx,
            code: 422,
            res: {},
            detailMessage: '该分类下有已发布的内容，请先撤回',
          });
          return;
        }
      }
      // 启用判断祖先级是否禁用
      if (status === 1) {
        const children = await parentNode.getAncestors({
          isDelete: 0,
          status: 0, //  过滤
        });
        if (children.length) {
          ctx.helper.fail({
            ctx,
            code: 422,
            res: {},
            detailMessage: '请先启用它的父级',
          });
          return;
        }
      }
      let classifyList = await ctx.model.Category.findByIdAndUpdate(
        _id,
        {
          $set: {
            status,
            updateTime: ctx.helper.dateReset(new Date(), 'yyyy-MM-dd hh:mm:ss'),
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
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据分类名称查询分类
   */
  async findCategoryByName() {
    const { ctx } = this;
    let { name } = ctx.request.query;
    try {
      let categoryList = await ctx.model.Category.find({
        name: { $regex: name }, // 模糊匹配
        isDelete: 0,
      });
      ctx.helper.success({
        ctx,
        code: 200,
        res: categoryList,
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
