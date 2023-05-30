$(function () {
    // 点击文章列表切换页面
    $('.list-group').on('click', 'a', function (e) {
      // 获取点击文字的id值
      var list_id = e.target.id
      // 获取文章列表进行文章筛选
      axios({
        method: 'GET',
        url: 'http://127.0.0.1/api/getArticle',
      }).then(function (res) {
        // console.log(list_id);
        var data = { id: list_id }
        // 筛选文章
        axios({
          method: 'POST',
          data,
          url: 'http://127.0.0.1/api/search',
        }).then(function (res) {
          if (res.data.status == 200) {
            console.log(res.data);
            console.log(res.data.data.content);
          } else {
            alert('文章不存在!')
          }
        })

      })
    })

    // 获取用户名判断是否登录
    $.get(
      'http://127.0.0.1/api/username',
      function (res) {
        // console.log(res);
        if (res.status == 200) {
          let username = res.username;
          let data = { num: 0 }
          // 获取文章列表
          axios({
            method: 'POST',
            data,
            url: 'http://127.0.0.1/api/limit',
          }).then(function (res) {
            // 将获取到的文章渲染到页面 作为初始页面
            res.data.data.map(item => {
              if (item.username == username) {
                let a = `<a href="page/${item.id}_id" target="_blank" class="list-group-item  list_a" id="${item.id}">${item.title} <div class="name"> <span class="username">用户 ${item.username}</span> <span class="time">发布于 ${item.time}</span></div> </a>`
                $('.list-group1').append(a)
              }
            })
          })
        } else {
          alert('请先完成登录')
          location.href = './login.html'
        }
      }
    )

    //获取留言
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
            // 将获取到的给我的留言渲染到页面
            res.data.data.map(item => {
              if (username == item.reciver) {
                let li = `
                          <li class="list-group-item">
                              <span>${item.content}</span>
                              <span class="badge">来自用户${item.username}</span>
                          </li>`
                $('.list-group2').append(li)
              }else if(username == item.reciver){
                let li = `
                          <li class="list-group-item">
                              <span>${item.content}</span>
                              <span class="badge">接收用户${item.reciver}</span>
                          </li>`
                $('.list-group3').append(li)
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