import Axios from 'axios'

const axiosInstance = Axios.create({
  baseURL: process.env.VUE_APP_BaseUrl,
  timeout: 0
})

// 異常處理
axiosInstance.interceptors.response.use(
  response => { return response },
  err => {
    if (err && err.response) {
      const httpCode = err.response.status
      console.log(`error: http ${httpCode}`)
    } else {
      console.log('連接到服務器失敗')
    }
    return Promise.reject(err.response)
  }
)

export default axiosInstance