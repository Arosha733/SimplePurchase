var multer = require('multer');
let methodsFile = {
    'public/img/admin/admin': [
        '/admin/UpdateAdminById',
        '/admin/addAdmin'
    ],
    'public/img/user/swiper': [
        '/admin/uploadSwiperImg'
    ],
    'public/img/admin/goods': [
        '/admin/addGoods',
        '/admin/UpdateGoods'
    ]
}
var storage = multer.diskStorage({
    //将上传的文件存储在指定的位置（不存在的话需要手动创建）
    destination: function (req, file, cb) {
        let url = '';
        console.log(req.originalUrl)
        Object.entries(methodsFile).forEach(item => {
            if (item[1].indexOf(req.originalUrl) >= 0) {
                url = item[0];
            }
        })
        cb(null, url || 'public/img/admin')
    },
    //将上传的文件做名称的更改
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage: storage })

module.exports = upload;