function logSubmit() {
    var userName = $("input[name='userName']").val();
    var pwd = $("input[name='pwd']").val();
    if (pwd != '' && userName != '') {
        $.ajax({
            type: 'post',
            url: "http://127.0.0.1:3000/api/login",
            data: {
                name: userName,
                pwd: pwd
            },
            success: function (res) {
                if (res.code == -1) {
                    alert("用户名或密码错误");
                    return false;
                } else {
                    alert("登录成功");
                    var nicik = res.data.nicik;
                    var isAdmin = res.data.isAdmin;
                    var userArr = [{
                        'nicik': nicik,
                        'isAdmin': isAdmin
                    }];
                    var userArrStr = JSON.stringify(userArr);
                    localStorage.setItem(nicik, userArrStr);
                    if (isAdmin) {
                        location.href = 'userView.html?nicik=' + res.data.nicik;
                        return true;
                    } else {
                        location.href = 'brandView.html?nicik=' + res.data.nicik;
                        return true;
                    }
                }
            }
        });
        return false;
    } else {
        alert("不能留空");
        return false;
    }
}