$(function () {

    //1.自定义表单校验
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度在1-6位之间!"
            }
        }
    })

    //2.初始化用户信息
    initUserInfo()
    //初始化用户信息封装函数,后面还会用到
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    }

    //3.表单重置
    $('#reset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()
    })

    //4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POSt',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您,修改用户信息成功!')
                window.parent.getUserInfo()
            }
        })
    })

})