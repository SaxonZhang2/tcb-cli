//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getData() {
    const db = wx.cloud.database({});
    db.collection('idcard').get().then((res) => {
      this.setData({
        list: res.data
      });
    }).catch(e => {
      wx.showToast({
        title: 'db读取失败',
        icon: 'none'
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },

  getDetail(e) {
    if (!app.globalData.checkResult) {
      app.globalData.checkResult = {};
    }
    let _id = e.currentTarget.dataset.dbid;
    app.globalData.checkResult.dbId = _id;

    wx.navigateTo({
      url: '../detail/index'
    });
  }

})