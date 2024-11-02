const db = wx.cloud.database();
Page({
  data: {
    account: "",
    name: "",
    password: "",
    avatarpath: "./images/1702012605018.png",
    check: false,
    isRegister: false,
    fileID: ""
  },
  getName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  getAccount: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  getPWD: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  check(e) {
    this.setData({
      check: !this.data.check
    });
  },
  ChooseTou: function (e) {
    var that = this;
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFiles[0].tempFilePath
        that.setData({
          avatarpath: tempFilePaths
        })
      }
    })
  },
  register: function () {
    var that = this;
    if (this.data.check === false) {
      wx.showToast({
        title: "请勾选协议",
        icon: "error",
        duration: 2500,
      })
    } else if (this.data.account.length < 11) {
      wx.showToast({
        title: "手机号不规范",
        icon: "error",
        duration: 2500,
      })
    } else {
      wx.cloud.database().collection("user").where({
        account: this.data.account
      }).get().then(res => {
        if (res.data[0]) {
          this.setData({
            isRegister: true
          })
          wx.showToast({
            title: '该账号已注册',
            icon: "error",
            duration: 2500,
          })
          return;
        } else {
          this.setData({
            isRegister: false
          })
        }
      })
      if (this.data.isRegister === false) {
        wx.showLoading({
          title: '注册中',
          mask: true
        })
        wx.cloud.uploadFile({
          cloudPath: 'avatar/' + new Date().getTime() + '.png',
          filePath: this.data.avatarpath,
          success: res => {
            this.setData({
              fileID: res.fileID
            })
            console.log("上传成功");
            wx.cloud.database().collection("user").add({
              data: {
                account: this.data.account,
                name: this.data.name,
                level: 'cook',
                avatar: this.data.fileID,
                password: this.data.password,
                collectList:[]
              }
            }).then(res => {
              wx.hideLoading();
              wx.navigateBack({
                delta: 1
              });
            }).catch(console.error);
          }
        })
      }
    }
  }
})