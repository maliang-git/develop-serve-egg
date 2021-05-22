'use strict';
const Service = require('egg').Service;
class MenuService extends Service {
  /**
   * 新增菜单
   */
  async addMenu() {
    const { ctx } = this;
    let params = ctx.request.body;
    try {
      let isRepeat = await ctx.model.Menu.findOne({
        enName: params.enName,
        isDelete: 0,
      }); // 条件查询
      if (isRepeat) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '英文名称已存在',
        });
        return;
      }
      params.createdTime = ctx.helper.dateReset(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
      params.updateTime = ctx.helper.dateReset(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );
      // 新增一级导航
      if (params.pid === '-1') {
        params.fullName = params.name;
        await ctx.model.Menu.create(params);
        ctx.helper.success({
          ctx,
          code: 200,
        });
        return;
      }
      // 新增子导航
      const findParent = await ctx.model.Menu.findOne({
        _id: params.pid,
        isDelete: 0,
      }); // 查询父级
      if (!findParent) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '未查询到对应的查询父级',
        });
        return;
      }
      params.fullName = findParent.fullName + '/' + params.name;
      await ctx.model.Menu.create(params);
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
   * 查询所有嵌套导航
   */
  async findMenu() {
    const { ctx } = this;
    try {
      let menuList = await ctx.model.Menu.find({
        isDelete: 0,
      }).sort({ sort: -1 });
      let menuTree = [];
      let nweTree = [];
      if (menuList.length > 0) {
        menuTree = menuList.filter((item) => item.pid === '-1');
        nweTree = JSON.parse(JSON.stringify(menuTree));
        if (menuTree.length) {
          menuTree.forEach((item, index) => {
            const children = menuList.filter(
              (key) => key.pid === String(item._id)
            );
            nweTree[index]['children'] = JSON.parse(JSON.stringify(children));
          });
        }
      }

      ctx.helper.success({
        ctx,
        code: 200,
        res: nweTree || [],
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 启用禁用导航
   */
  async updateMenuStatus() {
    const { ctx } = this;
    const parmasData = ctx.request.body;
    try {
      let menuData = await ctx.model.Menu.findOneAndUpdate(
        {
          _id: parmasData._id,
        },
        {
          $set: {
            status: parmasData.status,
            updateTime: ctx.helper.dateReset(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          },
        },
        { new: true }
      );
      ctx.helper.success({
        ctx,
        code: 200,
        res: menuData,
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 编辑导航
   */
  async updateMenu() {
    const { ctx } = this;
    let params = ctx.request.body;
    try {
      let isRepeat = await ctx.model.Menu.findOne({
        enName: params.enName,
        isDelete: 0,
        _id: { $ne: params._id },
      }); // 条件查询
      if (isRepeat) {
        ctx.helper.fail({
          ctx,
          code: 422,
          res: {},
          detailMessage: '英文名称已存在',
        });
        return;
      }
      let menuData = await ctx.model.Menu.findOneAndUpdate(
        {
          _id: params._id,
        },
        {
          $set: {
            pid: params.pid,
            name: params.name,
            enName: params.enName,
            jumpType: params.jumpType,
            routePath: params.routePath,
            routeParmas: params.routeParmas,
            url: params.url,
            pagePath: params.pagePath,
            customPath: params.customPath,
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
        res: menuData,
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 删除导航
   */
  async deleteMenu() {
    const { ctx } = this;
    let { _id } = ctx.request.body;
    try {
      let isRepeat = await ctx.model.Menu.findOneAndUpdate(
        {
          isDelete: 0,
          _id,
        },
        {
          $set: {
            isDelete: 1,
            updateTime: ctx.helper.dateReset(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          },
        },
        { new: true }
      );
      if (isRepeat) {
        ctx.helper.success({
          ctx,
          code: 200,
          res: {},
        });
        return;
      }
      ctx.helper.fail({
        ctx,
        code: 422,
        res: {},
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据导航名称查询导航
   */
  async findMenuByName() {
    const { ctx } = this;
    const { name } = ctx.request.query;
    try {
      let menuData = await ctx.model.Menu.find({
        isDelete: { $ne: 1 }, // $ne 不等于
        name: { $regex: name },
      }).sort({ sort: -1 });
      ctx.helper.success({
        ctx,
        code: 200,
        res: menuData,
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 查询所有启用状态的导航树
   */
  async findMenuTreeEnable() {
    const { ctx } = this;
    try {
      let menuList = await ctx.model.Menu.find({
        isDelete: 0,
        status: 1,
      }).sort({ sort: -1 });
      let menuTree = [];
      let nweTree = [];
      if (menuList.length > 0) {
        menuTree = menuList.filter((item) => item.pid === '-1');
        nweTree = JSON.parse(JSON.stringify(menuTree));
        if (menuTree.length) {
          menuTree.forEach((item, index) => {
            const children = menuList.filter(
              (key) => key.pid === String(item._id)
            );
            nweTree[index]['children'] = JSON.parse(JSON.stringify(children));
          });
        }
      }

      ctx.helper.success({
        ctx,
        code: 200,
        res: nweTree || [],
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 查询所有状态的导航-非树形
   */
  async findAllMenu() {
    const { ctx } = this;
    try {
      let menuList = await ctx.model.Menu.find({
        isDelete: 0,
      }).sort({ sort: -1 });
      ctx.helper.success({
        ctx,
        code: 200,
        res: menuList || [],
      });
      return;
    } catch (err) {
      console.log(132, err);
      // ctx.logger.error(err);
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}
module.exports = MenuService;
