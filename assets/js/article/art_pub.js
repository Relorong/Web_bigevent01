$(function () {
    var layer = layui.layer;
    var form = layui.form;

    //1.初始化分类
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //2.初始化富文本编辑器
    initEditor()

    //3.1. 初始化图片裁剪器
    var $image = $('#image')

    //3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    //4.上传封面照片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //5.更新裁剪区域照片
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        if (files.length == 0) {
            return layer.msg("请选择文件")
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    //6.设置文章状态
    var art_state = "已发布"
    $('#btnSave2').on('click', function () {
        art_state = "草稿"
    })

    //7.提交文章内容
    $('#formPub').on('submit', function (e) {
        e.preventDefault();
        //7.1 创建FormData数据
        var fd = new FormData(this)
        //7.2 添加状态参数
        fd.append('state', art_state)
        //7.3 添加图片参数
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // console.log(...fd);
                //7.4 发送ajax
                publishArticle(fd)
            })
    })

    //8.文章提交函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章提交失败!")
                }
                layer.msg("恭喜您,文章提交成功,页面跳转中.....")
                // location.href('/article/at_list.html')
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click()
                }, 2000)
            }
        })
    }
})