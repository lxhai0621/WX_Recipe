// pages/comment/comment.js

const app = getApp()
const db = wx.cloud.database();
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CommentList: [],
    List: [],
    Rname: '',
    comment: '',
    Uid: '',
    num: '', //周期函数的编号
    _options: ''
  },
  write: function (e) {
    this.setData({
      comment: e.detail.value
    })
    // console.log(e.detail.value)
  },
  submitComment: function () {
    let that = this
    // console.log(this.data.account)
    db.collection('user').where({
      account: this.data.account
    }).get({
      success: function (res) {
        // console.log(res.data[0]._id)
        that.setData({
          Uid: res.data[0]._id
        })

        db.collection('comment').add({
          data: {
            Uid: that.data.Uid,
            Msg: that.data.comment,
            Rname: that.data.Rname,
            account: that.data.account,
            Date: Date()
          },
          success: () => {
            that.setData({
              comment: ''
            })
            that.onLoad(that.data._options)
            that.onShow()
          }
        })
      }
    })
  },

  f: function () {
    let that = this
    let arr = that.data.CommentList
    // console.log(arr)
    for (let i = 0; i < that.data.CommentList.length; i++) {
      db.collection('user').where({
        account: arr[i].account
      }).get({
        success: function (res) {
          arr[i].avatar = res.data[0].avatar
          arr[i].name = res.data[0].name
          // console.log(arr)
          that.setData({
            CommentList: arr
          })
        }
      })
    }
    // console.log(this.data.CommentList)
  },
  delete: function(e) {
    let that = this
    // let id = e.currentTarget.dataset.value
    db.collection('comment').doc(e.currentTarget.dataset.value).remove({
      success: function() {
        wx.showToast({
          title: '删除成功',
        })
        // that.onShow()
        that.onLoad(that.data._options)
        that.onShow()
      }
    })
    // this.onLoad(this.data._options)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    this.setData({
      _options: options,
      account: app.account,
      Rname: options.Rname
    })
    db.collection('comment').where({
      Rname: options.Rname
    }).get({
      success: res => {
        that.setData({
          CommentList: res.data
        })
      }
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
    // let that = this
    // let n = setInterval(() => {
    //   that.f()
    // }, 10000);
    // this.setData({
    //   num: n
    // })
    setTimeout(() => {
      this.f()
    }, 500)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // clearInterval(this.data.num)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // clearInterval(this.data.num)
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