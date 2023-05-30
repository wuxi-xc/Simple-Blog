// 获取用户名判断是否登录
$.get(
    'http://127.0.0.1/api/username',
    function (res) {
        console.log(res);
        if (res.status == 200) {
            // alert('登陆成功!欢迎'+res.username)
        } else {
            alert('请先完成登录')
            location.href = '../login.html'
        }
    }
)

 // 查看评论
 $('.commentWatch').click(function (e) {
        e.preventDefault()
        axios({
            method: 'GET',
            url: 'http://127.0.0.1/api/getComment',
        }).then(function (res) {
            if (res.data.status == 200) {
                // 刷新页面
                res.data.data.map(item => {
                    let li = `
                        <div class="comment-content" style="background-color:aliceblue;">
                            <span class="comment-content-name">${item.sender}:</span>
                            <p class="comment-content-article">${item.comment}</p>
                            <p class="comment-content-footer">${item.time}</p>
                        </div>`;
                    $('.comment-list').append(li);
                })
                document.getElementById("comment").style.display="inline";
            } else {
                alert("评论获取失败");
            }
        })
    })

 // 发布评论
 $('.comment-send-button').click(function (e) {
    e.preventDefault()
    var data = $('#form_add').serialize()
    axios({
        method: 'POST',
        url: 'http://127.0.0.1/api/sendComment',
        data
    }).then(function (res) {
        if (res.data.status == 200) {
            // 刷新页面
            alert("评论成功");
            location.reload();
        } else {
            alert("评论发布失败");
        }
    })
})