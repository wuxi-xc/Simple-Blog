$(function () {
    // 发布留言
    $('.btn').click(function (e) {
        e.preventDefault()
        var data = $('#form_add').serialize()
        axios({
            method: 'POST',
            url: 'http://127.0.0.1/api/addLeaving',
            data
        }).then(function (res) {
            if (res.data.status == 200) {
                // 刷新页面
                location.reload();
            } else {
                alert("评论发布失败")
            }
        })
    })

    // 获取用户名判断是否登录
    $.get(
        'http://127.0.0.1/api/username',
        function (res) {
            // console.log(res);
            if (res.status == 200) {
                let username = res.username
                // 获取留言列表
                axios({
                    method: 'GET',
                    url: 'http://127.0.0.1/api/getLeaving',
                }).then(function (res) {
                    // 将获取到的留言渲染到页面
                    res.data.data.map(item => {
                        $('.user').text(username)
                        if (username == item.username) {
                            let li = `
                                <li class="list-group-item">
                                    <span>${item.content}</span>
                                    <span class="badge">${item.username}</span>
                                </li>`;
                            $('.list-group').append(li);
                        }
                    })
                })
            } else {
                alert('请先完成登录')
                location.href = './login.html'
            }
        }
    )
})