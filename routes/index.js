var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var mysql = require('../mysql/fun.js');
var { formateDate } = require("../util.js")
var { FormatData } = require('../util');
var { GetGoodsById } = require("../mysql/admin")
//Routes that require login 需要登录的路由
var userlogin = ['shopcard', 'info', 'card'];
/**
 * Determine whether the user is logged in 判断用户是否登录
 */
router.use(function (req, res, next) {
  var islogin = false;
  for (var i = 0; i < userlogin.length; i++) {
    if (userlogin[i] == req.path.substring(1)) {
      islogin = true;
    }
  };
  if (islogin) {
    if (req.session.username) {
      return next();
    } else {
      return res.send(`<script>alert('You have not logged in, please log in first');location.href='/login'</script>`);
    }
  }
  next();
})
/**
 * Redirect to the home page 重定向于主页
 */
router.get('/', function (req, res, next) {
  res.redirect('/index');
})
/**
 * Return to the main page 返回主页面
 */
router.get('/index', function (req, res, next) {
  mysql.commodityall(function (err, data) {
    if (err) {
      return res.render('error.html');
    }
    mysql.swiperall(function (err, swiper) {
      if (err) {
        return res.render('error.html');
      }
      res.render('index.html', {
        username: req.session.username,
        avator: req.session.avator,
        data: data,
        swiper: swiper
      });

    })
  })
});
/**
 * Return to the login screen 返回登录界面
 */
router.get('/login', function (req, res, next) {
  res.render('login.html');
});

/*
* User personal information interface 用户个人信息界面
*/
router.get('/personal', function (req, res, next) {
  mysql.showcardbyallbyname(req.session.username, function (err, data) {
    //获得全部的数据
    if (data) {
      data.forEach(function (item) {
        item.comm = JSON.parse(item.comm)
      });
    }
    if (err) {
      return res.render('error.html');
    }

    res.render('personal.html', {
      username: req.session.username,
      avator: req.session.avator,
      data: data
    });
  })
});

/**
 * Shopping cart interface 购物车界面
 */
router.get('/shopcard', async function (req, res, next) {
  mysql.showcardbyallbyname(req.session.userId, async function (err, data) {
    //Get all the data 获得全部的数据
    if (data) {
      data.forEach(function (item) {
        item.comm = JSON.parse(item.comm)
      });
    }
    if (err) {
      return res.render('error.html');
    }


    for (let j = 0; j < data.length; j++) {
      let item = data[j]

      let sum = 0
      let count = 0
      for (let i = 0; i < item.comm.length; i++) {
        let goods = item.comm[i]
        let info = await GetGoodsById(goods.id)
        sum += (Number(info[0] ? info[0].porice : 0) * Number(goods.number))
        count += Number(goods.number)
        goods.porice = Number(info[0] ? info[0].porice : 0)
        goods.url = info[0].url
      }
      item.sum = sum
      item.count = count
      item.comm = item.comm
    }

    res.render('shopcard.html', {
      username: req.session.username,
      avator: req.session.avator,
      data: FormatData(data, {
        orderDate: 'time'
      })
    });

  })
})
/**
 *Details page 详情页面
 */
router.get('/info', function (req, res, next) {
  let id = req.query.id
  mysql.commoditybyid(id, function (err, data) {
    if (err) {
      return res.render('error.html');
    }
    mysql.getCommByGodds(id, function (err, commList) {
      if (err) {
        return res.render('error.html');
      }
      data[0].urlList = JSON.parse(data[0].urlList)
      commList.forEach(function (comm) {
        comm.commDate = formateDate(comm.commDate)
      })
      res.render('info.html', {
        info: data[0],
        username: req.session.username,
        avator: req.session.avator,
        commList: commList
      });
    })
  })
});
/**
 * Shopping Cart 购物车
 */
router.get('/card', function (req, res, next) {
  res.render('card.html', {
    username: req.session.username,
    avator: req.session.avator,
  });
});
/**
 *View user information 查看用户信息
 */
router.get('/byuser', function (req, res, next) {
  let userId = req.query.userId
  mysql.getUserInfo(userId, function (err, data) {
    if (err) {
      return res.render('error.html');
    }
    res.render('byuser.html', {
      userInfo: data[0],
      username: req.session.username,
      avator: req.session.avator
    });
  })
});
module.exports = router;
