const db = wx.cloud.database();
const app = getApp();
const _ = db.command;
Page({
  data: {
    account:null,
    flag:false,
    nowuser:false
  },
  showrecipe:function(){
    var ingredient = this.data.recipe.ingredient;
    wx.showModal({
      title: '详细食材',
      content: "需要准备"+ingredient,
      showCancel:false,
    })
  },
  showseasoning:function(){
    var seasoning = this.data.recipe.seasoning;
    wx.showModal({
      title: '详细调料',
      content: "需要准备"+seasoning,
      showCancel:false,
    })
  },
  tocomment: function() {
    wx.navigateTo({
      url: '/pages/comment/comment?Rname=' + this.data.recipe.Rname,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({account:app.account})
    db.collection("Recipe").where({
      "Rname":options.Rname
    }).get({
      success:res=>{
        this.setData({
          recipe:res.data[0],
          Rname:res.data[0].Rname,
        })
      }
    })
    setTimeout(()=>
    {
      db.collection("user").where({
        account:this.data.account
      }).get({
        success:res=>{
          this.setData({nowuser:res.data[0]});
          var F = this.data.nowuser.collectList.indexOf(this.data.Rname);
          console.log(F);
          if(F>-1){
            var FF = true;
          }
          else{
            var FF = false;
          }
          this.setData({flag:FF})
        }
      });
    }, 500)
  },
  collect:function()
  {
    var usertemp = this.data.nowuser;
    if(this.data.flag===false){
      usertemp.collectList.push(this.data.Rname);
      this.setData({
        flag:true,
        nowuser:usertemp
      })
      db.collection("user").where({
        account:this.data.nowuser.account
      }).update({
        data:{
          collectList:this.data.nowuser.collectList
        },
      })
    }
    else{
      const index=usertemp.collectList.indexOf(this.data.Rname);
      if (index!=-1) {
        usertemp.collectList.splice(index,1)
      }
      this.setData({
        flag:false,
        nowuser:usertemp
      })
      db.collection("user").where({
        account:this.data.nowuser.account
      }).update({
        data:{
          collectList:this.data.nowuser.collectList
        },
      })
    }
  },
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})