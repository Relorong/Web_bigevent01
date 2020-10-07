// 开发服务器地址
var baseUrl = 'http://ajax.frontend.itheima.net';
// 生产环境地址
// var baseUrl = 'http://ajax.frontend.itheima.net';
// 测试环境地址
// var baseUrl = 'http://ajax.frontend.itheima.net';

//拦截所有ajax请求: get/post/ajax
// 处理参数
$.ajaxPrefilter(function (options) {
    options.url = baseUrl + options.url
})