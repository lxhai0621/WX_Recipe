
const db = wx.cloud.database();
Page({
  data: {
    account:'',
    password:''
  },
  getaccount:function(e){
    this.setData(
      {
        account:e.detail.value
      }
    )
  },
  getPWD:function(e){
    this.setData(
      {
        password:e.detail.value
      }
    )
  },
  login:function(){
    const userConnection = db.collection("user");
    let flag = false;
    if(this.data.account==''||this.data.password==''){
      wx.showToast({  //显示账号密码为空信息
        title: '账号或密码为空',
        icon: 'error',
        duration: 2500
      });
    }
    else if(this.data.account.length<11 && this.data.account.length>0){
      wx.showToast({  //显示手机号不规范
        title: '手机号长度违规',
        icon: 'error',
        duration: 2500
      });
      this.setData(
        {
          account:'',
          password:''
        }
      )
    }
    else{
      userConnection.get({
        success: (res) => {
          let user = res.data;
          for (let i = 0; i < user.length; i++) { 
            if (this.data.account === user[i].account) {
              flag=true;
              if (this.data.password !== user[i].password) {
                wx.showToast({  //显示密码错误信息
                  title: '密码错误！！',
                  icon: 'error',
                  duration: 2500
                });
                this.setData(
                  {
                    account:'',
                    password:''
                  });
               break;
              } else {
                wx.showToast({  //显示登录成功信息
                  title: '登陆成功！！',
                  icon: 'success',
                  duration: 2500
                })
                wx.reLaunch({
                  url: '/pages/index/index?account=' + this.data.account,
                })
                break;
              }
            }
          };
          if(flag==false)//遍历完数据后发现没有该账户
          {
            wx.showToast({
              title: '该用户不存在',
              icon: 'error',
              duration: 2500
            })
          }
    }
  })
  }
},
gotoRegister:function()
{
  wx.navigateTo({
    url: '/pages/register/register',
  })
}
})
