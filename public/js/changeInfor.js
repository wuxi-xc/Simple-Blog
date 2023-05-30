$(function () {

    // 获取用户名判断是否登录
    $.get(
        'http://127.0.0.1/api/username',
        function (res) {
            // console.log(res);
            //修改密码
            if (res.status == 200) {
                $('#pwdBtn').click(function (e) {
                    e.preventDefault();
                    let username = res.username;
                    var newpwd = $('#newPwd').val();
                    var condirm = $('#confirmPwd').val();
                    var data = $('#content1').serialize();
                    if (newpwd == condirm) {
                        axios({
                            method: 'POST',
                            data,
                            url: 'http://127.0.0.1/api/changePwd',
                        }).then(function (res) {
                            if (res.data.status == 200) {
                                alert('密码修改成功，请重新登录');
                                $.post(
                                    'http://127.0.0.1/api/logout',
                                    function (res) {
                                        if (res.status == 200) {
                                            // 如果 status 为 200，则表示退出成功，重新跳转到登录页面
                                            location.href = './login.html'
                                        }
                                    }
                                )
                            } else {
                                alert('密码修改失败');
                            }
                        })
                    }else{
                        alert("前后密码不一致！！！");
                    }
                })
                //修改信息
                $('#inforBtn').click(function (e) {
                    e.preventDefault();
                    let username = res.username;
                    var data = $('#content1').serialize();
                    axios({
                        method: 'POST',
                        data,
                        url: 'http://127.0.0.1/api/changeInfor',
                    }).then(function (res) {
                        if (res.data.status == 200) {
                            alert('信息修改成功');
                            location.reload();
                        } else {
                            alert('信息修改失败');
                        }
                    })
                })
            } else {
                alert('请再次登录')
                location.href = './login.html'
            }
        }
    )
})