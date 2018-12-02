$(function () {
    isLogin();
    getInfo();
    changePage();
    search();
});


//删除和修改
$('#tbodyUser').on('click', function (e) {
    var e = e || event;
    var target = e.target || e.SrcElement;
    if (target.nodeName.toLowerCase() == 'a') {
        var name = target.parentNode.parentNode.firstElementChild.nextElementSibling.nextElementSibling.innerText;
        //删除
        if (target.className.indexOf('del') !== -1) {
            $.ajax({
                type: 'get',
                url: "http://127.0.0.1:3000/api/userDelete",
                data: {
                    name: name
                },
                success: function (res) {
                    if (res.code == -1) {
                        alert("删除失败");
                        return;
                    } else {
                        target.parentNode.parentNode.remove();
                        alert('删除成功');
                        $('#tbodyUser').children().remove();
                        getInfo();
                        return;
                    }
                }
            });
        }
        //修改,获取后台当前用户数据
        if (target.className.indexOf('updateUser') !== -1) {
            $('#userUpdate').show();
            var id = target.parentNode.parentNode.firstElementChild.nextElementSibling.innerText;
            // 拿到用户数据
            $.ajax({
                type: 'post',
                url: "http://127.0.0.1:3000/api/getUserUpdate",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.code == -1) {
                        alert(res.msg);
                        return;
                    } else {
                        //渲染拿到的数据
                        var userData = res.data.info[0];
                        $('.id').val(id);
                        $("input[name='userName']").val(userData.name);
                        $("input[name='pwd']").val(userData.password);
                        $("input[name='nicik']").val(userData.nicik);
                        $("input[name='phone']").val(userData.phone);
                        $("input[name='age']").val(userData.age);
                        //男女还没做
                        // if ($("input[name='sex']").val() == userData.sex) {
                        //     console.log($("input[name='sex']"));
                        // }
                        return;
                    }
                }
            });
        }
        //查看
        if (target.className.indexOf('checkUser') !== -1) {
            $('#userCheck').show();
            var id = target.parentNode.parentNode.firstElementChild.nextElementSibling.innerText;
            // 拿到用户数据
            $.ajax({
                type: 'post',
                url: "http://127.0.0.1:3000/api/getUserUpdate",
                data: {
                    id: id
                },
                success: function (res) {
                    if (res.code == -1) {
                        alert(res.msg);
                        return;
                    } else {
                        //渲染拿到的数据
                        var userData = res.data.info[0];
                        $('.id').val(id);
                        $("input[name='userName']").val(userData.name);
                        $("input[name='pwd']").val(userData.password);
                        $("input[name='nicik']").val(userData.nicik);
                        $("input[name='phone']").val(userData.phone);
                        $("input[name='age']").val(userData.age);
                        //男女还没做
                        // if (userData.sex == '男') {
                        //     console.log($("input[name='sex']"));
                        //     $("input[name='sex']").eq(3).checked = true;
                        // }
                        return;
                    }
                }
            });
        }
    }
});

//点击确定修改
function userUpdateSubmit(e) {
    var userName = $("input[name='userName']").val();
    var pwd = $("input[name='pwd']").val();
    var nicik = $("input[name='nicik']").val();
    var phone = $("input[name='phone']").val();
    var age = $("input[name='age']").val();
    var sex = $("input[name='sex']:checked").val();
    var id = e.parentNode.parentNode.firstElementChild.value;
    if (userName && pwd && nicik && phone && age && sex) {
        // alert("确认修改吗?");
        $.ajax({
            type: 'post',
            url: "http://127.0.0.1:3000/api/userUpdate",
            data: {
                id: id,
                name: userName,
                pwd: pwd,
                nicik: nicik,
                phone: phone,
                age: age,
                sex: sex
            },
            success: function (res) {
                if (res.code == -1) {
                    alert(res.msg);
                    return false;
                } else {
                    alert(res.msg);
                    //隐藏修改面板
                    $('#userUpdate').hide();
                    //更新数据列表
                    $('#tbodyUser').children().remove();
                    getInfo();
                    return false;
                }
            }
        });
    } else {
        alert("不能留空哦！");
    }
}

//取消修改
function userUpdateExit() {
    $('#userUpdate').hide();
    return false;
}

//退出查看
function checkExit() {
    $('#userCheck').hide();
    return false;
}

//退出
$('#exit').on('click', function () {
    localStorage.clear();
    location.href = "login.html";
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
            $('#viewPhone').on('click', function () {
                location.href = 'phoneView.html?nicik=' + hrefStr;
            });
            $('#viewBrand').on('click', function () {
                location.href = 'brandView.html?nicik=' + hrefStr;
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


//获取后台用户数据
function getInfo(page, pageSize) {
    page = page || 1;
    pageSize = pageSize || 5;
    $.ajax({
        type: 'post',
        url: "http://127.0.0.1:3000/api/allUser",
        data: {
            page: page,
            pageSize: pageSize
        },
        success: function (res) {
            if (res.code == -1) {
                alert(res.msg);
            } else {
                var userData = res.data.info;
                var str = '';
                for (var i = 0; i < userData.length; i++) {
                    str += `
                    <tr>
                    <th scope="row">${i+1}</th>
                    <td class="noneId">${userData[i]._id}</td>
                    <td>${userData[i].name}</td>
                    <td>${userData[i].nicik}</td>
                    <td>${userData[i].phone}</td>
                    <td>${userData[i].sex}</td>
                    <td>${userData[i].age}</td>
                    <td>${userData[i].isAdmin==true?'是':'否'}</td>
                    <td> ${userData[i].isAdmin==true?'':'<a href="#" id="updateUser" class="updateUser">修改</a>'} ${userData[i].isAdmin==true?'<a href="#" class="checkUser">查看</a>':'<a href="#" id="del" class="del">删除</a>'}</td>
                  </tr>
                    `;
                }
                $('#tbodyUser').append(str);
                //查看
                //修改
                // var updateUser = $('#updateUser');
                // updateUser.on('click', function () {
                //     console.log(this.parentNode.parentNode.firstElementChild.nextElementSibling.innerText);
                // });
            }
        }
    });
}

//分页
function changePage() {
    var page = 1;
    var pageSize = 5;
    $.post("http://127.0.0.1:3000/api/allUser", {
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
                $('#tbodyUser').children().remove();
                getInfo($(this).text(), 5);
            });
            //向左按钮的点击事件
            toPrev.click(function () {
                //console.log(index);
                if (index === 1) {
                    index = totalPage;
                    $('#tbodyUser').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                    return false;
                } else {
                    index--;
                    $('#tbodyUser').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                }
            });
            //向右按钮的点击事件
            toNext.click(function () {
                if (index === totalPage) {
                    index = 1;
                    $('#tbodyUser').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                    return false;
                } else {
                    index++;
                    $('#tbodyUser').children().remove();
                    getInfo(index, 5);
                    $(pageLi[index]).addClass("active").siblings().removeClass("active");
                }
            });
        }
    });

}


//搜索  还不够完美。。。键盘按下就。。。
function search() {
    var searchBtn = $("#searchBtn");
    var searchInfo = $("#searchInfo");
    searchBtn.click(function () {
        // 点击搜索先清空
        $('#tbodyUser').children().remove();
        $.post("http://127.0.0.1:3000/api/searchUser", {
            name: searchInfo.val()
        }, function (res) {
            if (res.code === 1) {
                var userData = res.data.info;
                var str = '';
                for (var i = 0; i < userData.length; i++) {
                    str += `
                    <tr>
                    <th scope="row">${i+1}</th>
                    <td class="noneId">${userData[i]._id}</td>
                    <td>${userData[i].name}</td>
                    <td>${userData[i].nicik}</td>
                    <td>${userData[i].phone}</td>
                    <td>${userData[i].sex}</td>
                    <td>${userData[i].age}</td>
                    <td>${userData[i].isAdmin==true?'是':'否'}</td>
                    <td> ${userData[i].isAdmin==true?'':'<a href="#" id="updateUser" class="updateUser">修改</a>'} ${userData[i].isAdmin==true?'<a href="#" class="checkUser">查看</a>':'<a href="#" id="del" class="del">删除</a>'}</td>
                  </tr>
                    `;
                }
                $('#tbodyUser').append(str);
            } else {
                alert(res.msg);
            }
        });
    });


}