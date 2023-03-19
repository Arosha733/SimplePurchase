var express = require('express');
var router = express.Router();
const os = require('os');
var moment = require('moment');
let { FormatData, isArrayEmpty, urlf2z, urlf2zList } = require('../util.js');
let {
    //administrator 管理员 
    isAdminLogin, getAdminCount, GetAdminList, GetAdminById, UpdateAdminById, addAdmin, DeleteAdminById,
    //Carousel map 轮播图
    getSwiperList, uploadSwiperImg, updataSwiperImg, deleteSwiperById, updataSwiperWz, getSwiperIdByIndex,
    //user 用户
    getUserCount, getUserList, GetUsersById, DeleteUserById,
    //Figure function 手办功能
    getGoodsCount, GetGoodsList, GetGoodsById, DeleteGoodsById, addGoods, UpdateGoods, changeStock,
    //orders 订单
    getCardCount, getUserListWord, getCardList, DeleteCardById, DeliverCardById, getCardById
} = require('../mysql/admin');
let upload = require('../util/multer/index')

router.post('/isAdminLogin', async (req, res, next) => {
    let { username, password, avator, code } = req.body;
   
    let data = await isAdminLogin({
        name: username,
        password
    });
    if (isArrayEmpty(data)) {
        jsonData = {
            code: 0,
            data: "Wrong account or password"
        }
    } else {
        jsonData = {
            code: 1,
            data: {
                "access_token": username,
                "name": username
            }
        }
        req.session.AdminInfo = {
            username: username,
            userId: data[0].id,
            url: data[0].url,
            avator: avator
        }
    }
    return res.json(jsonData)
});

router.get('/adminInfo', async (req, res, next) => {
    if (!req.session.AdminInfo) {
        return res.json({
            code: 500,
            msg: "Not logged in"
        })
    }
    res.json(
        {
            "code": 200,
            "user": {
                "userId": req.session.AdminInfo.userId,
                "username": req.session.AdminInfo.username,
                "nickName": req.session.AdminInfo.username,
                "url": req.session.AdminInfo.url,
                "avator": req.session.AdminInfo.avator
            }
        }
    )

});

router.get('/getUserList', async (req, res, next) => {
    let { page, limit, userId, userName } = req.query;
    let count = await getUserCount();
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 1,
            data: "The data has been loaded"
        });
    }
    var num = (page - 1) * limit;
    let data = await getUserList(num, limit, {
        userId, username: userName
    });
    res.json({
        code: 0,
        data: data.data,
        count: data.count
    })
})

router.get('/GetUsersById', async (req, res, next) => {
    let id = req.query.editNo;
    let data = await GetUsersById(id);
    res.json({
        code: 1,
        data
    })
})

router.get('/DeleteUserById', async (req, res, next) => {
    let id = req.query.userId;
    let data = await DeleteUserById(id);
    res.json({
        code: 1,
        data
    })
})

router.post('/UpdateAdminPassById', async (req, res, next) => {
    let { oldPsw, newPsw } = req.body;
    let id = req.session.AdminInfo.userId;
    let username = req.session.AdminInfo.username;
    let admin = await isAdminLogin({
        username,
        password: oldPsw
    });
    if (admin.length) {
        await UpdateAdminById(id, {
            password: newPsw
        })
        return res.json({
            code: 200,
            msg: "Password modification succeeded"
        })
    } else {
        return res.json({
            code: 500,
            msg: "Old password error"
        })
    }
})

router.get('/GetAdminList', async (req, res, next) => {
    let { page, limit, id, name } = req.query;
    let count = await getAdminCount();
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 1,
            data: "The data has been loaded"
        });
    }
    var num = (page - 1) * limit;
    let data = await GetAdminList(num, limit, {
        id, name
    });
    res.json({
        code: 0,
        data: data.data,
        count: data.count
    })
})

router.get('/GetAdminById', async (req, res, next) => {
    let id = req.query.editNo;
    let data = await GetAdminById(id);
    res.json({
        code: 1,
        data
    })
})

router.post('/UpdateAdminById', upload.single('url'), async (req, res, next) => {
    let { id, name, password, sex, url } = req.body;
    console.log(req.file)
    url = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
    let data = await UpdateAdminById(id, { name, password, sex, url });
    res.json({
        code: 1,
        data
    })
})

router.post('/DeleteAdminById', async (req, res, next) => {
    let { id } = req.body;
    await DeleteAdminById(id);
    res.json({
        code: 1,
        data: "Deletion succeeded"
    })
})

router.post('/addAdmin', upload.single('url'), async (req, res, next) => {
    let { name, password, sex, url } = req.body;
    url = req.file ? urlf2z(`${req.protocol}://${req.headers.host}/${req.file.path}`) : '';
    let data = await addAdmin({ name, password, sex, url });
    res.json({
        code: 1,
        data
    })
})

router.post('/uploadSwiperImg', upload.single('file'), async (req, res, next) => {
    let url = `${req.protocol}://${req.headers.host}/${req.file.path}`;
    url = urlf2z(url)
    let data;
    if (req.body.swiperId) {
        data = await updataSwiperImg(req.body.swiperId, {
            swiperurl: url
        })
    } else {
        data = await uploadSwiperImg({
            swiperurl: url
        })
        await updataSwiperImg(data.insertId, {
            swiperIndex: data.insertId
        })
    }
    res.json({
        code: 1,
        url: url,
        swiperId: data.insertId
    })
})

router.get('/getSwiperList', async (req, res, next) => {
    let data = await getSwiperList();
    res.json({
        code: 1,
        data
    })
})

router.post('/deleteSwiperById', async (req, res, next) => {
    let { swiperId } = req.body;
    await deleteSwiperById(swiperId);
    res.json({
        code: 1,
        data: "Deletion succeeded"
    })
})

router.post('/updataSwiperWz', async (req, res, next) => {
    let { swiperId, toswiperId } = req.body
    let arr = []
    let swiperIndex = await getSwiperIdByIndex(swiperId)
    let toswiperIndex = await getSwiperIdByIndex(toswiperId)
    arr.push({
        swiperId: swiperId,
        swiperIndex: toswiperIndex
    }, {
        swiperId: toswiperId,
        swiperIndex: swiperIndex
    })
    await updataSwiperWz(arr)
    res.json({
        code: 1,
        data: "Modification succeeded"
    })
})

router.get('/GetGoodsList', async (req, res, next) => {
    let { page, limit, id, name } = req.query;
    limit = Number(limit);
    let count = await getGoodsCount();
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 0,
            data: []
        });
    }
    var num = (page - 1) * limit;
    let data = await GetGoodsList(num, limit, {
        id, name
    });
    res.json({
        code: 0,
        data: data.data,
        count: data.count
    })
})

router.get('/GetGoodsById', async (req, res, next) => {
    let id = req.query.editNo;
    let data = await GetGoodsById(id);
    res.json({
        code: 1,
        data: FormatData(data, {
            urlList: 'json'
        })
    })
})

router.post('/DeleteGoodsById', async (req, res, next) => {
    let { id } = req.body;
    await DeleteGoodsById(id);
    res.json({
        code: 1,
        data: "Deletion succeeded"
    })
})

router.post('/UpdateGoods', upload.array('url', 10), async (req, res, next) => {
    let { id, name, porice, stock, info, urlList } = req.body;
    let ImgListUpdate = urlf2zList(req);
    urlList = JSON.parse(urlList);
    urlList = urlList.concat(ImgListUpdate);
    let url = urlList[0];
    urlList = JSON.stringify(urlList);
    await UpdateGoods(id, {
        name, porice, info, url, urlList, stock
    })
    res.json({
        code: 1,
        data: "Modification succeeded"
    })
})

router.post('/addGoods', upload.array('urlList', 10), async (req, res, next) => {
    let countFile = req.files.length;
    let { name, porice, info } = req.body;
    if (countFile === 0) {
        return res.json({
            code: 0,
            msg: "Upload at least one picture"
        })
    }
    let urlList = urlf2zList(req);
    let url = urlList[0];
    urlList = JSON.stringify(urlList);
    await addGoods({
        name, url, urlList, porice, info
    })
    res.json({
        code: 1,
        data: "Successfully added"
    })

})

router.get('/getIndexCount', async (req, res, next) => {
    let adminNum = await getAdminCount();
    let goodsNum = await getGoodsCount();
    let cardtNum = await getCardCount();
    let userNum = await getUserCount();
    res.json({
        code: 1,
        adminNum, goodsNum, cardtNum, userNum
    })
})

router.get('/getCpuTable', async (req, res, next) => {
    var freeMem = os.freemem() / 1024 / 1024 / 1024;
    var totalMem = os.totalmem() / 1024 / 1024 / 1024;
    res.json({
        code: 1,
        CpuNum: ((freeMem) / totalMem * 100.0).toFixed(2)
    })
})

router.get('/getuserNumTable', async (req, res, next) => {
    let DayList = [];
    for (var i = 1; i <= 7; i++) {
        DayList.push(moment().isoWeekday(i))
    }
    let { count, data } = await getUserListWord();
    let userNum = []
    DayList.forEach(dayItem => {
        let sunNum = 0;
        data.forEach(item => {
            if (dayItem.isSame(item.userTime, 'day')) {
                sunNum++;
            }
        })
        userNum.push(sunNum)
    })

    res.json({
        code: 1,
        userNum: userNum,
        count: count
    })

});

router.get('/getCardList', async (req, res, next) => {
    let { page, limit, name } = req.query;
    let count = await getCardCount();
    let pageNum = Math.ceil((count / limit));
    if (page > pageNum) {
        return res.json({
            code: 1,
            data: "The data has been loaded"
        });
    }
    var num = (page - 1) * limit;
    let data = await getCardList(num, limit, {});

    for (let j = 0; j < data.data.length; j++) {
        let item = data.data[j]
        let comm = JSON.parse(item.comm)
        if (name) {
            let flog = false
            flog = comm.some((item) => item.name.indexOf(name))
            if (flog) {
                data.data.splice(j, 1)
                j--
                break;
            }
        }
        let sum = 0
        for (let i = 0; i < comm.length; i++) {
            let goods = comm[i]
            let info = await GetGoodsById(goods.id)
            sum += Number(info[0] ? info[0].porice : 0)
        }
        item.sum = sum
        item.comm = comm
    }

    res.json({
        code: 0,
        data: data.data,
        count: data.count
    })
})

router.get('/DeleteCardById', async (req, res, next) => {
    var id = req.query.id;
    let goods = await getCardById(id)
    let comm = JSON.parse(goods[0].comm)
    await DeleteCardById(id);
    //Increase inventory 增加库存
    let prList = comm.map(async (pro) => {
        await changeStock(pro.id, {
            stock: Number(pro.number)
        })
    })
    await Promise.all(prList)
    res.json({
        code: 1,
        data: "Deletion succeeded"
    })
})

router.get('/DeliverCardById', async (req, res, next) => {
    var id = req.query.id;
    await DeliverCardById(id);
    res.json({
        code: 1,
        data: "Shipment succeeded"
    })
})

router.post('/cart_list', async (req, res, next) => {
    let { goodsList } = req.body
    for (let i = 0; i < goodsList.length; i++) {
        const goods = goodsList[i];
        let [info] = await GetGoodsById(goods.id)
        info.urlList = JSON.parse(info.urlList)
        goodsList[i] = Object.assign(info, goods)
    }
    return res.json({
        code: 1,
        data: goodsList
    })
})
module.exports = router;