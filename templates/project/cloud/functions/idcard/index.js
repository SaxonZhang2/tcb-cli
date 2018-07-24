
// https://github.com/tencentyun/image-node-sdk
const {
  ImageClient
} = require('image-node-sdk');

// 前往此处获取: https://console.cloud.tencent.com/cam/capi
let AppId = ''; // 腾讯云 AppId
let SecretId = ''; // 腾讯云 SecretId
let SecretKey = ''; // 腾讯云 SecretKey

let imgClient = new ImageClient({ AppId, SecretId, SecretKey });

// 云函数入口函数
exports.main = async (event, context) => {

  let result = await imgClient.ocrIdCard({
      data: {
          url: event.url
      }
  });

  return JSON.parse(result.body);
}