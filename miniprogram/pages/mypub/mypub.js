const app = getApp()
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:null,
    account:null,
    Recipelist:null,
  },
  view:function(event)
  {
    var value= event.currentTarget.dataset.value;
    wx.navigateTo({
      url:"../detail/detail?Rname="+value
    })
  },
  delete:function(event)
  {
    var value = event.currentTarget.dataset.value;
    db.collection('Recipe').where({
      Rname:value
    }).remove().then(res=>{
      console.log("删除成功")
      db.collection("Recipe").where({
        account:this.data.account
      }).get().then(res=>{
        this.setData({
          Recipelist:res.data,
          count:res.data.length,
        });
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({account:app.account});
    db.collection("Recipe").where({
      account:this.data.account
    }).get().then(res=>{
      this.setData({
        Recipelist:res.data,
        count:res.data.length,
      });
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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