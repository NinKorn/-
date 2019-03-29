const express = require('express');
const app = express();

//注册中间件
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//下载cors同源
const cors = require('cors');
app.use(cors());
//路由
const router = require('./router.js');
app.use(router);

app.listen(5001, () => {
    console.log('http://127.0.0.1:5001/getallhero');
});



