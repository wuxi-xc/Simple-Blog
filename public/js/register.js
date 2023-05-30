$(function () {

    $('.register').click(function (e) {
        e.preventDefault();
        //判断注册信息是否合法
        var patt = /^\w{3,7}$/;
        if (!patt.test($("#user").val())) {
            document.querySelector('.tankuang').style.display = 'block',
                document.querySelector('.container').style.marginTop = '-100px'
            $('#layer_msg').text("用户名长度为3-7位，必须由字母数字下划线组成");
            setTimeout(function () {
                document.querySelector('.tankuang').style.display = 'none',
                    document.querySelector('.container').style.marginTop = '0px'
            }, 1000)
            return false;
        } else {
            if ($("#pwd").val().length < 6) {
                document.querySelector('.tankuang').style.display = 'block',
                    document.querySelector('.container').style.marginTop = '-100px'
                $('#layer_msg').text("密码必须不少于6位字符！");
                setTimeout(function () {
                    document.querySelector('.tankuang').style.display = 'none',
                        document.querySelector('.container').style.marginTop = '0px'
                }, 1000)
                return false;
            }
        }
        var data = $('#form_login').serialize()
        $.post(
            'http://127.0.0.1/api/register',
            data,
            function (res) {
                console.log(res);
                if (res.status == 200) {
                    document.querySelector('.tankuang').style.display = 'block',
                        document.querySelector('.container').style.marginTop = '-100px'
                    $('#layer_msg').text('注册成功')
                    setTimeout(function () {
                        location.href = './login.html'
                    }, 1000)
                } else {
                    document.querySelector('.tankuang').style.display = 'block',
                        document.querySelector('.container').style.marginTop = '-100px'
                    $('#layer_msg').text('账号已存在,请重新注册')
                    setTimeout(function () {
                        document.querySelector('.tankuang').style.display = 'none',
                            document.querySelector('.container').style.marginTop = '0px'
                    }, 1000)
                }
            }
        )
    })
})