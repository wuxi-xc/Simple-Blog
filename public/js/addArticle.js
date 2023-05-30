$("#file0").change(function () {
    var objUrl = getObjectURL(this.files[0]);//获取文件信息  
    //以下这两种方式我都可以解析出来，因为Blob对象的数据可以按文本或二进制的格式进行读取
    console.log("objUrl = " + objUrl);
    if (objUrl) {
      $("#img0").attr("src", objUrl);
    }

  });
  function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)  
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome  
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }  


  $(function () {
    // 发布文章
    $('.btn').click(function (e) {
      e.preventDefault();
      var data = $('#form_add').serialize();
  
      axios({
        method: 'POST',
        url: 'http://127.0.0.1/api/addArticle',
        data
      }).then(function (res) {
        if (res.data.status == 201) {
          document.querySelector('.tankuang').style.display = 'block',
          document.querySelector('.navbar').style.marginTop = '-100px'
          $('#layer_msg').text('文章发布成功')
          setTimeout(function () {
            location.href = './index.html'
          }, 800)
        } else {
          document.querySelector('.tankuang').style.display = 'block',
            document.querySelector('.navbar').style.marginTop = '-100px'
          $('#layer_msg').text('文章发布失败')
          setTimeout(function () {
            document.querySelector('.tankuang').style.display = 'none',
            document.querySelector('.navbar').style.marginTop = '0px'
          }, 800)
        }
      })
    })

    // 获取用户名判断是否登录
    $.get(
      'http://127.0.0.1/api/username',
      function (res) {
        console.log(res);
        if (res.status == 200) {
          // alert('登陆成功!欢迎'+res.username)
        } else {
          alert('请先完成登录')
          location.href = './login.html'
        }
      }
    )
  })