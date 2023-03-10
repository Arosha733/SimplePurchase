/**
 * Access methods for all databases 所有的数据库的访问方法
 */
let { connection } = require('./init');
let { sqlUpdateStr, sqlAddStr, sqlSelectStr, sqlWhereStr, sqlAddStr_null } = require('../util.js');
/**
 * Normal user login 普通用户登录
 */
function login(username, password, callback) {
    let sql = `select * from user where username='${username}' and password='${password}'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
            console.log(results)
        }
    })
}
/**
 * Check whether it is registered 查询是否被注册
 */
function isuser(username, callback) {
    let sql = `select * from user where username='${username}'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            if (results.length) {
                callback(null, {
                    code: 0
                });
            } else {
                callback(null, {
                    code: 1
                });
            }
        }
    })
}
/**
 * Regular user registration 普通用户注册
 */
function register(data, callback) {
    let sql = `insert into user(username,password,email,avator) values('${data.username}','${data.password}','${data.email}','public/img/user/user.png')`;
    console.log(sql)
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Product inquiries 产品查询
 */
function commoditybyid(id, callback) {
    let sql = `select * from commodity where id=${id}`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 *Show all products 显示所有产品
 */
function commodityall(callback) {
    let sql = `select * from commodity order by id desc`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Pagination shows all products 分页处理显示所有产品
 */
function commodityPage(data, callback) {
    let whereSql = ''
    if (data.name) {
        whereSql = `where name like '%${data.name}%'`
    }
    let sql = `select  * from commodity ${whereSql} order by id desc limit ${data.num},${data.limit}`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 *Displays all carousels 显示所有轮播图
 */
function swiperall(callback) {
    let sql = `select * from swiper`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Displays all products according to category 根据分类显示所有的产品
 */
function commoditybytype(type) {
    let sql = `select * from commodity where type='${type}'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Displays categories by name 根据名字显示分类
 */
function commoditybyname(name, callback) {
    let sql = `select * from commodity where name like '%${name}%'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Order submission 订单提交
 */
function addshopcardinfo(data, callback) {
    let sql = `insert into card(username,userId,comm,orderState) values('${data.username}','${data.userId}','${data.comm}','${data.orderState}')`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Show all orders 显示所有订单
 */
function showcardbyallbyname(userId, callback) {
    let sql = `select * from card where userId='${userId}' order by orderDate desc`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Order Inquiry 订单查询
 */
function showcardbyid(id, callback) {
    let sql = `select * from card where id='${id}'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Order cancel 订单cancel
 */
function delcardbyid(id, callback) {
    let sql = `DELETE FROM card WHERE id=${id}`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 *  Order receipt 订单收货
 */
function delivercard(id, callback) {
    let sql = '';
    sql = sqlUpdateStr(sql, {
        orderState: 2
    });
    connection.query(`UPDATE card set ${sql} WHERE id=${id}`, function (error, results, fields) {
        if (error) {
            console.log(error)
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Return of the order 订单退货
 */
function returncard(id, callback) {
    let sql = '';
    sql = sqlUpdateStr(sql, {
        orderState: 3
    });
    connection.query(`UPDATE card set ${sql} WHERE id=${id}`, function (error, results, fields) {
        if (error) {
            console.log(error)
            callback(error);
        } else {
            callback(null, results);
        }
    })
}
/**
 * Order modification 订单修改
 */
function updatacardbyid() { }

/**
 * Get user information 获取用户信息
 */

function getUserInfo(userId, callback) {
    let sql = `select * from user where userId='${userId}'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}

/**
 *  Modify user information 修改用户信息
 */
function updateUserInfo(data, callback) {
    sql = `UPDATE user SET ${sqlUpdateStr('', {
        username: data.username,
        email: data.email,
        avator: data.avator
    })} where userId='${data.userId}'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}

/**
 * Add a comment 添加评论
 */
function addComm(data, callback) {
    let obj = sqlAddStr(data);
    let sql = `INSERT INTO comm(${obj.keys}) VALUES(${obj.vals}) `;
    console.log(sql)
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}

function getCommByGodds(goodsId, callback) {
    let sql = `select user.username,user.avator,comm.*,commodity.* from user,comm,commodity  where comm.goodsId=${goodsId} and comm.goodsId=commodity.id  and user.userId=comm.userId`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}

function UpdateUserPassById(data, callback) {
    sql = `UPDATE user SET ${sqlUpdateStr('', {
        password: data.password
    })} where userId='${data.userId}'`;
    connection.query(sql, function (error, results, fields) {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    })
}


exports.login = login;
exports.register = register;
exports.isuser = isuser;
exports.commoditybyid = commoditybyid;
exports.commodityall = commodityall;
exports.commoditybytype = commoditybytype;
exports.addshopcardinfo = addshopcardinfo;
exports.showcardbyid = showcardbyid;
exports.delcardbyid = delcardbyid;
exports.updatacardbyid = updatacardbyid;
exports.commoditybyname = commoditybyname;
exports.showcardbyallbyname = showcardbyallbyname;
exports.swiperall = swiperall;
exports.getUserInfo = getUserInfo
exports.updateUserInfo = updateUserInfo
exports.addComm = addComm
exports.getCommByGodds = getCommByGodds
exports.UpdateUserPassById = UpdateUserPassById
exports.delivercard = delivercard
exports.returncard = returncard
exports.commodityPage = commodityPage