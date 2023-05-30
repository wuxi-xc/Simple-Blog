// 1. 导入 mysql 模块
const mysql = require('mysql')
// 2. 建立与 MySQL 数据库的连接关系
const db = mysql.createConnection({
  host:"127.0.0.1", //主机IP
    port:3306,        //端口号
    user:"root",	  //用户名
    password:"zcp.0113.@003113",  //密码
    database:"webblog"   //数据库名
})

module.exports = db



