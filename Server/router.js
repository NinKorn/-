//路由模块
const express = require('express');
const router = express.Router();
const axios =require('axios');

const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog',
    multipleStatements: true
});

// const Heros = require('./heros.js');
//用户登录
router.post('/user', (req, resl) => {
    //获取用户code
    let bloginfo = req.body;
    console.log(bloginfo);
    let data = {
        'appid':'wx42229426ec94162d',
        // wx42229426ec94162d
        'secret':'00ASDqw33.k',
        'js_codeb':bloginfo.code,
        'grant_type':'authorization_code'
    }
    let url = 'https://api.weixin.qq.com/sns/jscode2session?'+'appid=wx42229426ec94162d&secret=00ASDqw33.k&js_codeb='+bloginfo.code+'&grant_type=authorization_code'
    
    axios.get(url).then(
        res => {
            console.log(res,111);
        }
    )
});
//查询所有文章
router.get('/getblog', (req, resl) => {
    let sql = `select * from blog limit ${req.query.page},${req.query.size};select COUNT(*) 'cont' from blog`
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
            totle:res[1][0].cont
        });
    });
});

//新增
router.post('/addblog', (req, resl) => {
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
