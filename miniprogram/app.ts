// app.ts
import api from './utils/api'
App<IAppOption>({
	api: api,
	globalData: {
		shareContent: {
			title: '联点云, 领先的云计算服务商',
			path: '/pages/node/node',
			imageUrl: ''
		},
	},
	setCurrentNode(node: DeviceInfo) {
		this.globalData.currentNode = node
		// 开发时用的
		wx.setStorage({
			key: 'info',
			data: node
		})
	},
	setUserInfo(info: UserInfo) {
		this.globalData.userInfo = info
		// 开发时用的
		wx.setStorage({
			key: 'userinfo',
			data: info
		})
	},
	setCurrentNetcards(netcards: NetCardInfo[]) {
		this.globalData.currentNetcards = netcards
		// 开发时用的
		wx.setStorage({
			key: 'netcards',
			data: netcards
		})
	},
	setDeviceId(device_id: string) {
		this.globalData.device_id = device_id
	},
	setOnlineStatus(status: string) {
		this.globalData.online_status = status
	},
	onLaunch() {
		this.globalData.menuButtonInfo = wx.getMenuButtonBoundingClientRect()
	},

})