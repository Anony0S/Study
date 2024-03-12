/// <reference path="./types/index.d.ts" />
interface shareContent {
  title: string
  path: string
  imageUrl: string
}

interface menuButtonInfo {
  width: number
  height: number
  top: number
  right: number
  bottom: number
  left: number
}

interface IAppOption {
  globalData: {
    userInfo?: UserInfo,
    device_id?: string,
    online_status?: string,
    currentNode?: DeviceInfo,
    currentNetcards?: NetCardInfo[],
    shareContent?: shareContent,
    menuButtonInfo?: menuButtonInfo
  }
  api: {
    post<T>(url: string, params?: Object): Promise<T>
    get<T>(url: string, params?: Object): Promise<T>
    uploadFile(file: any): Promise<string>
  }
  // 设置当前的节点信息
  setCurrentNode(node: DeviceInfo): void
  // 设置用户信息
  setUserInfo(info: UserInfo): void
  // 设置当前网卡信息
  setCurrentNetcards(netcards: NetCardInfo[]): void
  // 设置设备ID (扫描的时候传值)
  setDeviceId(device_id: string): void
  // 设置在线状态
  setOnlineStatus(status: string): void
}