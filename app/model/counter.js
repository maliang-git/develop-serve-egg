/**
 * 自增计数
 */
'use strict';
module.exports = (app) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const counterSchema = new Schema({
    _id: { type: String, required: true },
    count: { type: Number, default: 0 },
  });
  return mongoose.model('Counter', counterSchema, 'counter'); //返回model
};
