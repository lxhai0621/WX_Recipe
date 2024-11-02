const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
let List = [
	{
		"LeftId": 1,
		"LeftName": "按做法",
		"RightList": [
		{
			"RightId": 11,
			"RightName": "炒菜"
    },
    {
			"RightId": 12,
			"RightName": "炖菜"
    },
    {
			"RightId": 13,
			"RightName": "烩菜"
    },
    {
			"RightId": 14,
			"RightName": "凉菜"
		},
		]
	},
	{
		"LeftId": 2,
		"LeftName": "按食材",
		"RightList": [
		{
			"RightId": 21,
			"RightName": "猪肉"
    },
    {
			"RightId": 22,
			"RightName": "鸡肉"
    },
    {
			"RightId": 23,
			"RightName": "鱼"
		},
		]
	},
  
]
Page({
  data: {
    focus:false,  //控制是否显示带取消按钮的搜索框
    inputValue:"",
    recipeList:[],
    List:List,
    selectLeftId : null,
		selectRightId : null,
		currentIndex_L : null,
		currentIndex_R : null,
    chooseflag:0,
    kindList:[],
    keyword:null
  },
  focusHandler(e){
    this.setData({focus:true});
  },
  cancelHandler:function(){
    this.setData({
      focus:false,
      keyword:null
    });
  },
  query:function(e){
    this.setData({keyword:e.detail.value});
  },
  search:function(){
    wx.showLoading({
      title: '搜索中',
    })
    db.collection("Recipe").where({
      Rname:this.data.keyword
    }).get().then(res=>{
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/detail/detail?Rname='+res.data[0].Rname,
      })
    }).catch(res=>{
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '没有该菜谱',
        showCancel:false,
        complete: (res) => {        
          if (res.confirm) {
          }
        }
      })
    })
  },
  bindleLeftItemTap(e) {
		const {index} = e.currentTarget.dataset;
		this.setData({
			currentIndex_L:index,
			currentIndex_R : null,
			selectLeftId : this.data.List[index].LeftId,
			selectRightId : null,
      scrollTop : 0,
      chooseflag:0,
		}) 
  },
  bindleRightItemTap(e) {
		const {index} = e.currentTarget.dataset;
		let index_L = this.data.currentIndex_L;
		this.setData({
			currentIndex_R : index,
      selectRightId : this.data.List[index_L].RightList[index].RightId,
      selectRightName:this.data.List[index_L].RightList[index].RightName
    })
    if(this.data.selectLeftId===2){
      wx.showLoading({
        title: '加载中',
      })
      db.collection("Recipe").where({
        ingredient:db.RegExp({
          regexp: this.data.selectRightName,
          //大小写不区分
          options: 'i',
        })
      }).get().then(res=>{
        this.setData({
          kindList:res.data,
          chooseflag:1,
        });
        wx.hideLoading();
      })
    }
    if(this.data.selectLeftId===1){
      wx.showLoading({
        title: '加载中',
      })
      db.collection("Recipe").where({
        kind:_.eq(this.data.selectRightName)
      }).get().then(res=>{
        this.setData({
          kindList:res.data,
          chooseflag:1,
        });
        wx.hideLoading();
      })
    }

    
	},

  onLoad(options) {
    var that = this;
    var a = db.collection('Recipe').get({
      success:res=>{
        this.setData({
          recipeList:res.data
        })
      }
    })
  },
  onTabItemTap(){
    var that = this;
    var a = db.collection('Recipe').get({
      success:res=>{
        this.setData({
          recipeList:res.data
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