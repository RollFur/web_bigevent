$(function() {
    var form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格。'],
        samePwd: function(value) {
            if (value === $("[name=oldPwd]").val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码不一致';
            }
        }
    });
    $(".layui-form").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(response) {
                if (response.status !== 0) {
                    console.log(response);
                    return layui.layer.msg(response.message);
                }
                layui.layer.msg("更新密码成功");
                // 重置表单 原生DOM 对象
                $(".layui-form")[0].reset()
            }
        });
    })



})