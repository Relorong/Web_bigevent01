$(function () {
    // 1.自定义校验规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            var v2 = $('[name=oldPwd]').val()
            if (value === v2) {
                return '不能使用设置过的密码!'
            }
        },
        rePwd: function (value) {
            var v3 = $('[name=newPwd]').val()
            if (value !== v3) {
                return '请保持确认密码与新密码保持一致!'
            }
        }
    })

    //2.修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您,密码修改成功!')
                //原生DOM表单重置
                $('.layui-form')[0].reset()
            }
        })
    })
})