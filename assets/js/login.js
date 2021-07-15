$(function() {
    // 点击"注册" 链接
    $('.link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();

    });

    // 点击"登录" 链接
    $('.link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();

    });


    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer
        // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义 了一个叫 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到 确认密码框内容

            // 还需要拿到密码框内容

            var pwd = $('.reg-box [name=password]').val();
            // 进行判断
            if (pwd !== value) {
                return '两次密码不一致'
            };
            // 判断失败 return 失败消息
        }
    });

    // 监听注册表单提交事件
    $('.form_reg').on("submit", function(e) {
        e.preventDefault();
        var data = { username: $('.form_reg [name=username]').val(), password: $('.form_reg [name=password]').val() };
        $.post("/api/reguser", data,
            function(res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg(res.message);
                }
                layer.msg("注册成功！");
                $('.link_login').click()
            }
        );
    });
    //监听登录表单提交事件
    $('.form_login').on('submit', function(e) {
        e.preventDefault();
        // var data = { username: $('form_login [name=username]'), password: $('form_login [name=password]') };
        // $.post("/api/login", data,
        //     function(res) {
        //         alert(res)
        //     }

        // );

        $.ajax({
            method: "post",
            url: "/api/login",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                console.log(res.token);

                // 将登陆成功得到的token 字段 保存到 localStorage 中
                localStorage.setItem('token', res.token)

                location.href = '/index.html'
            }
        });
    })
})