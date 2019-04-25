//路由模块
const express = require('express');
const router = express.Router();
const axios = require('axios');

const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog',
    multipleStatements: true
});

//用户登录
router.get('/user', (req, resl) => {
    console.log(req.query);
    let sql = `SELECT * FROM user WHERE userName =? AND password =?`
    let userName = [req.query.userName, req.query.password];
    conn.query(sql, userName, (err, res) => {
        console.log(res, 'aa');
        console.log(res.length);
        if (err) {
            return resl.send({
                status: 500,
                msg: err.message,
                data: null
            });
        } else if (res.length == 0) {
            return resl.send({
                status: 501,
                msg: '用户名或密码输入不正确',
                data: null
            });
        } else {

            resl.send({
                status: 200,
                msg: '登陆成功',
                data: res
            });
        }
    });
});
//用户注册
router.post('/user', (req, resl) => {
    let time = new Date();
    let y = time.getFullYear();
    let m = (time.getMonth() + 1).toString().padStart(2, '0');
    let d = time.getDay().toString().padStart(2, '0');

    let hh = time.getHours().toString().padStart(2, '0');
    let mm = time.getMinutes().toString().padStart(2, '0');
    let ss = time.getSeconds().toString().padStart(2, '0');
    const overtime = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    let userinfo = req.body;
    userinfo.time = overtime;

    let sqlStr = 'insert user set ?';
    conn.query(sqlStr, userinfo, (err, res) => {
        if (err) return resl.send({
            status: 500,
            msg: err.message,
            data: null
        });
        resl.send({
            status: 200,
            msg: 'ok',
            data: res
        });
    });
});
//查询所有文章
router.get('/getblog', (req, resl) => {
    let sql = `select a.*,b.userName from blog as a inner JOIN user as b ON a.userid=b.userId limit ${req.query.page},${req.query.size};select COUNT(*) 'cont' from blog`
    let sqlCont = 'select COUNT(*) from blog'
    conn.query(sql, (err, res) => {
        if (err) return resl.send({
            status: 500,
            msg: err.message,
            data: null
        });
        resl.send({
            status: 200,
            msg: 'ok',
            data: res[0],
            totle: res[1][0].cont
        });
    });
});

//新增
router.post('/addblog', (req, resl) => {
    console.log(req,'aa');
    //获取时间
    let time = new Date();
    let y = time.getFullYear();
    let m = (time.getMonth() + 1).toString().padStart(2, '0');
    let d = time.getDay().toString().padStart(2, '0');

    let hh = time.getHours().toString().padStart(2, '0');
    let mm = time.getMinutes().toString().padStart(2, '0');
    let ss = time.getSeconds().toString().padStart(2, '0');
    const overtime = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    let bloginfo = req.body;
    bloginfo.time = overtime;

    let sqlStr = 'insert into blog set ?';
    conn.query(sqlStr, bloginfo, (err, res) => {
        console.log(res,'bbb');
        if (err) return resl.send({
            status: 500,
            msg: err.message,
            data: null
        });
        resl.send({
            status: 200,
            msg: 'ok',
            data: res
        });
    });
});

//根据id获取文章
router.get('/getblog/:id', (req, resl) => {
    let idstr = req.params.id;
    let sqlId = 'select * from blog WHERE id = ?';
    conn.query(sqlId, idstr, (err, res) => {
        if (err) return resl.send({
            status: 500,
            msg: err.message,
            data: null
        });
        resl.send({
            status: 200,
            msg: 'ok',
            data: res
        });
    });
});

//更新数据
router.post('/updatehero/:id', (req, resl) => {
    let heros = {
        name: req.body.name,
        gender: req.body.gender
    };
    // resl.send(req.body);
    let id = req.params.id;
    let sql = 'UPDATE heros SET ? WHERE id = ?';
    conn.query(sql, [heros, id], (err, res) => {
        if (err) return resl.send({
            status: 500,
            msg: res.message,
            data: null
        });
        resl.send({
            status: 200,
            msg: 'ok',
            data: res

        });
    });
});

// 软删除
router.get('/deletehero/:id', (req, resl) => {
    let idstr = req.params.id;
    console.log(idstr);
    let sql = 'UPDATE heros SET isdel = 1 WHERE id = ?';
    conn.query(sql, idstr, (err, res) => {
        if (err) return resl.send({
            status: 500,
            msg: res.message,
            data: null
        });
        resl.send({
            status: 200,
            msg: 'ok',
            data: res
        });
    })
});


//暴露
module.exports = router;
