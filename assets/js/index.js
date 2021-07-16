$(function() {
    var layer = layui.layer;
    // 调用和 getUserInfo
    getUserInfo();


    // TODO: 点击按钮 实现退出
    $('.btnLogout').on('click', function() {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //do something
            console.log('ok');
            // 1. 清空本体储存中的 token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html';
            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
});
// TODO: 获取用户信息
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token' || "")
        // },
        success: function(response) {
            if (response.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用 renderAvatar()
            renderAvatar(response.data);
        },
        // 不论成功还是失败 最终都会 调用 complete 回调函数
        // complete: function(res) {
        //     // 在 complete 回调函数总 可以使用 res.responseJSON 拿到服务器 响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制情况token
        //         localStorage.removeItem("token");
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html';
        //         // console.log(res);

        //     }
        // }
    });
};
// TODO:s渲染用户头像
function renderAvatar(user) {
    // 1. 获取用户名称
    var name = user.nickname || user.username;
    // 2. 设置欢迎文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3. 按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('scr', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();

    }


}