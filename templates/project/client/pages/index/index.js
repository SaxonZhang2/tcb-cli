//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    dataMsg: '',
    statusMsg: '',
    fileID: '无，请先上传',
    idCardImage: '',
    tempFilePath: '',
  },

  downloadFile: function () {
    this.setData({
      statusMsg: '开始下载文件'
    })
    wx.cloud.downloadFile({
      fileID: this.data.fileID,
    }).then(res => {
      console.log('下载成功', res)
      this.setData({
        statusMsg: '下载成功',
        tempFilePath: res.tempFilePath,
      })
    }).catch(err => {
      console.error('下载失败', err)
      this.setData({
        statusMsg: `下载失败：${err.errMsg}`,
      })
    })
  },

  uploadFile: function () {
    wx.chooseImage({
      success: dRes => {
        this.setData({
          statusMsg: '开始上传文件'
        })

        wx.showLoading({
          title: '加载中',
        });

        const uploadTask = wx.cloud.uploadFile({
          cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
          filePath: dRes.tempFilePaths[0],
          success: res => {
            // console.log('上传成功', res)
            if (res.statusCode < 300) {
              this.setData({
                fileID: res.fileID,
              }, () => {
                this.getTempFileURL();
              });
            }
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
            // console.error('上传失败', err)
            // this.setData({
            //   statusMsg: `上传失败：${err.errMsg}`,
            //   tempFilePath: res.fileID,
            // })
          },
        })
      },
      fail: console.error,
    })
  },

  getTempFileURL: function () {

    this.setData({
      statusMsg: '开始获取链接'
    })
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: this.data.fileID,
      }],
      //   success: function() { console.log(this) },
      //   fail: console.error,
    }).then(res => {
      console.log('获取成功', res)
      let files = res.fileList;

      if (files.length)
        this.setData({
          idCardImage: files[0].tempFileURL
          // statusMsg: '获取成功，见 console',
        });
      this.callFunction()
    }).catch(err => {
      console.error('获取失败', err)
      // this.setData({
      //   statusMsg: `获取失败：${err.errMsg}`,
      // })
      wx.showToast({
        title: '获取身份证链接失败',
        icon: 'none'
      });
      // wx.hideLoading();
    })
  },

  callFunction: function () {
    this.setData({
      statusMsg: '开始调用云函数，函数名：test'
    })
    wx.cloud.callFunction({
      name: 'idcard',
      data: {
        url: this.data.idCardImage
      }
    }).then(res => {
      console.log('调用成功', res)
      this.setData({
        statusMsg: `调用成功，返回结果：${res.result}`,
      })
      const result = res.result;
      const data = result.data || {};
      
      if (result.code) {
        wx.showToast({
          title: '获取信息失败',
          icon: 'none'
        });
        return;
      }

      this.setData({
        name: data.name,
        sex: data.sex,
        idCard: data.id,
        nation: data.nation,
        birth: data.birth,
        address: data.address
      })
      console.log(wx.cloud);
      wx.hideLoading();

    }).catch(err => {
      console.error('调用失败', err)
      this.setData({
        statusMsg: `调用失败：${err.errMsg}`,
      });
      wx.hideLoading();
    })
  },

  onLoad: function () {
    
  },

  submitId: function () {
    const data = this.data
    if (!data.name || !data.sex || !data.idCard) {
      wx.showToast({
        title: '请先上传身份证或填写身份信息',
        icon: 'none'
      });
      return this.setData({
        statusMsg: '请先上传身份证或填写身份信息'
      })
    }
    this.setData({
      statusMsg: '开始写入集合'
    })
    wx.showLoading({
      title: '加载中',
    });
    // 初始化db
    const db = wx.cloud.database({
      // env: "sft-test-c5bf8f"
    })
    const checkResult = {
      name: this.data.name, // 姓名
      sex: this.data.sex,// 性别
      nation: this.data.nation, // 民族
      birth: this.data.birth, // 生日 
      address: this.data.address, // 地址
      id: this.data.id, // 身份证号
      cosId: this.data.fileID, // cos资源id 
      idCardImage: this.data.idCardImage, // 图片地址
      dbId: this.data.dbId // 文档主键
    }
    app.globalData.checkResult = checkResult
    // 写入集合
    db.collection('idcard').add({
      data: checkResult
    }).then(result => {
      wx.hideLoading();
      console.log('写入成功', result)
      this.setData({
        dbId: result._id,
        statusMsg: `写入成功，返回结果：${result}`,
      })

      wx.navigateTo({
        url: '../detail/index'
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '写入失败',
        icon: 'none'
      });
    })
  }
})
