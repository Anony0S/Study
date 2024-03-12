import {deviceStatusStr} from './typeStr'
export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return (
    [year, month, day].map(formatNumber).join('-')
  )
}
export const formatMonthStartDate = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return (
    [year, month, 1].map(formatNumber).join('-')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
/**
 * 获取设备状态
 * @param type 
 */
export const getDeviceStatusStr = (type: DeviceStatus) => {
  console.log('getDeviceStatusStr', type)
  return deviceStatusStr[type];
};
/**
 * 识别设备id
 */
export const scanDeviceId = (res: string) => {
  const query = getQuery(res)
  const device_id = query.device_id || res
  return device_id
}

const getQuery = (url: string) => {
  const params = url.split('?')[1]
  const query: Record<string, string> = {}
  if (!params) return query
  const queryArr = params.split('&')
  queryArr.forEach(item => {
    const [key, value] = item.split('=')
    query[key] = value
  })
  return query
}