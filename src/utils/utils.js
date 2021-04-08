// 取得網址參數
function getUrlParams () {
  return location.search.replace('?', '').split('&').reduce((all, curr) => {
    const [key, val] = curr.split('=')
    all[key] = val
    return all
  }, {})
}
// 增加新屬性
function addUrlParams (key, val) {
  const url = location.href
  const params = getUrlParams()
  if (!Object.keys(params).includes(key)) {
    const bridge = url.includes('?') ? '&' : '?'
    history.pushState({}, '', `${url}${bridge}${key}=${val}`)
  }
}
function clearUrlParams () {
  const url = location.href
  const searchParamIdx = url.indexOf('?')
  history.pushState({}, '', url.slice(0, searchParamIdx))
}

export default {
  getUrlParams,
  addUrlParams,
  clearUrlParams
}