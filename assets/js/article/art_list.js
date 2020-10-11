$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //1.定义查询参数
    var q = {
        pagenum: 1,   //必选参数 int 页码值
        pagesize: 2,   //必选参数 int 每页显示多少条数据
        cate_id: "",   //可选参数 string 文章分类的 Id
        state: "",   //可选参数	string 文章的状态，可选值有：已发布、草稿
    }

    //2.初始化文章列表
    initArtList()
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                //渲染分页
                renderPage(res.total)
            }
        })
    }

    //3.定义时间美化过滤器
    template.defaults.imports.dateFormate = function (dateStr) {
        var date = new Date(dateStr)

        var y = date.getFullYear();
        var m = padZero(date.getMonth() + 1);
        var d = padZero(date.getDate());

        var hour = padZero(date.getHours());
        var min = padZero(date.getMinutes());
        var sec = padZero(date.getSeconds());

        return y + '-' + m + '-' + d + '  ' + hour + ':' + min + ':' + sec
    }

    //4.定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //5.初始化分类下拉菜单
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
                //因为模版引擎渲染的是section内容,页面显示的是dl中的内容,layui获取不到dl中的内容会默认没有选项,自动给section中添加一个选项
                form.render()
            }
        })
    }

    //6.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initArtList()
    })

    //7.渲染分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 20],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initArtList()
                }
            }
        });
    }

    //8.删除文章
    $('tbody').on('click', '.btnDelete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                data: id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    // var len = $('.btnDelete').length;
                    // if (len == 1) {
                    //     q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    // }
                    //第二种写法
                    if ($('.btnDelete').length == 1 && q.pagenum > 1) q.pagenum--;
                    layer.msg('删除文章成功!')
                    initArtList()
                    layer.close(index);
                }
            })

        });
    })


    //ps:编辑功能
    /* $('tbody').on('click', '#btnEdit', function () {
        var id = $(this).attr('data-id')
        layer.open({
            title: '在线调试',
            content: '可以填写任意的layer代码'
        });
    }) */


})