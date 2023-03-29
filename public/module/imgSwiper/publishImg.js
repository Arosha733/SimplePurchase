//The picture moves 图片移动
function imgMove(obj) {
    var oUl = document.getElementById(obj);
    var aLi = oUl.getElementsByTagName("li");
    var disX = 0;
    var disY = 0;
    var minZindex = 1;
    var aPos = [];
    var leftbz = 0;
    var topbz = 0;
    for (var i = 0; i < aLi.length; i++) {
        if (leftbz == 5) {
            leftbz = 1;
            topbz += 1;
            var fdiv = (topbz + 1) * 140;
            oUl.style.height = fdiv + 'px';
        }
        else {
            leftbz += 1;
        }
       
        var l = 170 * (leftbz - 1) + 10;
        var t = 130 * topbz;

        aLi[i].style.top = t + "px";
        aLi[i].style.left = l + "px";
        aPos[i] = { left: l, top: t };
        aLi[i].index = i;

    }
    for (var i = 0; i < aLi.length; i++) {
        aLi[i].style.position = "absolute";
        aLi[i].style.margin = 0;
        setDrag(aLi[i]);
    }
    //Drag 拖拽
    function setDrag(obj) {
        obj.onmouseover = function () {
            obj.style.cursor = "move";
        }
        obj.onmousedown = function (event) {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            obj.style.zIndex = minZindex++;
            //Calculates the distance between the mouse and the dragged object when the mouse is pressed 当鼠标按下时计算鼠标与拖拽对象的距离
            disX = event.clientX + scrollLeft - obj.offsetLeft;
            disY = event.clientY + scrollTop - obj.offsetTop;
            document.onmousemove = function (event) {
                //The position of the div is calculated when the mouse is dragged 当鼠标拖动时计算div的位置
                var l = event.clientX - disX + scrollLeft;
                var t = event.clientY - disY + scrollTop;
                obj.style.left = l + "px";
                obj.style.top = t + "px";
               
                for (var i = 0; i < aLi.length; i++) {
                    aLi[i].className = "";
                }
                var oNear = findMin(obj);
                if (oNear) {
                    oNear.className = "active";
                }
            }
            document.onmouseup = function () {
                document.onmousemove = null;//Move out of the move event when the mouse bounces 当鼠标弹起时移出移动事件
                document.onmouseup = null;//Move out the up event and empty the memory 移出up事件，清空内存
                //Detect whether the general bumps in, in the swap position 检测是否普碰上，在交换位置
                var oNear = findMin(obj);
                if (oNear) {
                    $.ajax({
                        type: "POST",
                        url: layui.config.base_server + "updataSwiperWz",
                        data: { swiperId: obj.childNodes["0"].getAttribute('swiperid'), toswiperId: oNear.childNodes["0"].getAttribute('swiperid') },
                        dataType: "json",
                        success: (data) => {
                            if (data.code) {
                                oNear.className = "";
                                oNear.style.zIndex = minZindex++;
                                obj.style.zIndex = minZindex++;
                                startMove(oNear, aPos[obj.index]);
                                startMove(obj, aPos[oNear.index]);
                                //交换index
                                oNear.index += obj.index;
                                obj.index = oNear.index - obj.index;
                                oNear.index = oNear.index - obj.index;
                            }
                        }
                    });
                } else {
                    startMove(obj, aPos[obj.index]);
                }
            }
            clearInterval(obj.timer);
            return false;
        }
    }
    //Collision detection 碰撞检测
    function colTest(obj1, obj2) {
        var t1 = obj1.offsetTop;
        var r1 = obj1.offsetWidth + obj1.offsetLeft;
        var b1 = obj1.offsetHeight + obj1.offsetTop;
        var l1 = obj1.offsetLeft;

        var t2 = obj2.offsetTop;
        var r2 = obj2.offsetWidth + obj2.offsetLeft;
        var b2 = obj2.offsetHeight + obj2.offsetTop;
        var l2 = obj2.offsetLeft;

        if (t1 > b2 || r1 < l2 || b1 < t2 || l1 > r2) {
            return false;
        } else {
            return true;
        }
    }
    //The Pythagorean theorem finds distance 勾股定理求距离
    function getDis(obj1, obj2) {
        var a = obj1.offsetLeft - obj2.offsetLeft;
        var b = obj1.offsetTop - obj2.offsetTop;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }
    //Find the closest one 找到距离最近的
    function findMin(obj) {
        var minDis = 999999999;
        var minIndex = -1;
        for (var i = 0; i < aLi.length; i++) {
            if (obj == aLi[i]) continue;
            if (colTest(obj, aLi[i])) {
                var dis = getDis(obj, aLi[i]);
                if (dis < minDis) {
                    minDis = dis;
                    minIndex = i;
                }
            }
        }
        if (minIndex == -1) {
            return null;
        } else {
            return aLi[minIndex];
        }
    }
}
//Picture deletion 图片删除
function deleteElement(Obj) {
    var swiperId = Obj.parentNode.childNodes["0"].getAttribute('swiperid')
    layer.confirm('Really delete the picture?', function (index) {
        $.ajax({
            type: "POST",
            url: layui.config.base_server + "deleteSwiperById",
            data: { swiperId: swiperId },
            dataType: "json",
            success: (data) => {
                if (data.code) {
                    Obj.parentNode.parentNode.removeChild(Obj.parentNode);
                    layer.msg('The deletion was successful', {
                        icon: 1
                    });
                    layer.close(index);
                } else {
                    alert(data.info);
                    layer.close(index);
                }
            }
        });
    });

}
//description 描述
function divClick(obj) {
    layer.prompt({ title: 'Please fill in a new description and confirm', formType: 2 }, function (text, index) {
        obj.innerHTML = text;
        layer.close(index);
    });
}

//Image cropping 图片裁剪
function croppers_pic(obj) {
    var src = obj.parentNode.childNodes["0"].src;
    var swiperId = obj.parentNode.childNodes["0"].getAttribute('swiperid')
    layui.use(["croppers"], function () {
        var croppers = layui.croppers;
        croppers.render({
            area: ['900px', '600px']  //Pop-up width 弹窗宽度
            , imgUrl: src
            , swiperId: swiperId
            , url: "/user/upload.asp"  //The image upload interface returns the same JOSN as (layui's upload module). 图片上传接口返回和（layui 的upload 模块）返回的JOSN一样
            , done: function (url) { //Callback when the upload is complete 上传完毕回调
                //Change the picture src 更改图片src
                obj.parentNode.childNodes["0"].src = url;
            }
        });
    });
}