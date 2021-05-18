'use strict';

const Controller = require('egg').Controller;
const { Get, Prefix, Post } = require('egg-shell-decorators');
const sd = require('silly-datetime');
const path = require('path');
const fs = require('fs');
const pump = require('pump');
const mkdirp = require('mkdirp');
@Prefix('/yk/basic')
class basicController extends Controller {
  /**
   * 图片上传
   */
  @Post('/v1/upload_img.do')
  async uploadImg() {
    const { ctx } = this;
    const parts = ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    let getUploadFile = async (filename) => {
      let uploadDirPath = 'app/public/avatar/upload';
      // 1.获取当前日期
      let day = sd.format(new Date(), 'YYYYMMDD');
      // 2.创建图片保存的路径
      let dir = path.join(uploadDirPath, day);
      await mkdirp(dir); // 不存在就创建目录
      let date = Date.now(); // 毫秒数
      // 返回图片保存的路径
      let uploadDir = path.join(dir, date + path.extname(filename));
      // app\public\avatar\upload\20200312\1536895331666.png
      return {
        uploadDir,
        saveDir: this.ctx.origin + uploadDir.slice(3).replace(/\\/g, '/'),
      };
    };
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname; // file表单的名字
      // 上传图片的目录
      const dir = await getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    if (Object.keys(files).length > 0) {
      ctx.body = {
        code: 200,
        message: '图片上传成功',
        data: files,
      };
    } else {
      ctx.body = {
        code: 500,
        message: '图片上传失败',
        data: {},
      };
    }
  }
}

module.exports = basicController;
