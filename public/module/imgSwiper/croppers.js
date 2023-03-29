/*!
 * Cropper v3.0.0 Image editing plugin 图片编辑插件
 */

layui.define(['jquery', 'layer', 'cropper', 'config'], function (exports) {
    var $ = layui.jquery
        , layer = layui.layer,
        config = layui.config;
    var html = "<link rel=\"stylesheet\" href=\"/module/imgSwiper/cropper/cropper.css\">\n" +
        "<div class=\"layui-fluid showImgEdit\" style=\"display: none\">\n" +
        "    <div class=\"layui-row layui-col-space15\" style=\" margin-top:10px; \">\n" +
        "        <div class=\"layui-col-xs9\">\n" +
        "            <div class=\"readyimg\" style=\"height:450px;background-color: rgb(247, 247, 247);\">\n" +
        "                <img src=\"\" >\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"layui-col-xs3\" style=\"height:200px\">\n" +
        "            <div class=\"img-preview\" style=\"width:200px;height:200px;overflow:hidden\">\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"layui-col-xs3\" style=\"height:150px\">\n" +
        "            <div class=\"img-preview\" style=\"width:150px;height:150px;overflow:hidden\">\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"layui-col-xs3\" style=\"height:100px\">\n" +
        "            <div class=\"img-preview\" style=\"width:100px;height:100px;overflow:hidden\">\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "    <div class=\"layui-row layui-col-space15\">\n" +
        //"        <div class=\"layui-col-xs9\">\n" +
        //"            <div class=\"layui-row\">\n" +
        "                <div >\n" +
        "                    <button type=\"button\" class=\"layui-btn\" cropper-event=\"rotate\" data-option=\"90\" title=\"Rotate 90 degrees\" style=\"font-size:12px !important;\">Turn 90 degrees clockwise</button>\n" +
        "                    <button type=\"button\" class=\"layui-btn\" cropper-event=\"rotate\" data-option=\"-90\" title=\"Rotate -90 degrees\" style=\"font-size:12px !important;\"> Rotate 90 degrees counterclockwise</button>\n" +
        "                    <button type=\"button\" class=\"layui-btn\" cropper-event=\"setDragMode\" title=\"Move the picture\" style=\"font-size:12px !important;\">Move the picture</button>\n" +
        "                    <button type=\"button\" class=\"layui-btn\" cropper-event=\"setDragMode1\" title=\"Crop the picture\" style=\"font-size:12px !important;\">Crop the picture</button>\n" +
        "                    <button type=\"button\" class=\"layui-btn\" cropper-event=\"zoomLarge\" title=\"Enlarge the image\" style=\"font-size:12px !important;\">Enlarge the image</button>\n" +
        "                    <button type=\"button\" class=\"layui-btn\" cropper-event=\"zoomSmall\" title=\"Zoom out of the picture\" style=\"font-size:12px !important;\">Zoom out of the picture</button>\n" +
        "                    <button type=\"button\" class=\"layui-btn\" cropper-event=\"reset\" title=\"Reset the picture\" style=\"font-size:12px !important;\">Reset the picture</button>\n" +
        "                    <button type=\"button\" class=\"layui-btn layui-bg-red\" cropper-event=\"confirmSave\" type=\"button\" style=\"font-size:12px !important;\"> Save the modifications</button>\n" +
        "                </div>\n" +
        "    </div>\n" +
        "\n" +
        "</div>";
    var obj = {
        render: function (e) {
            var self = this,
                //elem = e.elem,
                saveW = e.saveW,
                saveH = e.saveH,
                mark = e.mark,
                area = e.area,
                url = e.url,
                imgUrl = e.imgUrl,
                done = e.done;
            swiperId = e.swiperId
            $('#cropperdiv').html("");
            $('#cropperdiv').append(html);
            $(".showImgEdit .readyimg img").attr('src', imgUrl);

            var content = $('.showImgEdit')
                , image = $(".showImgEdit .readyimg img")
                , preview = '.showImgEdit .img-preview'
                , file = $(".showImgEdit input[name='file']")
                , options = { aspectRatio: mark, preview: preview, viewMode: 1 };

            var openbox = layer.open({
                title: "Image cropping"
                , type: 1
                , content: content
                , area: area
                , shade: false
                , success: function () {
                    image.cropper(options);
                }
                , cancel: function (index) {
                    layer.close(index);
                    image.cropper('destroy');
                }
            });
            $(".layui-btn").on('click', function () {
                var event = $(this).attr("cropper-event");
                //Monitor to confirm saving the image 监听确认保存图像
                if (event === 'confirmSave') {
                    image.cropper("getCroppedCanvas", {
                        width: saveW,
                        height: saveH
                    }).toBlob(function (blob) {
                        var formData = new FormData();
                        var timestamp = Date.parse(new Date());
                        formData.append('file', blob, timestamp + '.jpeg');
                        formData.append('swiperId', swiperId)
                        $.ajax({
                            method: "post",
                            url: config.base_server + 'uploadSwiperImg', //The server-side request address used for file upload 用于文件上传的服务器端请求地址
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (obj) {
                                console.log(obj)
                                //Save the picture to return the representation 保存图片返回表示
                                if (obj.code == 1) {//success 成功
                                    layer.msg(obj.msg, { icon: 1 });
                                    parent.layer.closeAll();
                                    return done(obj.url);//Return to the image src 返回图片src
                                } else if (obj.code == 0) {
                                    layer.alert(obj.data, { icon: 2 });
                                }

                            }
                        });
                    }, 'image/jpeg');
                    //Monitor rotation 监听旋转
                } else if (event === 'rotate') {
                    var option = $(this).attr('data-option');
                    image.cropper('rotate', option);
                    //Reset the picture 重设图片
                } else if (event === 'reset') {
                    image.cropper('reset');
                }
                else if (event === 'zoomLarge') {
                    image.cropper('zoom', 0.1);
                }
                else if (event === 'zoomSmall') {
                    image.cropper('zoom', -0.1);
                }
                else if (event === 'setDragMode') {
                    image.cropper('setDragMode', "move");
                }
                else if (event === 'setDragMode1') {
                    image.cropper('setDragMode', "crop");
                }
                //File selection 文件选择
                file.change(function () {
                    var r = new FileReader();
                    var f = this.files[0];
                    r.readAsDataURL(f);
                    r.onload = function (e) {
                        image.cropper('destroy').attr('src', this.result).cropper(options);
                    };
                });
            });
        }

    };
    exports('croppers', obj);
});