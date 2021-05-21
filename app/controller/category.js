'use strict';
/**
 * 导航管理
 */
const Controller = require('egg').Controller;
const { Get, Prefix, Post } = require('egg-shell-decorators');
const MpathPlugin = require('mongoose-mpath');
@Prefix('/yk/category')
class CategoryController extends Controller {
  /**
   * 新增导航
   */
  @Post('/v1/add_category.do')
  async addCategory() {
    const { ctx, service, app } = this;
    try {
      const Mongoose = app.mongoose;
      // const Schema = Mongoose.Schema;

      const LocationSchema = new Mongoose.Schema({ name: String });
      LocationSchema.plugin(MpathPlugin);

      const LocationModel = Mongoose.model('Location', LocationSchema);

      const europe = new LocationModel({ name: 'europe' });
      const sweden = new LocationModel({ name: 'sweden', parent: europe });
      const stockholm = new LocationModel({
        name: 'stockholm',
        parent: sweden,
      });

      await europe.save();
      await sweden.save();
      await stockholm.save();
      const children = await europe.getAllChildren({});
      ctx.helper.success({
        ctx,
        code: 200,
        res: children,
      });
    } catch (error) {
      ctx.helper.fail({ ctx, code: 500, res: '后端接口异常！' });
    }
  }
}

module.exports = CategoryController;
