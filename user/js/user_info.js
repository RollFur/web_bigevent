$(function() {
    var form = layui.form;

    form.verify({
        nackname: function(value) {
            if (value.length > 6) {
                return '昵称必须在1 ~ 6 个字符之间！';
            };
        }
    });
    initUserInfo();
    // TODO:初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            success: function(response) {
                if (response.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(response);
                // 调用form.val()快速为表单赋值
                form.val("formUserInfo", response.data)
            }
        });
    };
    // TODO:重置表单数据
    $(".btnReset").on("click", function(e) {
        e.preventDefault();
        initUserInfo()
    });
    // 监听表单的提交事件
    $(".layui-form").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg("更新用户信息成功");
                // 调用父页面中的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        });
    })
})