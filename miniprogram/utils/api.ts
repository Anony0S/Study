// 测试环境: www.time1000.cn
const getUrl = (url: string) => {
  if (url.indexOf('://') == -1) {
    url = 'https://pcdn.xiaotaobao.com/api/' + url
  }
  return url
}

const getHeader = () => {
  try {
    var token = wx.getStorageSync('token')
    if (token) {
      return { token }
    }
    return {}
  } catch (e) {
    return {}
  }
}

export default {
  get<T>(url: string, params = {}): Promise<T> {
    // wx.showLoading({
    //   title: '加载中...'
    // })
    return new Promise((resolve, reject) => {
      wx.request<BaseResponse<T>>({
        url: getUrl(url),
        data: params,
        header: getHeader(),
        success: (res) => {
          // wx.hideLoading()
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const info = res.data
            if (info.code !== 0) {
              wx.showToast({title: info.message, icon: 'none'})
              reject(info)
              if (info.code >= 1 && info.code <= 4) {
                wx.redirectTo({url: '/pages/login/login'})
              }
            } else {
              resolve(info.data)
            }
          } else {
            wx.showToast({title: '网络异常', icon: 'none'})
            reject(res)
          }
        }
      })
    })
  },
  post<T>(url: string, params = {}): Promise<T> {
    wx.showLoading({
      title: '加载中...'
    })
    return new Promise((resolve, reject) => {
      wx.request<BaseResponse<T>>({
        url: getUrl(url),
        method: 'POST',
        header: getHeader(),
        data: params,
        success: (res) => {
          wx.hideLoading()
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const info = res.data
            if (info.code !== 0) {
              wx.showToast({title: info.message, icon: 'none'})
              reject(info)
              if (info.code >= 1 && info.code <= 4) {
                wx.redirectTo({url: '/pages/login/login'})
              }
            } else {
              resolve(info.data)
            }
          } else {
            wx.showToast({title: '网络异常', icon: 'none'})
            reject(res)
          }
        }
      })
    })
  },
  uploadFile (file: any): Promise<string> {
    wx.showLoading({
      title: '上传中...'
    })
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: getUrl('file/v1/write'),
        filePath: file.url,
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data',
          ...getHeader(),
        },
        success: (res) => {
          wx.hideLoading()
          const data: BaseResponse<UploadFileResponse> = JSON.parse(res.data)
          if (data.code === 0) {
            resolve(data.data.name)
          } else {
            wx.showToast({title: data.message, icon: 'none'})
            reject(data.message)
          }
        },
        fail: (res) => {
          wx.hideLoading()
          reject(res)
        }
      })
    })
  },
}