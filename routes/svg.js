
const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();

router.get('/', (req, res) => {
  const cap = svgCaptcha.create({
    //Invert colors 反转颜色
    inverse: false,
    //Font size 字体大小
    fontSize: 36,
    //Number of noise lines 噪声线条数
    noise: 3,
    //width 宽度
    width: 80,
    //height 高度
    height: 30
    // ,color: true
    , background: '#ccc'
  });
  req.session.captcha = cap.text; // session Stores the verification code value
  res.type('svg'); //The type of response 响应的类型
  res.send(cap.data)
})

module.exports = router;