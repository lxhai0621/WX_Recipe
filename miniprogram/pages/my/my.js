const app = getApp()
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    avatar: '',
    name: '',
    account: '',
    password: '',
    fileList: [],
    fileID: '',
    visible1: false,
    visible2: false,
    textPassword_old: '',
    textPassword_new: '',
    content: ''
  },
  handleAdd(e) {
    const {fileList} = this.data;
    const {files} = e.detail;
    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });

  },
  bindKeyInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInput1: function (e) {
    this.setData({
      textPassword_old: e.detail.value
    })
  },
  bindKeyInput2: function (e) {
    this.setData({
      textPassword_new: e.detail.value
    })
  },
  cpwd: function() {
    if(this.data.textPassword_old.length < 4 && this.data.textPassword_new.length < 4) {
      this.setData({
        content: '密码小于4位'
      })
      this.showText()
    } else if(this.data.textPassword_old != this.data.password) {
      this.setData({
        content: '原密码错误'
      })
      this.showText()
    } else {
      let that = this
      
      this.setData({
        password: this.data.textPassword_new,
        content: '修改成功',
        visible1: false
      }),
      db.collection('user').doc(that.data.id).update({
        data: {
          password: this.data.textPassword_new
        }
      }),
      this.showText()
    }
  },
  showText: function() {
    wx.showToast({
      icon: "none",
      title: this.data.content,
    })
  },
  onUpload(file) {
    let that = this
    const {fileList} = this.data;
    this.setData({fileList: [...fileList, {...file,}],});
      this.setData({fileList: [...fileList, {...file,status: 'loading' }],});
      console.log(this.data.fileList[0].url)

      wx.cloud.uploadFile({
        cloudPath: 'avatar/' + new Date().getTime() + '.png',
        filePath: that.data.fileList[0].url,
        success: res => {
          db.collection('user').doc(that.data.id).update({
            data: {
              avatar: res.fileID
            },
            success: function(res) {
              console.log('更新成功')
            }
          })
        }
      })
      this.setData({
        avatar: this.data.fileList[0].url,
        visible2: false
      })
    db.collection('user').doc(that.data.id).update({
      data: {
        name: that.data.name
      },
      success: function(res) {
        that.setData({
          name: that.data.name,
          visible2: false,
        })
      }
    })
    this.setData({
      fileList: ''
    })
    
  },
  handleRemove(e) {
    const {index} = e.detail;
    const {fileList} = this.data;
    fileList.splice(index, 1);
    this.setData({fileList,});
  },
  exit: ()=> {
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },
  edit: function (e) {
    this.setData({
      visible2: true,
      fileList: ''
    });
  },
  onVisibleChange2: function (e) {
    this.setData({
      visible2: e.detail.visible,
    });
  },
  handlePopup: function () {
    this.setData({
      visible1: true
    });
  },
  onVisibleChange1: function (e) {
    this.setData({
      visible1: e.detail.visible,
    });
  },
  cancel: function () {
    this.setData({
      visible1: false,
      visible2: false
    });
  },

  init: function () {
    let that = this
    db.collection('user').where({
      account: that.data.account
    }).get({
      success(res) {
        that.setData({
          name: res.data[0].name,
          avatar: res.data[0].avatar,
          id: res.data[0]._id,
          password: res.data[0].password
        })
      }
    })
  },
  toCollect: function() {
    wx.switchTab({
      url: '/pages/collect/collect',
      success(){
        let page=getCurrentPages().pop();
        if(page==undefined || page==null){
            return;
        }
        page.onLoad();
      }
    })
  },
  tomypub: function() {
    wx.navigateTo({
      url: '/pages/mypub/mypub?account=' + this.data.account,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      account: app.account
    })
    this.init()
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
});