function regSubmit() {
    var userName = $("input[name='userName']").val();
    var pwd = $("input[name='pwd']").val();
    var pwdSure = $("input[name='pwdSure']").val();
    var nicik = $("input[name='nicik']").val();
    var phone = $("input[name='phone']").val();
    var age = $("input[name='age']").val();
    var sex = $("input[name='sex']:checked").val();
    var isAdmin = $("input[name='isAdmin']:checked").val();
    if (pwd != pwdSure) {
        alert("两次输入密码不一致");
        return false;
    }
    if (pwd == pwdSure && userName != '' && pwd != '' && pwdSure != '' && nicik != '' && phone != '' && age != '') {
        $.ajax({
            type: 'post',
            url: "http://127.0.0.1:3000/api/register",
            data: {
                name: userName,
                pwd: pwd,
                nicik: nicik,
                phone: phone,
                age: age,
                sex: sex,
                isAdmin: isAdmin
            },
            success: function (res) {
                if (res.code == -1) {
                    alert("用户名已经存在");
                    return false;
                } else {
                    alert("注册成功");
                    var nicik = res.data.nicik;
                    var isAdmin = res.data.isAdmin;
                    var userArr = [{
                        'nicik': nicik,
                        'isAdmin': isAdmin
                    }];
                    var userArrStr = JSON.stringify(userArr);
                    localStorage.setItem(nicik, userArrStr);
                    location.href = '../index.html?nicik=' + res.data.nicik;
                    return true;
                }
            }
        });
        return false;
    } else {
        alert("不能留空");
        return false;
    }
}