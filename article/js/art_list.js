$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化 时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 定义 补零操作
    function padZero(n) {
        return n > 9 ? n : "0" + n;
    }



    // 定义一个查询的参数对象 请求数据的时候 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 文字分类的 Id
        state: '' // 文章发布的状态
    }
    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function(response) {
                if (response.status !== 0) {
                    return layer.msg('获取文字列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", response);
                // console.log(template("tpl-table", response.data));
                // console.log(htmlStr);
                $("tbody").html(htmlStr);


                renderPage(response.total)
            }
        });
    };
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function(response) {
                // console.log(response);
                if (response.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }

                var htmlStr = template('tpl-cate', response);
                $('[name=cate_id]').html(htmlStr);
                // console.log(response);
                form.render();
            }
        });
    };
    // 为表单绑定submit 事件
    $('.form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值

        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格数据
        initTable();
    });

    // 定义渲染分页方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到，
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认选择的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 切换 条目数也会触发 jump 
            limits: [2, 3, 5, 10],

            //分页发生切换时 触发 jump 回调
            // 触发jump 回调方式有两种：
            // 1. 点击页码的时候 ，会触发jump 回调
            // 2. 只要调用了  laypage.render() 方法就会触发 jump回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值 为 true 证明 时方式二 （initTable()）触发的
                // 否则就是方式 1（laypage.render()） 触发的
                // console.log(first);
                // console.log(obj.curr);
                // 把最新的页码值， 赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的pagesize 属性中
                q.pagesize = obj.limit;
                // 根据最新的 q 获取对应的数据列表 并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        });

    }
    // 通过代理的形式，为删除按钮绑定点击事件

    $('tbody').on('click', '.btn-delete', function() {
        // 获取到文章的id
        var id = $(this).attr('data-id');
        // 获取删除按钮的个数
        var len = $('.btn-Del').length;
        // 询问用户是否要删除数据
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: "get",
                url: "/my/article/delete/" + id,
                success: function(response) {
                    if (response.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后 需要判断当前这一页中 是否还有剩余数据
                    // 如果没有剩余数据 则让页码值-1 之后 再调用initTable();
                    console.log(len);
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                            // q.pagenum = q.pagenum - 1
                        console.log(pagenum);
                    }
                    form.render();
                    initTable();

                }
            });
            layer.close(index);

        });
    })


    // $('tbody').on('click', '.btn-edit', function() {
    //     var id = $(this).attr('data-id')
    //     location.href = 'art_modify.html?id=' + id
    // $.ajax({
    //     type: "get",
    //     url: "/my/article/" + id,
    //     success: function(response) {
    //         console.log(response);

    //     }
    // });
    // })


})