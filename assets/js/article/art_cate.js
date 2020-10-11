$(function () {
    //1.渲染文章类别
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('文章获取失败!')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //2.添加类别弹出层
    var indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1, //基本层类型:1（页面层）
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialogue-add').html()
        });
    })

    //3.添加文章分类(事件代理)
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('文章添加失败!')
                }
                //1.提示成功信息
                layer.msg('恭喜您,文章添加成功!')
                //2.添加文章
                initArtCateList()
                //3.关闭对话框
                layer.close(indexAdd)
            }
        })
    })

    //4.编辑-展示文章
    var indexEdit = null;
    $('tbody').on('click', '#btnEdit', function () {
        // 4.1 利用框架代码,显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1, //基本层类型:1（页面层）
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialogue-edit').html()
        });

        //4.2获取Id,发送ajax请求,渲染到页面
        var Id = $(this).attr('data-id')
        // alert(Id)
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                layui.form.val('form-edit', res.data)
            }
        })
    })

    //5.修改-提交文章
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //1.重新渲染页面
                initArtCateList();
                //2.弹出提示信息
                layer.msg('恭喜您,修改成功!')
                //3.关闭对话框
                layer.close(indexEdit);
            }
        })
    })

    //6.删除文章(通过事件代理)
    $('tbody').on('click', '#btnDelete', function () {
        var id = $(this).attr('data-id')
        // alert(id)
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //发送ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //1.重新渲染页面
                    initArtCateList()
                    //2.弹出提示信息
                    layer.msg(res.message)
                    //3.关闭对话框
                    layer.close(index);
                }
            })
        });
    })

})