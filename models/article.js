/*var mongoose = require('mongoose');

var ArticleSchema = require('../schemas/article'); //引入schema模式文件 
var Article = mongoose.model('Article', ArticleSchema); //编译生成movie模型
module.exports = Article; //将构造函数导出
*/
//编译好模式schema和编译生成model之后，就可以app.js文件中进行数据库连接和增改查可

var mongoose = require('mongoose'); //增加mogoose工具模块

var ArticleSchema = new mongoose.Schema({
    title: String,
    text: String,
    _bookid:[{ type: mongoose.Schema.ObjectId, ref: 'Book' }],
    bookname:String,
    wxshared:Boolean,
    wbshared:Boolean,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

ArticleSchema.pre('save', function (next) {   //数据每次存储前运行此函数
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    this.wbshared = false;
    next(); //进行下一步存储过程
});

ArticleSchema.statics = { //只有model经过编译实例化后才会具有此方法
    fetch: function (cb) {//取出数据库所有数据
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb); //执行回调方法
    },
    findByBookId: function (bookid,cb) {//取出数据库所有数据
        return this
            .find({_bookid:bookid},{'title':1,'bookname':1,'_bookid':1,'meta':1,'wxshared':1,'wbshared':1})
            .sort('meta.updateAt')
            .exec(cb); //执行回调方法
    },
    findById: function (id, cb) { //查询单条方法
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

var Article = mongoose.model('Article', ArticleSchema); //编译生成movie模型
module.exports = Article;

