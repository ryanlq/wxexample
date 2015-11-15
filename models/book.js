var mongoose = require('mongoose'); //增加mogoose工具模块

var BookSchema = new mongoose.Schema({
    name: String,
    createAt: {
        type: Date,
        default: Date.now()
    }
});

BookSchema.pre('save', function (next) {   //数据每次存储前运行此函数
    this.createAt = Date.now();
    next(); //进行下一步存储过程
});

BookSchema.statics = { //只有model经过编译实例化后才会具有此方法
    fetch: function (cb) {//取出数据库所有数据
        return this
            .find({})
            .exec(cb); //执行回调方法
    }
};
var Book = mongoose.model('Book', BookSchema); //编译生成movie模型
module.exports = Book;

//编译好模式schema和编译生成model之后，就可以app.js文件中进行数据库连接和增改查可