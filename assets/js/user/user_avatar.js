// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

//2.上传头像
$('#btnChooseImage').on('click', function () {
    $('#file').click()
})

//3.更换裁减区头像
$('#file').on('change', function (e) {
    // console.log(e);
    var files = e.target.files; //解决冒泡问题
    // var files = $(this).files
    if (files.length == 0) {
        return layui.layer.msg('上传头像不能为空!')
    }
    //1.拿到用户选择的文件
    var file = e.target.files[0]
    //2.根据选择的文件，创建一个对应的 URL 地址：
    var newImgURL = URL.createObjectURL(file)
    //3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
})

//4.更新页面头像
$('#btnUpload').on('click', function () {
    //将获取的图像转码
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('头像上传失败!')
            }
            console.log(res);
            layui.layer.msg('恭喜您,头像上传成功!')
            window.parent.getUserInfo()
        }
    })
})

//5.设置头像默认值
//渲染默认头像
getUserInfo()
function getUserInfo() {
    $.ajax({
        // 默认的请求方式为get
        // method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //渲染用户信息
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', res.data.user_pic)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        },
    })
}