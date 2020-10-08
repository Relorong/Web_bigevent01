// 入口函数
$(function () {
    getUserInfo()
    //退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1.删除本地存储的token值
            localStorage.removeItem('token')
            //2.跳转login页面
            location.href = '/login.html'
            //3.关闭询问框
            layer.close(index);
        });
    })
})

// 封装获取信息函数,要获得全局变量
function getUserInfo() {
    $.ajax({
        // 默认的请求方式为get
        // method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //渲染用户信息
            renderAvatar(res.data)
            console.log(res.data);
        },
        /* complete: function (res) {
            console.log(res);
            //身份认证失败
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //1.删除本地token值
                localStorage.removeItem('token')
                //2.页面跳转
                location.href = '/login.html'
            }
        } */
    })
}

//封装渲染用户信息函数
function renderAvatar(user) {
    //1.渲染用户名 
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎" + name)
    //2.渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.user-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.user-avatar').show().html(text)
    }
}
