const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    account:null,
    addstep:[],
    step:[],
    Rname:null,
    ingredient:[],
    seasoning:[],
    tips:null,
    kind:null,
    recipeimagepath:"../../images/图库，相册.png",
    fileID:null
  },
  addstep:function(){
    var nowlength = this.data.addstep.length+1;
    var old = this.data.addstep;
    old.push(nowlength+1);
    this.setData({
      addstep:old
    })
  },
  delstep:function(){
    var nowlength = this.data.addstep.length+1;
    var old = this.data.addstep;
    var steptemp = this.data.step;
    old.pop();
    steptemp.pop();
    this.setData({
      addstep:old,
      step:steptemp
    })
  },
  getname:function(e){
    this.setData({Rname:e.detail.value})
  },
  getingredient:function(e){
    var str = (e.detail.value).toString().replace('，',',').split(',');
    this.setData({ingredient:str})
  },
  getseasoning:function(e){
    var str = (e.detail.value).toString().replace('，',',').split(',');
    this.setData({seasoning:str})
  },
  getstep:function(e){
    const {index} = e.currentTarget.dataset;
    var thisstep = e.detail.value;
    console.log(thisstep);
    var Step = this.data.step;
    Step[index] = thisstep;
  },
  gettips:function(e){
    this.setData({tips:e.detail.value});
  },
  getkind:function(e){
    this.setData({kind:e.detail.value})
  },
  uploadimage:function(){
    var that = this;
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFiles[0].tempFilePath
        that.setData({
          recipeimagepath: tempFilePaths
        })
      }
    })
  },
  uploadrecipe:function()
  {
    var that = this;
    wx.showLoading({
      title: '上传中',
      mask: true
    });
    wx.cloud.uploadFile({
      cloudPath: 'recipe/' + new Date().getTime() + '.png',
      filePath: this.data.recipeimagepath,
      success: res => {
        this.setData({
          fileID: res.fileID
        })
        console.log("上传成功");
        wx.cloud.database().collection("Recipe").add({
          data: {
            account: this.data.account,
            Rname:this.data.Rname,
            ingredient: this.data.ingredient,
            img: this.data.fileID,
            kind:this.data.kind,
            seasoning:this.data.seasoning,
            step:this.data.step,
            tips:this.data.tips
          }
        }).then(res => {
          wx.hideLoading();
          wx.showToast({  //显示上传成功信息
            title: '上传成功！！',
            icon: 'success',
            duration: 2500
          })
          this.setData({
            addstep:[],
            step:[],
            Rname:null,
            ingredient:[],
            seasoning:[],
            tips:null,
            kind:null,
            recipeimagepath:"../../images/图库，相册.png",
            fileID:null
          })
        }).catch(console.error);
      }
    })
  },
  onLoad(options) {
    this.setData({
      account: app.account
    })
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