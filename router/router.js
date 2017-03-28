//又提交，引入formidable
var formidable = require("formidable"); 
//引入封装好的db.js，从setting走
var db = require("../model/db.js");

var md5 = require("../model/md5.js");

var path = require("path");

var fs = require("fs");

var gm = require('gm');

//显示主页
exports.showIndex = function (req, res, next) {
    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;
    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }
    //已经登陆了，那么就要检索数据库，查登陆这个人的头像
    db.find("users", {username: username}, function (err, result) {
        if (result.length == 0) {
            var avatar = "moren.jpg";
        } else {
            var avatar = result[0].avatar;
        }
        res.render("index", {
            "login": login,
            "username": username,
            "active": "首页",
            "avatar": avatar    //登录人的头像
        });
    });
};
//显示注册页面
exports.showRegist = function (req,res,next) {
	res.render("regist",{
    "login" : req.session.login == "1" ? true : false,
    "username" : req.session.login == "1" ? req.session.username : "",
    "active" : "注册"
  });
}
//注册业务
exports.doRegist = function (req,res,next) {
	  var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var username = fields.username;
      var userpassword = fields.userpassword;
      //console.log(username, userpassword);
      //查询数据库的名字是否重复
      db.find("users",{"username": username},function (err,result) {
      	if(err) {
      		res.send("-3");
      		return;
      	}
      	if(result.length !=0) {
      		res.send("-1");//被占用
      		return;
      	}
      	//设置MD5加密
      	userpassword = md5(md5(userpassword)+"adou");
      	//返回result.length的长度为０，说明数据库中没有此名字
      	db.insertOne("users",{
      		"username" :  username,
      		"userpassword" :  userpassword,
          "avatar" : "default.jpg"
      	},function(err,result){
      		if(err){
      			res.send("-3");//服务器错误
      			return;
      		}
  			req.session.login = "1";
      		req.session.username = username; 
      		res.send("1");//注册成功
      		
      	});
       });
    });
}

//显示登录界面

exports.showLogin = function (req,res,next) {
    res.render("login",{
      "login" : req.session.login == "1" ? true : false,
      "username" : req.session.login == "1" ? req.session.username : "",
      "active" : "登陆"
    });
}
//执行登录
exports.doLogin = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      //表单数据
      var username = fields.username;
      var userpassword = fields.userpassword;
      userpassword_handel= md5(md5(userpassword)+"adou");
      db.find("users",{"username" : username},function(err,result){
          if(err){
              res.send("-5");//随便去，服务器错误
              return;
          }
          if(result.length == 0){
              res.send("-1");//用户名不存在
              return;
          }
          if(userpassword_handel == result[0].userpassword){
              req.session.login = "1";
              req.session.username= username;
              res.send("1");
              return;
          }else{
              res.send("-2");//密码错误
              return;
          }
      })
    })
}

//显示更改图片页面
exports.showSetavatar = function (req,res,next) {
  //必须登录
  if(req.session.login != "1") {
    res.end("没有登录，请登录");
    return;
  }
  res.render("setavatar",{
    "login" : true ,
    "username" : req.session.username || "default",
    "active" : "更改个人资料"
  });
};

//执行设置图片
exports.doSetavatar = function (req,res,next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname +"/../avatar");
    form.parse(req, function(err, fields, files) {
      var oldpath = files.touxiang.path;
      var newpath = path.normalize(__dirname+"/../avatar") + "/" + req.session.username +".jpg";
      fs.rename(oldpath,newpath,function (err) {
          if(err){
              res.send("失败");
              return;
          }
          req.session.avatar = req.session.username +".jpg";
          //跳转到切的页面
          res.redirect("/cut"); 
      });
    });
};

//显示切图片
exports.showCut = function (req,res,next) {
  //必须保证登陆
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }
  res.render("cut",{
      avatar:  req.session.avatar
  });
}
//执行切图
exports.docut = function (req, res, next) {
    //必须保证登陆
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }
    //这个页面接收几个GET请求参数
    //w、h、x、y
    var filename = req.session.avatar;
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;

    gm("./avatar/" + filename)
        .crop(w, h, x, y)
        .resize(100, 100, "!")
        .write("./avatar/" + filename, function (err) {
            if (err) {
                res.send("-1");
                return;
            }
            //更改数据库当前用户的avatar这个值
            db.updateMany("users", {"username": req.session.username}, {
                $set: {"avatar": req.session.avatar}
            }, function (err, results) {
                res.send("1");
            });
        });

    
}

//发表说说
exports.doPublic = function (req,res,next) {
    //用户必须登录
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
    var log_day = fields.log_day;
    var blog_title = fields.blog_title;
    var username = req.session.username;
    db.insertOne("logs",{
      "username" : username,
      "log_day" :  log_day,
      "blog_title" : blog_title,
      "datetime" : new Date()
    },function(err,result){
        if(err){
          res.send("-3");//服务器错误
          return;
        }
        res.send("1");//注册成功     
        });
    });
}

//获取说说
exports.alllogs = function(req,res,next){
    //这个页面接收一个参数，页面
    var page = req.query.page;
    db.find("logs",{},{"pageamount":6,"page":page,"sort":{"datetime":-1}},function(err,result){
        res.json(result);
    });
};

//用户成员信息
exports.userinfo = function (req,res,next) {
  //这个页面接收一个参数，页面
  var username = req.query.username;
  db.find("users",{"username":username},function(err,result){
      if(err || result.length == 0){
          res.json("");
          return;
      }
      var obj = {
          "username" : result[0].username,
          "avatar" : result[0].avatar,
          "_id" : result[0]._id,
      };
      res.json(obj);
  });
}

//说说分页总数
exports.alllogsamount = function(req,res,next){
    db.getAllCount("logs",function(count){
        res.send(count.toString());
    });
};

//显示所有注册用户
exports.allMember = function(req,res,next){
    db.find("users",{},function(err,result){
            res.render("userlist",{
                "login": req.session.login == "1" ? true : false,
                "username": req.session.login == "1" ? req.session.username : "",
                "active" : "所有成员",
                "suoyouchengyuan" : result
            });
      });
};

//显示我的微博
exports.myBlog = function(req,res,next){
    var user = req.params["user"];
    db.find("logs",{"username":user},function(err,result){
       db.find("users",{"username":user},function(err,result2){
           res.render("myBlog",{
               "login": req.session.login == "1" ? true : false,
               "username": req.session.login == "1" ? req.session.username : "",
               "user" : user,
               "active" : "我的微博",
               "cirenshuoshuo" : result,
               "cirentouxiang" : result2[0].avatar
           });
       });
    });

}

exports.user = function (req,res,next) {
  if(!req.session.username){
      res.render("warning");
  }
}
// //退出登录  处理不好，有问题
exports.index= function (req,res,next) {
    req.session.login=false;
    req.session.username=false;
    res.render("index");
}

//绝密档案
exports.archives = function (req,res,next) {
    res.render("archives",{
       "login" : req.session.login == "1" ? true : false,
       "username" : req.session.login == "1" ? req.session.username : "",
       "active" : "绝密档案"
    });
}

//website_ad
exports.website_ad = function (req,res,next) {
    res.render("website_ad",{
      "login" : req.session.login == "1" ? true : false,
      "username" : req.session.login == "1" ? req.session.username : "",
      "active" : "照片展示"
    });
}

//博主笔记
exports.book_ad = function (req,res,next) {
    res.render("book_ad",{
      "login" : req.session.login == "1" ? true : false,
      "username" : req.session.login == "1" ? req.session.username : "",
      "active" : "博主笔记"
    });
}