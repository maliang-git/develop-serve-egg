'use strict';

const Controller = require('egg').Controller;
const { Get, Prefix, Post } = require('egg-shell-decorators');

@Prefix('/yk/classify')
class ClassifyController extends Controller {
  /**
   * 新增分类
   */
  @Post('/v1/add_classify.do')
  async addClassify() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      pid: { type: 'string', required: true },
      name: { type: 'string', required: true },
      code: { type: 'string', required: true },
      level: { type: 'integer', required: true },
      sort: { type: 'integer', required: true },
      status: { type: 'integer', required: true },
      remark: { type: 'string', required: false },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.classify.addClassify();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据ID获取子级
   */
  @Get('/v1/find_classify_by_id.do')
  async findClassifyById() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.classify.findClassifyById();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 编辑分类
   */
  @Post('/v1/update_classify.do')
  async updateClassify() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
      pid: { type: 'string', required: true },
      name: { type: 'string', required: true },
      code: { type: 'string', required: true },
      level: { type: 'integer', required: true },
      sort: { type: 'integer', required: true },
      status: { type: 'integer', required: true },
      remark: { type: 'string', required: false },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.classify.updateClassify();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 删除分类
   */
  @Post('/v1/delete_classify.do')
  async deleteClassify() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
      level: { type: 'integer', required: true },
      code: { type: 'string', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.classify.deleteClassify();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 启用禁用分类
   */
  @Post('/v1/update_classify_status.do')
  async updateClassifyStatus() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      _id: { type: 'string', required: true },
      level: { type: 'integer', required: true },
      status: { type: 'integer', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.body);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.classify.updateClassifyStatus();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
  /**
   * 根据分类名称查询分类详情
   */
  @Get('/v1/find_classify_by_name.do')
  async findClassifyByName() {
    const { ctx, service, app } = this;
    // 定义参数校验规则
    const rules = {
      name: { type: 'string', required: true },
    };
    // 参数校验
    const valiErrors = app.validator.validate(rules, ctx.request.query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      await service.classify.findClassifyByName();
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = ClassifyController;
