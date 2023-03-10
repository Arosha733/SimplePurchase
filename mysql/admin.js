let { connection } = require('./init');
const sqlCount = 'SQL_CALC_FOUND_ROWS';
let { sqlUpdateStr, sqlAddStr, sqlSelectStr, sqlWhereStr, sqlAddStr_null } = require('../util.js');
const ADMIN = 'admin'
const USER = 'user'
const SWIPER = 'swiper'
const COMMODITY = 'commodity'
const CARD = 'card'

function query(sql, data = {}, isCount = false) {
    return new Promise((resolve, reject) => {
        Object.values(data).forEach(item => {
            sql = sql.replace("?", item)
        })
        if (Array.isArray(sql)) {
            Promise.all((sql.map(item => {
                return new Promise((res, rej) => {
                    connection.query(item, function (qerr, vals, fields) {
                        res(vals)
                    })
                })
            }))).then(res => {
                resolve(res)
            })
        } else {
            connection.query(sql, function (qerr, vals, fields) {
                //Event-driven callbacks 事件驱动回调
                if (qerr) {
                    console.log(qerr)
                    reject(new Error('sql error'))
                } else {
                    if (isCount) {
                        connection.query(`SELECT FOUND_ROWS() as count`, function (error, count) {
                            resolve({
                                data: vals,
                                count: count[0].count
                            })
                        })
                    } else {
                        resolve(vals)
                    }
                }
            });
        }

    })
}
/**
 *  login 登录
 */
function isAdminLogin(data) {
    return new Promise((resolve, reject) => {
        query(`select  * from ${ADMIN} where name='?' and password='?'`, data)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Gets the total number of administrators 获取管理员总数目
 */
function getAdminCount() {
    return new Promise((resolve, reject) => {
        query(`select count(id) as counts from ${ADMIN}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Get all administrator information 获取管理员全部信息
 */
function GetAdminList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlSelectStr(condition, like);
        query(`select ${sqlCount} * from ${ADMIN} ${condition}  limit ?,${limit}`, { num }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Query administrator information based on administrator ID 根据管理员id查询管理员信息
 */
function GetAdminById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${ADMIN} where id=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Modify the administrator information according to the ID 根据id修改管理员信息
 */
function UpdateAdminById(id, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${ADMIN} SET ${sql} WHERE id=${id}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Delete the administrator based on the ID 根据id删除管理员
 */
function DeleteAdminById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${ADMIN} WHERE id=?`, id)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Add an administrator 添加管理员
 */
function addAdmin(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${ADMIN}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Add a carousel 添加轮播图
 */
function uploadSwiperImg(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${SWIPER}(${obj.keys}) VALUES(${obj.vals})`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Modify the carousel 修改轮播图
 */
function updataSwiperImg(swiperId, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${SWIPER} SET ${sql} WHERE swiperId=${swiperId}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Get all carousels 获取所有轮播图
 */
function getSwiperList() {
    return new Promise((resolve, reject) => {
        query(`select *  from ${SWIPER} ORDER BY swiperIndex ASC`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Deletes the carousel graph with the specified ID 删除指定id的轮播图
 */
function deleteSwiperById(swiperId) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${SWIPER} WHERE swiperId=?`, { swiperId })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Change the carousel order 更换轮播顺序
 */
function updataSwiperWz(data) {
    let sql = data.map(item => {
        return `UPDATE ${SWIPER} SET swiperIndex=${item.swiperIndex} WHERE swiperId=${item.swiperId}`
    })
    return new Promise((resolve, reject) => {
        query(sql)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 *Query the order of the carousel graphs according to swiperId 根据swiperId查询轮播图的顺序
 */
function getSwiperIdByIndex(swiperId) {
    return new Promise((resolve, reject) => {
        query(`select *  from ${SWIPER} where swiperId=${swiperId}`)
            .then((res) => {
                resolve(res[0].swiperIndex)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Gets the number of users 获取用户的数目
 */
function getUserCount() {
    return new Promise((resolve, reject) => {
        query(`select count(userId) as counts from ${USER}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Gets the number of paged users 获取分页用户数
 */
function getUserList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        Object.entries(like).forEach((item) => {
            if (item[1] != undefined && item[1] != "") {
                if (!String(condition).length) {
                    condition += " where "
                } else {
                    condition += " and "
                }
                condition += `${item[0]} like '%${item[1]}%'`
            }
        })
        query(`select  ${sqlCount} * from ${USER} ${condition}  limit ?,${limit}`, { num }, true)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Obtain user information based on ID 根据id获取用户信息
 */
function GetUsersById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${USER} where userId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * The method of deleting the user 删除用户的方法
 */
function DeleteUserById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${USER} WHERE userId=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Get the number of products 获取产品数目
 */
function getGoodsCount() {
    return new Promise((resolve, reject) => {
        query(`select count(id) as counts from ${COMMODITY} `)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Get products information 获取产品信息
 */
function GetGoodsList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlSelectStr(condition, like);
        query(`select ${sqlCount} * from ${COMMODITY} ${condition}  limit ?,${limit}`, { num }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Get the products information according to the ID 据id获取产品信息
 */
function GetGoodsById(id) {
    return new Promise((resolve, reject) => {
        query(`select * from ${COMMODITY} WHERE id=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Delete the products according to the ID 根据id删除手办
 */
function DeleteGoodsById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${COMMODITY} WHERE id=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Add a product 添加产品
 */
function addGoods(data) {
    return new Promise((resolve, reject) => {
        let obj = sqlAddStr(data);
        query(`INSERT INTO ${COMMODITY}(${obj.keys}) VALUES(${obj.vals}) `)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Modify the product according to the ID 根据id修改产品
 */
function UpdateGoods(id, data) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, data);
        query(`UPDATE ${COMMODITY} SET ${sql} WHERE id=${id}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Gets the total number of orders 获取订单总数目
 */
function getCardCount() {
    return new Promise((resolve, reject) => {
        query(`select count(id) as counts from ${CARD}`)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Get one week's worth of user data 获取一周用户数据
 */
function getUserListWord() {
    return new Promise((resolve, reject) => {
        query(`select  ${sqlCount} * from ${USER} where YEARWEEK(date_format(userTime,'%Y-%m-%d'),1) = YEARWEEK(now(),1)`, {}, true)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    });
}
/**
 * Get user orders 获取用户订单
 */
function getCardList(num, limit, like) {
    return new Promise((resolve, reject) => {
        let condition = '';
        condition = sqlSelectStr(condition, like);
        query(`select ${sqlCount} * from ${CARD} ${condition}  limit ?,${limit}`, { num }, true)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Get an order based on the ID 根据id获取订单
 */
function getCardById(id) {
    return new Promise((resolve, reject) => {
        query(`select  * from ${CARD} where id=${id}`)
            .then(async (res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err)
            })
    })
}
/**
 * Delete the order based on the ID 根据id删除订单
 */
function DeleteCardById(id) {
    return new Promise((resolve, reject) => {
        query(`DELETE FROM ${CARD} WHERE id=?`, { id })
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Orders are received according to ID 根据id收货订单
 */
function DeliverCardById(id) {
    return new Promise((resolve, reject) => {
        let sql = '';
        sql = sqlUpdateStr(sql, {
            orderState: 1
        });
        query(`UPDATE ${CARD} SET ${sql} WHERE id=${id}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Change inventory 改变库存
 */
function changeStock(id, data) {
    return new Promise((resolve, reject) => {
        let sql = `stock=stock+${data.stock}`;
        query(`UPDATE ${COMMODITY} SET ${sql} WHERE id=${id}`)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(reject)
            })
    })
}
/**
 * Get the quantity according to Name 根据Name获取数量
 */
function getGoodsByNameCount(name){
    return new Promise((resolve, reject) => {
        query(`select count(id) as counts from ${COMMODITY} where name like '%${name}%' `)
            .then((res) => {
                resolve(res[0]['counts'])
            })
            .catch((err) => {
                reject(err)
            })
    })
}
exports.isAdminLogin = isAdminLogin;
exports.getUserCount = getUserCount;
exports.getUserList = getUserList;
exports.GetUsersById = GetUsersById;
exports.DeleteUserById = DeleteUserById;
exports.getAdminCount = getAdminCount;
exports.GetAdminById = GetAdminById;
exports.UpdateAdminById = UpdateAdminById;
exports.DeleteAdminById = DeleteAdminById;
exports.addAdmin = addAdmin;
exports.GetAdminList = GetAdminList;
exports.uploadSwiperImg = uploadSwiperImg;
exports.updataSwiperImg = updataSwiperImg;
exports.getSwiperList = getSwiperList;
exports.deleteSwiperById = deleteSwiperById;
exports.updataSwiperWz = updataSwiperWz;
exports.getSwiperIdByIndex = getSwiperIdByIndex;
exports.getGoodsCount = getGoodsCount;
exports.GetGoodsList = GetGoodsList;
exports.GetGoodsById = GetGoodsById;
exports.DeleteGoodsById = DeleteGoodsById;
exports.addGoods = addGoods;
exports.UpdateGoods = UpdateGoods;
exports.getCardCount = getCardCount;
exports.getUserListWord = getUserListWord;
exports.getCardList = getCardList;
exports.getCardById=getCardById;
exports.DeleteCardById = DeleteCardById;
exports.DeliverCardById = DeliverCardById;
exports.changeStock = changeStock;
exports.getGoodsByNameCount=getGoodsByNameCount