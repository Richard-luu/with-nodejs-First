// $(function () {
//     var str = decodeURI(decodeURI(window.location.href)).split("?")[1];
//     if (str) {
//         var reg = /[a-zA-Z0-9\u4e00-\u9fa5]/g;
//         var hrefStr = decodeURI(decodeURI(window.location.href))
//             .split("?")[1]
//             .split("=")[1].match(reg).join('');
//         var user = localStorage.getItem(hrefStr);
//         var userJosn = JSON.parse(user);
//         $('.loRes').hide();
//         if (userJosn[0].isAdmin) {
//             $("#wellcome").text("欢迎您-" + hrefStr + "(管理员)");
//         } else {
//             $("#wellcome").text("欢迎您-" + hrefStr + "(普通用户)");
//             $("#viewUser").hide();
//             $("#userMana").hide();
//             $("#brandMana").show();
//         }
//     } else {
//         alert("您还没登录！请先登录");
//         location.href = "html/login.html";
//     }
// });
$('#viewUser').on('click', function () {
    alert("你还没登录，请先登录!");
    location.href = 'html/login.html';
});
$('#viewBrand').on('click', function () {
    alert("你还没登录，请先登录!");
    location.href = 'html/login.html';
});
$('#viewPhone').on('click', function () {
    alert("你还没登录，请先登录!");
    location.href = 'html/login.html';
});