var express = require("express");
var app = express();
var router = require("./router/router.js");
var session = require('express-session');
//使用session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  //cookie: { secure: true }//不能要
  //将此设置为true时，如果浏览器没有使用HTTPS连接，客户端将不会将cookie发送回服务器。
}))

app.set("view engine","ejs");
app.use(express.static("./public"));
app.use("/avatar",express.static("./avatar"));
//路由表

 //展示主页
app.get("/",router.showIndex);
//展示注册页面
app.get("/regist",router.showRegist);
//执行注册的业务
app.post("/doRegist",router.doRegist);
//展示登录的界面
app.get("/login",router.showLogin);
//执行登录的业务
app.post("/doLogin",router.doLogin);
//设置头像的业务
app.get("/setavatar",router.showSetavatar);
//执行设置头像的业务
app.post("/doSetavatar",router.doSetavatar);
//显示剪切的业务
app.get("/cut",router.showCut);
//执行剪切
app.get("/docut",router.docut);
//发表说说
app.post("/doPublic",router.doPublic);
//获得所有说说
app.get("/alllogs",router.alllogs);

//获取用户成员信息
app.get("/userinfo",router.userinfo);

//说说分页总数总数
app.get("/alllogsamount",router.alllogsamount);  

//显示注册用户
app.get("/allMember",router.allMember);

//显示我的微博
  //显示用户所有说说
app.get("/user/:user",router.myBlog);  
 //显示用户所有说说
app.get("/post/:oid",router.myBlog);  

app.get("/user",router.user);

app.get("/logout",router.index);

//绝密档案
app.get("/archives",router.archives);

//网站展示
app.get("/website_ad",router.website_ad);

//博主笔记
app.get("/book_ad",router.book_ad);

app.listen(3000);