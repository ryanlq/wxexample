var express = require('express');
var jade = require('jade');
var mongoose = require('mongoose');//引入moogoose工具模块
var _ = require('underscore'); //提供set的交、并、差、补，提供简单的模版算法，提供各种排序。
var Article = require('./models/article');//加载编译好的模型
var Book = require('./models/book');//加载编译好的模型
// 静态资源请求路径
var path = require('path');
var bodyParser= require('body-parser');

var app = express();
var port = process.env.PORT || 3000;
app.locals.moment = require('moment');//引入moment模块到本地moment

// movie为mongodb的一个数据库
mongoose.connect('mongodb://localhost/website')//连接本地数据库

app.set('views', './views/pages');
app.set('view engine', 'jade');

// 静态资源请求路径
app.use(express.static(path.join(__dirname, 'public/')));

// 表单数据格式化
app.use(bodyParser());

// 用户界面
app.get('/', function (req, res) {
 //   res.render('index', {title:'后台管理'});
//    var cBook = req.params.book;
    Book.fetch(function (err, books) {
        if (err) {
            console.log(err);
        }
        res.render('index', {books:books});
    })

});
app.post('/article/get', function (req, res) {
    var id = req.body.id;

    Article.findById(id, function (err, article) {
        console.log(article);
        res.send(JSON.stringify({article:article}));
    })
});

app.post('/article/list/get', function (req, res) {
    bookid = String(req.body.bookid);
    console.log(bookid);
    Article.findByBookId(bookid,function (err, articles) {
       if (err) {
            console.log(err);
        }
        json = {json:articles}; 
        res.send(JSON.stringify(json));
    });
});

//admin manager page actions
app.get('/admin', function (req, res) {
    //book list geted by ajax request (/admin/book/get),not here!
    Book.fetch(function (err, books) {
        if (err) {
            console.log(err);
        }

        res.render('admin', {books:books});
    });
});

//add book catogery
app.post('/admin/book/add', function (req, res) {
    //var bkname = req.body.name;
    var instance = new Book();
    instance.name = req.body.name; 
    instance.save(function (err) { console.log("err::::"+err); }); 
});

//get book list
app.post('/admin/book/get', function (req, res) {
    var data ;
    Book.fetch(function (err, books) {
        if (err) {
            console.log(err);
        }
        res.send(JSON.stringify(books));
    });
});
//
app.get('/admin/edit', function (req, res) {
    var id = req.query.id;
    if (id)
    {
  /*      console.log("a:"+id);
        Article.findById(id,function (err, article) {
            if (err) 
                console.log(err);
            var json = article;
            console.log(json);
            res.render('edit',{id:id} );
        });
*/
        res.render('edit',{id:id} );
    }
    else
    {
        console.log("b:"+id);
        res.render('edit', {title:'后台录入'});
    }
});

//逻辑控制
app.post('/admin/article/save', function (req, res) {
    var articleObj = req.body.article;
    var id = articleObj._id;
    var _article;
    if(id)
    {
        Article.findById(id, function (err, article) {
            if (err) {
                console.log(err);
            }
            _article = _.extend(article, articleObj);
            _article.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                res.send(JSON.stringify({result:"ok"}));
            });
        });
    }
    else
    {
        var article = new Article(); 
        article.title = articleObj.title; 
        article.bookname = articleObj.bookname; 
        article._bookid = articleObj._bookid; 
        article.text = articleObj.text; 
        article.wxshared = articleObj.wxshared;
        article.save(function (err) { console.log(article); }); 
        
        res.send(JSON.stringify({result:"ok"}));
    }

});

app.delete('/admin/article/delete', function (req, res) {
    var id = req.query.id;
    if (id) {
        Article.remove({_id: id}, function (err, article) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: true});
            }
        });
    }
});



// 监听端口
app.listen(port);
console.log('server started on port: ' + port);