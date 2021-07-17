$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()
        // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(response) {
                var htmlStr = template('tpl-table', response)
                $('tbody').html(htmlStr);
            }
        });
    };
    var indexAdd = null;
    // 为添加类别绑定事件
    $('.btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['530px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()

        });
    });
    // 通过代理的形式为 form-add  表单绑定 submit 事件
    $('body').on("submit", ".form-add", function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(".form-add").serialize(),
            success: function(response) {
                if (response.status !== 0) {
                    return layer.msg("新增分类失败！");
                };
                initArtCateList();
                layer.msg("新增分类成功！");
                // 通过索引关闭弹出层
                layer.close(indexAdd);
            }
        });
    });
    // 通过代理的形式为 btn-edit 绑定事件 
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function() {
        // console.log('ok');
        // 弹出修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['530px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()

        });

        var id = $(this).attr('data-id');
        console.log(id);
        $.ajax({
            type: "get",
            url: "/my/article/cates/" + id,
            success: function(response) {
                if (response.status !== 0) {
                    return layer.msg("获取失败")
                }
                console.log(response.data);
                form.val('form-edit', response.data)
            }
        });
    });
    // 通过代理的形式 为修改分类 表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(response) {
                if (response.status !== 0) {
                    return layer.msg("更新分类数据失败")
                }
                layer.msg("更新分类数据成功");
                layer.close(indexEdit);
                initArtCateList()

            }
        });
    });
    // 通过代理的形式为 btn-edit 绑定事件 
    var indexDle = null;
    $("tbody").on("click", ".btn-del", function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除分类', { icon: 3, title: '提示' }, function(index) {
            //do something

            $.ajax({
                type: "get",
                url: "/my/article/deletecate/" + id,
                success: function(response) {
                    console.log(response);
                    if (response.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList()
                }
            });
        });

    });
})