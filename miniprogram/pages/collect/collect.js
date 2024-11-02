const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:null,
    Collectlist:null,
    Recipelist:[],
    len:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var templist=[];
    this.setData({account:app.account});
    wx.showLoading({
      title: '加载中',
    })
    db.collection("user").where({
      account:this.data.account
    }).get().then(res=>{
      this.setData({Collectlist:res.data[0].collectList});
      //console.log(this.Collectlist);
      for(var i=0;i<this.data.Collectlist.length;i++)
      {
        db.collection("Recipe").where({
          Rname:this.data.Collectlist[i]
        }).get().then(res=>{
          templist.push(res.data[0]);
        })
      }
    });
    setTimeout(()=>{
      this.setData({
        Recipelist:templist,
        len:templist.length
      });
      wx.hideLoading();
    },1000)
  },
  onTabItemTap(){
    var templist=[];
    this.setData({account:app.account});
    wx.showLoading({
      title: '加载中',
    })
    db.collection("user").where({
      account:this.data.account
    }).get().then(res=>{
      this.setData({Collectlist:res.data[0].collectList});
      //console.log(this.Collectlist);
      for(var i=0;i<this.data.Collectlist.length;i++)
      {
        db.collection("Recipe").where({
          Rname:this.data.Collectlist[i]
        }).get().then(res=>{
          templist.push(res.data[0]);
        })
      }
    });
    setTimeout(()=>{
      this.setData({
        Recipelist:templist,
        len:templist.length
      });
      wx.hideLoading();
    },1000)
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

})