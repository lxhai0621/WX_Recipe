const db = wx.cloud.database();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recipeList:[],
  },
  gotomore:function()
  {
    wx.switchTab({
      url: '/pages/kind/kind',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var a = db.collection('Recipe').get({
      success:res=>{
        this.setData({
          recipeList:res.data
        })
      }
    })
    app.account = options.account
  },

})