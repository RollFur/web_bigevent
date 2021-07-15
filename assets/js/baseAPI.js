// 每次调用 $.get  或 $.post 或 $.ajax 的时候 
// 会先调用 ajaxPrefileter 
// 这个函数  在这个函数中 可以拿到我们给ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    // 再发起 真正的 ajax 请求之前 统一拼接 请求的根路径
    options.url = "http://api-breakingnews-web.itheima.net" + options.url
    console.log(options.url);
})