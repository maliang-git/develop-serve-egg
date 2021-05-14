module.exports = {
  // 网络请求状态码
  errorCode: {
    200: '请求成功。',
    201: '资源创建成功。客户端向服务器提供数据，服务器创建资源',
    202: '请求被接收。但处理尚未完成',
    204: '客户端告知服务器删除一个资源，服务器移除它',
    206: '请求成功。但是只有部分回应',
    400: '请求无效。数据不正确，请重试',
    401: '请求没有权限。缺少API token，无效或者超时',
    403: '用户得到授权，但是访问是被禁止的',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
    406: '请求失败。请求头部不一致，请重试',
    410: '请求的资源被永久删除，且不会再得到的',
    422: '请求失败。请验证参数',
    500: '服务器发生错误，请检查服务器',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
  },
  // 请求成功时的响应格式
  success({ ctx, code = 200, res = null }) {
    ctx.status = 200;
    ctx.body = {
      code,
      message: ctx.helper.errorCode[code],
      data: res,
    };
  },
  // 请求失败时的响应格式
  fail({ ctx, code = 500, res = null, detailMessage = '' }) {
    ctx.status = 200;
    ctx.body = {
      code,
      message: detailMessage || ctx.helper.errorCode[code],
      data: {
        error: res,
      },
    };
  },
  /**
   * 将Egg的curl错误提示转换为项目统一的标准错误对象。
   * @param {Object} err  错误对象。
   * @return {Object}  错误信息对象。例如:{code: '404',message: '域名不存在',data: '域名不存在',}。
   */
  errMessage(err) {
    switch (err.code) {
      case 'ECONNRESET':
        return {
          code: '501',
          message: '服务端主动断开 socket 连接，导致 HTTP 请求链路异常',
          data: '服务端主动断开 socket 连接，导致 HTTP 请求链路异常',
        };
      case 'ECONNREFUSED':
        return {
          code: '406',
          message:
            '请求的 url 所属 IP 或者端口无法连接成功,请确保IP或者端口设置正确',
          data: '请求的 url 所属 IP 或者端口无法连接成功,请确保IP或者端口设置正确',
        };
      case 'ENOTFOUND':
        return {
          code: '404',
          message: `${err.path}域名不存在`,
          data: `${err.path}域名不存在`,
        };
      default:
        return {
          code: '404',
          message: `${err.path}域名不存在`,
          data: `${err.path}域名不存在`,
        };
    }
  },
  /**
   * 日期格式转换函数
   * @param  {String|Date} dateStr 日期时间对象或字符串
   * @param  {String} [format] 输出格式，yyyy-MM-dd hh:mm:ss
   * @param  {Object} [options] 时间偏移对象，可选 {y,M,d,h,m,s}
   * @param {Number} options.y 年偏移量，+增加， -减少
   * @param {Number} options.M 月偏移量，+增加， -减少
   * @param {Number} options.d 日偏移量，+增加， -减少
   * @param {Number} options.h 时偏移量，+增加， -减少
   * @param {Number} options.m 分偏移量，+增加， -减少
   * @param {Number} options.s 秒偏移量，+增加， -减少
   * @returns {String|Date} 如不传递format，即返回Date类型
   *
   * @example
   * // 当前时间减少一天, 并转换格式
   *  date(new Date(), 'yyyy-MM-dd', {d: -1})
   */
  dateReset(dateStr, format, options, restTime) {
    if (!dateStr) {
      return new Date();
    }
    let obj =
      typeof dateStr === 'string'
        ? new Date(dateStr.replace(/-/g, '/'))
        : dateStr;
    const setting = {
      y: 0, // 年
      M: 0, // 月
      d: 0, // 日
      h: 0, // 时
      m: 0, // 分
      s: 0, // 秒
    };
    Object.assign(setting, options || {});

    obj = new Date(
      setting.y + obj.getFullYear(),
      setting.M + obj.getMonth(),
      setting.d + obj.getDate(),
      setting.h + obj.getHours(),
      setting.m + obj.getMinutes(),
      setting.s + obj.getSeconds()
    );

    let o = {};

    if (restTime) {
      o = {
        'M+': obj.getMonth() + 1,
        'd+': obj.getDate(),
        'h+': 0,
        'm+': 0,
        's+': 0,
        'q+': Math.floor((obj.getMonth() + 3) / 3),
        S: obj.getMilliseconds(),
      };
    } else {
      o = {
        'M+': obj.getMonth() + 1,
        'd+': obj.getDate(),
        'h+': obj.getHours(),
        'm+': obj.getMinutes(),
        's+': obj.getSeconds(),
        'q+': Math.floor((obj.getMonth() + 3) / 3),
        S: obj.getMilliseconds(),
      };
    }
    if (format) {
      if (/(y+)/.test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 4
            ? obj.getFullYear()
            : (obj.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          );
        }
      }
      return format;
    } else {
      return obj;
    }
  },
};
