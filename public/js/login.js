 // 生成验证码的函数
 var code;
 function createCode() {
     code = "";            //验证码的初始值
     var codeLength = 4;   //验证码的长度
     // 验证码的组成成分
     var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f',
         'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
         'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
         'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
     for (var i = 0; i < codeLength; i++) {
         // 获取随机数：下标
         var charNum = Math.floor(Math.random() * 62);
         // 验证码
         code += codeChars[charNum];
     }
     document.getElementsByClassName("code")[0].innerText = code;
 }


 // 验证验证码的函数
 function checkCode() {
     // 获取输入的值
     var inputCode = $('#chapt').val();
     // 判断验证码是否输入正确
     if (inputCode.length <= 0) {
         alert("请输入验证码！");
     } else if (inputCode.toUpperCase() != code.toUpperCase()) {
         alert("验证码输入有误！");
         // 更新验证码
         createCode();
         // 清空输入框
         $('#chapt').val('');
     } else {
         return 1;
     }
 }

 $(function () {

     $('.login').click(function (e) {
         if (checkCode()) {
             e.preventDefault();
             var data = $('#form_login').serialize();
             $.post(
                 'http://127.0.0.1/api/login',
                 data,
                 function (res) {
                     if (res.status == 400) {
                         document.querySelector('.tankuang').style.display = 'block',
                             document.querySelector('.container').style.marginTop = '-100px'
                         $('#layer_msg').text('账号不存在,请先注册');
                         setTimeout(function () {
                             document.querySelector('.tankuang').style.display = 'none',
                                 document.querySelector('.container').style.marginTop = '0px'
                         }, 1000)
                     } else if (res.status == 401) {
                         document.querySelector('.tankuang').style.display = 'block',
                             document.querySelector('.container').style.marginTop = '-100px'
                         $('#layer_msg').text('密码错误,请重新登录')
                         setTimeout(function () {
                             document.querySelector('.tankuang').style.display = 'none',
                                 document.querySelector('.container').style.marginTop = '0px'
                         }, 1000)
                     } else {
                         location.href = './index.html'
                     }
                 }
             )
         }
     })

     //切换注册页面
     $('.register').click(function (e) {
         e.preventDefault()
         location.href = './register.html'
     })

 })