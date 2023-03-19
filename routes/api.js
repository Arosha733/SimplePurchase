var express = require('express');
var router = express.Router();
var mysql = require('../mysql/fun');
var createError = require('http-errors');
var multer = require('multer');
const session = require('express-session');
var { changeStock, getGoodsByNameCount } = require("../mysql/admin")
var storage = multer.diskStorage({
  //Store the uploaded file in the specified location (if it does not exist, you need to create it manually)
  //将上传的文件存储在指定的位置（不存在的话需要手动创建）
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  //Change the name of the uploaded file
  //将上传的文件做名称的更改
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({ storage: storage })
/**
 * All API requests 所有的api请求
 */
router.post('/login', function (req, res, next) {
  var bodys = req.body;
  var username = bodys.username;
  var password = bodys.password;
  
  mysql.login(username, password, function (err, data) {
    if (err) {
      next("unknown error");
    }
    if (!data.length) {
      return res.json({
        flog: 0,
        data: 'The input information is incorrect, please re-enter'
      });
    } else {
      req.session.username = username;
      req.session.avator = data[0].avator;
      req.session.userId = data[0].userId;
      res.json({
        flog: 1,
        data: data[0]
      });
    }
  })
});
router.post('/register', function (req, res, next) {
  var bodys = req.body;
  mysql.isuser(bodys.name, function (err, data) {
    if (err) {
      return next(err);
    }
    if (!data.code) {
      return res.json({
        flog: 0,
        data: 'The user already exists on the server'
      });
    } else {
      mysql.register({
        username: bodys.name,
        password: bodys.pass,
        email: bodys.email
      }, function (err, data) {
        if (err) {
          return next(err);
        }
        if (data) {
          req.session.username = bodys.name;
          return res.json({
            flog: 1,
            data: 'Successfully registered user'
          });
        } else {
          return res.json({
            flog: 0,
            data: 'Failed to register user'
          });
        }
      })
    }
  })
});
router.post('/dellogin', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return res.json({
        flog: 0,
        data: 'Exit failed'
      });
    }
    res.clearCookie("user_key");
    return res.json({
      flog: 1,
      data: 'Exit succeeded'
    });
  })
});
router.get('/islogin', function (req, res, next) {
  if (req.session.username) {
    return res.json({
      flog: 1,
      data: 'already logged'
    });
  } else {
    return res.json({
      flog: 0,
      data: 'Not logged in'
    });
  }
});
router.get('/shoppinfo', function (req, res, next) {
  var id = req.query.id;
  mysql.commoditybyid(id, function (err, data) {
    if (err) {
      return res.json({
        flog: 0,
        data: 'Failed to get information'
      });
    }
    return res.json({
      flog: 1,
      data: data
    });
  });
});
router.get('/commodityall', function (req, res, next) {
  mysql.commodityall(function (err, data) {
    if (err) {
      return res.json({
        flog: 0,
        data: 'Failed to get information'
      });
    }
    return res.json({
      flog: 1,
      data: data
    });
  })
})
router.get('/commodityPage', async function (req, res, next) {
  let { page, limit, name } = req.query;
  let count = await getGoodsByNameCount(name);
  let pageNum = Math.ceil((count / limit));
  if (page > pageNum) {
    return res.json({
      code: 1,
      data: [],
      msg: "The data has been loaded"
    });
  }
  var num = (page - 1) * limit;
  mysql.commodityPage({
    num,
    limit,
    name
  }, function (err, data) {
    if (err) {
      return res.json({
        flog: 0,
        data: 'Failed to get information'
      });
    }
    return res.json({
      flog: 1,
      data: data,
      pageNum: pageNum
    });
  })
})
router.get('/commoditybyname', function (req, res, next) {
  var name = req.query.name;
  mysql.commoditybyname(name, function (err, data) {
    if (err) {
      return res.json({
        flog: 0,
        data: 'Failed to get information'
      });
    }
    return res.json({
      flog: 1,
      data: data
    });
  });
})
router.post('/addshopcardinfo', function (req, res, next) {
  mysql.addshopcardinfo({
    username: req.session.username,
    userId: req.session.userId,
    comm: req.body.data,
    orderState: 0
  }, async function (err, data) {
    if (err) {
      return next("unknown error");
    }
    //减少库存
    let prList = JSON.parse(req.body.data).map(async (pro) => {
      await changeStock(pro.id, {
        stock: -Number(pro.number)
      })
    })
    await Promise.all(prList)
    return res.json({
      flog: 1,
      data: 'Adding goods operation succeeded'
    });
  })
})
router.get('/delcard', function (req, res, next) {
  var id = req.query.id;
  mysql.showcardbyid(id, function (err, data) {
    let comm = JSON.parse(data[0].comm)
    mysql.delcardbyid(id, async function (err, data) {
      if (err) {
        return next("unknown error");
      }
      //Increase inventory 增加库存
      let prList = comm.map(async (pro) => {
        await changeStock(pro.id, {
          stock: Number(pro.number)
        })
      })
      await Promise.all(prList)
      return res.json({
        flog: 1,
        data: 'Order deleted successfully'
      });

    })
  })
})
router.get('/delivercard', function (req, res, next) {
  var id = req.query.id;
  mysql.delivercard(id, function (err, data) {
    if (err) {
      return next("unknown error");
    }
    return res.json({
      flog: 1,
      data: 'Goods received successfully'
    });
  })
})
router.get('/returncard', function (req, res, next) {
  var id = req.query.id;
  mysql.returncard(id, function (err, data) {
    if (err) {
      return next("unknown error");
    }

    mysql.showcardbyid(id, async function (err, data) {
      //增加库存
      let prList = JSON.parse(data[0].comm).map(async (pro) => {
        await changeStock(pro.id, {
          stock: Number(pro.number)
        })
      })
      await Promise.all(prList)
    })

    return res.json({
      flog: 1,
      data: 'Return succeeded'
    });
  })
})
router.post('/userInfo', function (req, res, next) {
  var userId = req.session.userId;
  mysql.getUserInfo(userId, function (err, data) {
    if (err) {
      return next("unknown error");
    }
    return res.json({
      flog: 1,
      data: data
    });
  })
})
router.post('/updateUserInfo', upload.single("avator"), function (req, res, next) {
  let { userId, username, email, avator } = req.body;
  avator = req.file ? (`${req.protocol}://${req.headers.host}/${req.file.path}`).replace(/\\/ig, '/') : '';
  console.log(userId, username, email, avator)
  mysql.updateUserInfo({
    userId, username, email, avator
  }, function (err, data) {
    if (err) {
      return next("unknown error");
    }
    req.session.username = username;
    if (avator) {
      req.session.avator = avator;
    }
    return res.json({
      flog: 1,
      data: 'Modification succeeded'
    });
  })
})
router.post('/addComm', function (req, res, next) {
  var bodys = req.body;
  console.log(session)
  mysql.addComm({
    commText: bodys.commText,
    goodsId: bodys.goodsId,
    userId: req.session.userId
  }, function (err, data) {
    if (err) {
      return next(err);
    }
    if (data) {
      return res.json({
        flog: 1
      });
    } else {
      return res.json({
        flog: 0
      });
    }
  })
});
router.post('/UpdateUserPassById', async (req, res, next) => {
  let { oldPsw, newPsw } = req.body;
  let userId = req.session.userId;
  let username = req.session.username;
  mysql.login(username, oldPsw, function (err, data) {
    if (err) {
      next("unknown error");
    }
    if (!data.length) {
      return res.json({
        flog: 0,
        mag: 'Old password error'
      });
    } else {

      mysql.UpdateUserPassById({
        userId: userId,
        password: newPsw
      }, function (err, data) {
        if (err) {
          return next("unknown error");
        }
        return res.json({
          flog: 1,
          msg: "Password modification succeeded"
        })
      })
    }
  })
})
/**
 * Handle all API errors 处理所有api错误
 */
router.post('/personal', function (req, res, next) {
  var bodys = req.body;
  var username = bodys.username;
  var password = bodys.password;
  console.log("Test start")
  console.log(req.session)
  console.log("End of test")
  mysql.login(username, password, function (err, data) {
    if (err) {
      next("Unknown error");
    }
    if (!data.length) {
      return res.json({
        flog: 0,
        data: 'The input information is incorrect, please re-enter'
      });
    } else {

      req.session.username = username;
      req.session.avator = data[0].avator;
      res.json({
        flog: 1,
        data: data[0]
      });
    }
  })
});

router.use(function (err, req, res, next) {
  console.log(err)
  return res.send({
    flog: 0,
    data: err
  })
});

module.exports = router;