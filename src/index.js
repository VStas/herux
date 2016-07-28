const {Store, STATIC, DYNAMIC} = require('./Store');

exports.Context = require('./Context').Context;
exports.Herux = require('./Herux').Herux;
exports.Store = Store;

exports.STATIC = STATIC;
exports.DYNAMIC = DYNAMIC;

exports.action = (type, data) => ({ data, type });
