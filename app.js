// 导入express
const express = require('express');;
var bodyParser = require('body-parser');
// 导入数据库操作模块
const db = require('./othermodule/mysql');
// 导入 session 中间件
var session = require('express-session');
const ejs = require("ejs");

const upload = require('./othermodule/upload')
const cors = require('cors');
const md5 = require('md5');

var app = express();

app.set('views', "pages"); //设置视图的对应目录
app.set("view engine", "ejs"); //设置默认的模板引擎
app.engine('ejs', ejs.__express); //定义模板引擎

// 设置默认首页，默认为登陆界面
app.use(express.static(__dirname + "/pages", { index: "login.html" }));
// 跨域
app.use(cors())
app.use(session({
    secret: 'keyboard cat',  // secret 属性的值可以为任意字符串
    resave: false,           // 固定写法
    saveUninitialized: true  // 固定写法
}))
// 中间件定义post传递的格式
app.use(express.static('./pages'));
app.use('/public', express.static('./public'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));//Context-Type 为application/x-www-form-urlencoded 时 返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.json());//用于解析json 会自动选择最为适宜的解析方式



// 登录功能
app.all('/api/login', function (req, res) {


    const sqlStr = 'SELECT username,password FROM user;'
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) return console.log(err.message, '获取用户名错误')

        // 查询数据成功
        // 注意：如果执行的是 select 查询语句，则执行的结果是数组
        let userData = results.map(item => item.username)
        let pwdData = results.map(item => item.password)

        if (userData.indexOf(req.body.username) == -1) {
            res.send({
                status: 400,
                message: '该用户不存在',
            })
        } else {
            // 用户存在，判断密码(md5加密)
            if (md5(req.body.password) == pwdData[userData.indexOf(req.body.username)]) {

                // 将用户的信息，存储到Session中
                req.session.user = req.body
                // 将用户的登陆状态，存储到Session中
                req.session.islogin = true

                res.send({
                    status: 200,
                    message: '登录成功',
                })

            } else {
                res.send({
                    status: 401,
                    message: '登录失败,密码不正确',
                })
            }

        }
    })
})

// 查询所有用户和密码
app.get('/api/alluser', (req, res) => {

    const sqlStr = 'SELECT * FROM user;'
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            res.send({
                status: 200,
                message: '获取所有用户成功',
                data: results,
            })
        }
    })
})

// 注册功能
app.all('/api/register', function (req, res) {
    // 判断数据库里是否已经存在该用户名,如果没有则注册，如果有则提示重新注册
    const sqlStr = 'SELECT username FROM user;'
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            let userData = results.map(item => item.username)
            // 判断注册的账号是否与数据库里的账号相同 -1 代表数据库里不存在此数据
            if (userData.indexOf(req.body.username) == -1) {
                const sqlStr = `INSERT into user (username, password,email) VALUES ( '${req.body.username}', '${md5(req.body.password)}','${req.body.email}');`
                db.query(sqlStr, (err, results) => {
                    // 查询数据失败
                    if (err) {
                        return console.log(err.message);
                    } else {
                        res.send({
                            status: 200,
                            message: '注册成功'
                        })
                    }
                })
            } else {
                res.send({
                    status: 400,
                    message: '账号已存在,请重新注册'
                })
            }
        }
    })
})

// 获取用户名的接口，用于显示 当前用户及判断用户是否登录
app.get('/api/username', (req, res) => {

    // 判断用户是否登录
    if (!req.session.islogin) {
        return res.send({
            status: 404,
            msg: 'fail'
        })
    }
    res.send({
        status: 200,
        msg: 'success',
        username: req.session.user.username
    })
})

// 退出登录
app.post('/api/logout', (req, res) => {

    // 退回当前客户端对应的 session 信息
    req.session.destroy()
    res.send({
        status: 200,
        msg: '退出登陆成功',
    })
})

//修改密码
app.post('/api/changePwd', (req, res) => {
    const sqlStr = `update user set password = ? where username = ?;`;
    db.query(sqlStr, [md5(req.body.newPwd), req.session.user.username], (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            res.send({
                status: 200,
                message: 'success',
            })
        }
    })
})

//修改个人信息
app.post('/api/changeInfor', (req, res) => {
    const sqlStr = `update user set phone = ?,email = ?,selfIntorduction = ?  where username = ?;`;
    db.query(sqlStr, [req.body.phone, req.body.email,req.body.introduction,req.session.user.username], (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            res.send({
                status: 200,
                message: 'success',
            })
        }
    })
})

// 获取文章列表
app.get('/api/getArticle', (req, res) => {

    const sqlStr = 'SELECT * FROM Notepad;'
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            res.send({
                status: 200,
                message: '获取文章成功',
                data: results,
            })
        }
    })
})


// 新增文章接口
app.post('/api/addArticle', (req, res) => {

    let time = new Date()
    var file = req.file.filename;
    var imgurl = '../upload'+file;

    const sqlStr = `INSERT into Notepad VALUES (null, '${req.session.user.username}', '${req.body.title}', '${req.body.content}', '${time.toLocaleString()}' , '${imgurl}');`
    console.log(imgurl)
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            res.send({
                status: 201,
                message: '添加文章成功',
                data: {}
            })
        }
    })
})

// 查找文章接口
app.post('/api/search', (req, res) => {

    let time = new Date();

    const sqlStr = `SELECT * FROM notepad where id=${req.body.id};`
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            res.send({
                status: 200,
                message: "查找成功",
                data: results
            })
        }
    })
})


// 获取指定文章
app.get('/page/:_id', (req, res) => {

    global.num = req.params._id
    num = num.replace('_id', '')
    num = parseInt(num)
    // 根据id查找相应的数据 
    const sqlStr = `SELECT * FROM Notepad where id=${num};`
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message)
        } else {
            res.render("index.ejs", {
                username: results[0].username,
                title: results[0].title,
                content: results[0].content,
                time: results[0].time,
                imgurl : results[0].imgurl,
            })
        }
    })
})

//获取文章评价
app.get('/api/getComment', function (req,res){
    //根据id查找相应的评论数据 
    const sqlStr = `SELECT * FROM comment where id=${num};`
    db.query(sqlStr, (err, results) => {
         // 查询数据失败
         if (err) {
             return console.log(err.message)
         } else {
            res.send({
                status: 200,
                message: "查找成功",
                data: results
            })
         }
    })
})


//发表文章评价
app.post('/api/sendComment', function (req, res) {
    let time = new Date();
    
    const sqlStr = `INSERT into comment (id,sender,comment,time) VALUES ( '${num}', '${req.session.user.username}','${req.body.comment}','${time.toLocaleString()}');`
    db.query(sqlStr, (err, results) => {
        // 查询数据失败
        if (err) {
            return console.log(err.message);
        } else {
            res.send({
                status: 200,
                message: '发布成功'
            })
        }
    })
})


// 获取留言
app.get('/api/getLeaving', (req, res) => {

    const sqlStr = `SELECT * FROM leaving;`

    db.query(sqlStr, (err, results) => {
        // 失败
        if (err) {
            return console.log(err.message)
        }
        res.send({
            code: 200,
            msg: '获取留言成功',
            data: results,
        })
    })
})

// 发送留言
app.post('/api/addLeaving', (req, res) => {

    let time = new Date()
    // 获取到客户端通过查询字符串，发送到服务器的数据
    const sqlStr = `INSERT INTO leaving VALUES ('${req.session.user.username}','${req.body.content}','${time.toLocaleString()}','${req.body.reciver}');`
    db.query(sqlStr, (err, results) => {
        // 失败
        if (err) {
            return console.log(err.message)
        }
        res.send({
            status: 200,
            msg: '添加数据成功',
            data: results,
        })
    })
})



// 分页查询功能
// SELECT * FROM notepad LIMIT 5 OFFSET 10;
app.post('/api/limit', (req, res) => {

    const sqlStr = `SELECT * FROM notepad LIMIT 10 OFFSET ${req.body.num};`
    db.query(sqlStr, (err, results) => {
        // 失败
        if (err) {
            return console.log(err.message)
        }
        res.send({
            status: 200,
            msg: '分页查询成功',
            data: results,
        })
    })
})

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    console.log('发生了错误！' + err.message)
    res.send('Error：' + err.message)
})

app.listen(80, () => {
    console.log('服务已启动: 127.0.0.1');
})


