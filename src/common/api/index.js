import AxiosInstance from './config'

export const ApiMail = {
  send: (to, name, photo) => AxiosInstance.get(`mailto?to=${to}&name=${name}&photo=${photo}`)
}