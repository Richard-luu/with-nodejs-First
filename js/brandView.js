$(function () {
    isLogin();
    getInfo();
    changePage();
});

//判断是否登录和页面跳转
function isLogin() {
    var str = decodeURI(decodeURI(window.location.href)).split("?")[1];
    if (str) {
        var reg = /[a-zA-Z0-9\u4e00-\u9fa5]/g;
        var hrefStr = str
            .split("=")[1].match(reg).join('');
        var user = localStorage.getItem(hrefStr);
        var userJosn = JSON.parse(user);
        if (userJosn) {
            if (userJosn[0].isAdmin) {
                $("#wellcome").text("欢迎您-" + hrefStr + "(管理员)");
            } else {
                $("#wellcome").text("欢迎您-" + hrefStr + "(普通用户)");
                $("#viewUser").hide();
                $("#userMana").hide();
                $("#brandMana").show();
            }
            $('#viewUser').on('click', function () {
                location.href = 'userView.html?nicik=' + hrefStr;
            });
            $('#viewPhone').on('click', function () {
                location.href = 'phoneView.html?nicik=' + hrefStr;
            });
        } else {
            alert("您还没登录！请先登录");
            location.href = "login.html";
            return;
        }

    } else {
        alert("您还没登录！请先登录");
        location.href = "login.html";
        return;
    }
}

//弹出新增框
$("#addBtn").on("click", function () {
    $(".newBrand").show();
});

//确认新增
function addBrandSubmit() {
    // var logo = $("input[name='bradnLogo']").files;
    var logo = document.getElementById("brandLogo").files[0];
    var brandName = $("#brandName").val();

    var formData = new FormData();
    //这里的input标签是file的name要对应，即name为brandLogo，
    //这里也要是brandLogo.后台文件处理upload.single('brandLogo')也要对应。
    formData.append("brandLogo", logo);
    formData.append("brandName", brandName);
    if (logo && brandName) {
        $.ajax({
            type: "post",
            url: "http://127.0.0.1:3000/api/addBrand",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == -1) {
                    alert(res.msg);
                    return false;
                } else {
                    alert(res.msg);
                    $(".newBrand").hide();
                    //先清空原来得数据
                    $("#tbodyBrand")
                        .children()
                        .remove();
                    //重新渲染数据
                    getInfo();
                    return false;
                }
            }
        });
    } else {
        alert("不能留空");
        return false;
    }
    return false;
}

//取消新增
function exitBrandAdd() {
    $(".newBrand").hide();
    return false;
}

//删除和修改
$("#tbodyBrand").on("click", function (e) {
    var e = e || event;
    var target = e.target || e.SrcElement;
    if (target.nodeName.toLowerCase() == "a") {
        var id =
            target.parentNode.parentNode.firstElementChild.nextElementSibling
            .innerText;
        //删除
        if (target.className.indexOf("del") !== -1) {
            $.ajax({
                type: "get",
                url: "http://127.0.0.1:3000/api/brandDelete",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.code == -1) {
                        alert("删除失败");
                        return;
                    } else {
                        target.parentNode.parentNode.remove();
                        alert("删除成功");
                        //先清空原来得数据
                        $("#tbodyBrand")
                            .children()
                            .remove();
                        //重新渲染数据
                        getInfo();
                        return;
                    }
                }
            });
        }
        //修改,获取后台当前用户数据
        if (target.className.indexOf("updateBrand") !== -1) {
            $("#brandUpdate").show();
            // 拿到用户数据
            $.ajax({
                type: "post",
                url: "http://127.0.0.1:3000/api/getBrandUpdate",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.code == -1) {
                        alert(res.msg);
                        return;
                    } else {
                        //渲染拿到的数据
                        var brandData = res.data.info[0];
                        $(".id").val(id);
                        $("#updateBrandName").val(brandData.brandName);
                        return;
                    }
                }
            });
        }
    }
});

//点击确定修改
function updateBrandSubmit(e) {
    var logo = document.getElementById("updateBrandLogo").files[0];
    var brandName = $("#updateBrandName").val();
    var id = e.parentNode.parentNode.firstElementChild.value;
    var formData = new FormData();
    formData.append("id", id);
    formData.append("brandLogo", logo);
    formData.append("brandName", brandName);
    if (logo) {
        // alert("确认修改吗?");
        $.ajax({
            type: 'post',
            url: "http://127.0.0.1:3000/api/brandUpdate",
            data: formData,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == -1) {
                    alert(res.msg);
                    return false;
                } else {
                    alert(res.msg);
                    //隐藏修改面板
                    $('#brandUpdate').hide();
                    //更新数据列表
                    $('#tbodyBrand').children().remove();
                    getInfo();
                    return false;
                }
            }
        });
    } else {
        alert("请选择图片！");
        return false;
    }
    return false;
}

//取消修改
function updateBrandExit() {
    $("#brandUpdate").hide();
    return false;
}

//退出
$("#exit").on("click", function () {
    localStorage.clear();
    location.href = "login.html";
});

// 数据渲染
function getInfo(page, pageSize) {
    page = page || 1;
    pageSize = pageSize || 5;
    $.ajax({
        type: "post",
        url: "http://127.0.0.1:3000/api/allBrand",
        data: {
            page: page,
            pageSize: pageSize
        },
        success: function (res) {
            if (res.code == -1) {
                alert(res.msg);
            } else {
                var brandData = res.data.info;
                var str = "";
                for (var i = 0; i < brandData.length; i++) {
                    var url = "http://localhost:3000/" + brandData[i].logo;
                    var urldecodeURI = decodeURI(decodeURI(url));
                    str += `
                    <tr>
                    <th scope="row">${i + 1}</th>
                    <td class="noneId">${brandData[i]._id}</td>
                    <td class="img_row">
                        <img src=${urldecodeURI} alt="">
                    </td>
                    <td>${brandData[i].brandName}</td>
                    <td><a href="#" id="updateBrand" class="updateBrand">修改</a> <a href="#" id="del" class="del">删除</a></td>
                  </tr>
                    `;
                }
                $("#tbodyBrand").append(str);
            }
        }
    });
}

//分页
function changePage() {
    var page = 1;
    var pageSize = 5;
    $.post("http://127.0.0.1:3000/api/allBrand", {
        page: page,
        pageSize: pageSize
    }, function (res) {
        if (res.code === 1) {
            var toPrev = $("#toPrev");
            var toNext = $("#toNext");
            var totalPage = res.data.totalPage;
            var pageStr = "";
            //通过总页数，循环出多少个li就是多少页
            for (var j = 0; j < totalPage; j++) {
                pageStr += `
                        <li class="page">
                            <a href="#">${j + 1}</a>
                        </li>
                    `;
            }
            toPrev.after(pageStr);
            //添加默认第一页的样式
            var pageOne = $(".page").first();
            pageOne.addClass("active");
            var pages = $(".page");
            var pageLi = $("#NPli li");
            var index = 1;
            //所有页面的点击事件
            pages.click(function () {
                $(this).addClass("active").siblings().removeClass("active");
                //得parseInt一下,否则会出现index !== totalPage的情况.
                index = parseInt($(this).text());
                $('#tbodyBrand').children().remove();
                getInfo($(this).text(), 5);
            });
            //向左按钮的点击事件
            toPrev.click(function () {
                //console.log(index);
                if (index === 1) {
                    index = totalPage;
                    $('#tbodyBrand').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                    return false;
                } else {
                    index--;
                    $('#tbodyBrand').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                }
            });
            //向右按钮的点击事件
            toNext.click(function () {
                if (index === totalPage) {
                    index = 1;
                    $('#tbodyBrand').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                    return false;
                } else {
                    index++;
                    $('#tbodyBrand').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                }
            });
        }
    });

}