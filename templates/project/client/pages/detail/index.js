//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imageList: [],
    idCardImage: '',
  },

  onLoad: function () {
    // 初始化db
    const db = wx.cloud.database({})
    db.collection('idcard').doc(app.globalData.checkResult.dbId).get()
    .then(res=>{
      console.log('db读取成功', res.data)
      this.setData({
        imageList: [res.data.idCardImage],
        idCardImage: res.data.idCardImage,
        idCardData: res.data
      });
      
    })
    .catch(e=>{
      wx.showToast({
        title: 'db读取失败',
        icon: 'none'
      });
    })
  },
  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imageList // 需要预览的图片http链接列表  
    })
  } 
})
