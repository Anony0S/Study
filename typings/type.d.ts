declare module 'element-plus/dist/locale/zh-cn.mjs';
/**
 * 用户的身份
 */
declare enum RoleType {
  // 所有/未知
  ALL = -1,
  // 普通用户
  USER = 0,
  // 商务人员
  BUSINESS = 20,
  // 管理员
  ADMIN = 99,
}
/**
 * 用户信息
 */
interface UserInfo {
  id: number
  phone: string
  role: RoleType
  token: string
}
/**
 * 接口返回的内容
 */
interface BaseResponse<T> {
  code: number
  message: string
  data: T
}
/**
 * 用户金钱信息返回
 */
interface UserMoneyResponse {
  // 累计增加金额
  total_increase_amount: number
  // 累计提现金额
  total_decrease_amount: number
  // 冻结金额
  freeze_amount: number
  // 余额
  amount: number
  // 在途金额
  transfer_amount: number
}
/**
 * 提现状态
 * 1 申请中 2 已拒绝 3 打款中 4 打款驳回 5 打款完成
 */
declare enum WithDrawType {
  Applying = 1,
  Refuse,
  Moneying,
  Reject,
  Done
}
/**
 * 提现记录列表
 */
interface WithDrawInfo {
  amount: number
  ctime: string
  id: number
  remark: string
  status: WithDrawType
  uid: number
  payee_type: PayeeType
  payee_extends: PayeeExtends
}
/**
 * 设备信息
 */
interface DeviceInfo {
  // 自增ID
  id?: number
  // 所属用户
  uid?: number
  // 来源
  refer?: string
  // 业务类型
  biz_type: BizType
  // 业务标签
  biz_tag: string
  // 设备ID
  device_id: string
  // 线路数
  line_number: number
  // 单条上行带宽(M)
  up_bandwidth: number
  //
  plan_task: string | string[]
  // 运营商
  isp: string
  // 省份
  province: string
  // 城市
  city: string
  // 拨号类型
  dialing_type: DialingType
  dns: string
  // 机房类型
  machine_room_type: string
  // IP协议栈
  ipProtocol?: string
  // 备注
  remark: string
  ip: string
  // ip协议栈
  ip_protocol: IpProtocol
  // nat类型
  nat_type: NatType | string
  // nat类型
  tcp_nat_type: string
  // nat类型
  udp_nat_type: string
  // 接入类型
  access_type: AccessType
  // 带宽类型
  bandwidth_type: BandwidthType
  // 设备硬件扩展
  device_hardware_extend: DeviceHardwareExtend
  // 设备网络卡扩展
  device_net_card_extend: DeviceNetCardExtend
  // 设备测试结果扩展
  device_test_result_extend: DeviceTestResultExtend
  // 设备计费扩展
  device_billing_extend: DeviceBillingExtend
  // 在线状态 1 在线 0 离线
  online_status: OnlineStatus
  // 是否可编辑状态 1 可编辑 0 不允许编辑
  allow_edit_status: number
  // 设备状态
  device_status: DeviceStatus
  // 昨日收益 单位: 分
  yesterday_settle: number
  // 昨日平台收益 单位: 分
  platform_yesterday_settle: number
}
/**
 * 业务4的设备信息
 */
interface DeviceInfo4 extends DeviceInfo {
  // 业务类型  理论上应该只等于 4
  biz_type: number
  province: string
  city: string
  cpu_arch: string
  cpu_cores: string
  ctime: string
  device_id: string
  disk_size: string
  id: number
  isp: string
  memory_size: string
  online: OnlineStatus
  online_text: string
  os: string
  plan_task: string[]
  plugin_deploy_time: string
  plugin_version: string
  private_ip: string
  device_status: DeviceStatus
  device_status_text: string
  public_ip: string
  storage_type: string
  supplier_device_id: string
  tcp_nat_type: string
  udp_nat_type: string
  uid: number
  yesterday_settle: number
}

/**
 * 业务5的设备信息
 */
interface DeviceInfo5 extends DeviceInfo {
  // 业务类型  理论上应该只等于 5
  biz_type: number,
  biz_type_name: string,
  province: string,
  city: string,
  ctime: string,
  device_id: string,
  device_status: DeviceStatus,
  device_status_text: string,
  disks: DeviceInfo5_Disk[],
  networks: DeviceInfo5_Network[],
  id: number,
  isp: string,
  online: OnlineStatus,
  online_text: string,
  nat_type: string,
  remark: string,
  source: number,
  uid: number,
  yesterday_settle: number,
}

interface DeviceInfo5_Disk {
  // 磁盘名称
  disk: string
  // 磁盘是否可写 true/false
  writeable: boolean
  // 磁盘总空间 MB
  total_disk_size: number
  // 磁盘剩余空间 MB
  free_disk_size: number
}
interface DeviceInfo5_Network {
  // 网卡名称
  nic: string
  // 公网ip
  remote_ip: string
  // 运营商
  isp: string
  // 省份
  province: string
  // mac地址
  mac: string
  // nat类型
  nat: number
  // 测速带宽 KByte/s
  test_bandwidth: number
  // 外网可连接状态， true/false
  status: boolean
}
/**
 * 网络信息
 */
interface NetworkContent {
  // IP
  ip: string
  // IP协议栈
  ip_protocol: IpProtocol
  // 运营商
  isp: string
  // 省份/城市
  province_city: string
  // 管理线路
  device_net_card_extend: DeviceNetCardExtend
  // 拨号类型
  dialing_type: DialingType
  // 管理线路
  dialingInfo: DiaLingItemInfo[]
  // 上报带宽(Mbps)
  up_bandwidth: number,
}
/**
 * 业务类型
 */
declare enum BizType {
  PAINET = 1,
  BILIBILI,
}
/**
 * ip协议栈
 */
type IpProtocol = '双栈' | 'IPV4' | 'IPV6'
/**
 * 在线状态
 */
type OnlineStatus = 'online' | 'offline'
/**
 * 设备状态
 * waitingForConfigNetwork 待配置网络
 * auditing 审核中
 * serving 服务中
 * waitingForTest 待测试
 * testedFailed 测试不通
 * abandoned 已下机
 */
type DeviceStatus = 'waitingForConfigNetwork' | 'auditing' | 'serving' | 'waitingForTest' | 'testedFailed' | 'abandoned'
/**
 * 拨号类型
 */
type DialingType = 'PPPOE' | '1VN' | 'PUBLIC_MULTI_IP' | 'PUBLIC_SINGLE_IP'
/**
 * nat类型
 * inner 内网,public 外网
 */
type NatType = 'inner' | 'public'
/**
 * 接入类型
 * host 主机, switch 交换机
 */
type AccessType = 'host' | 'switch'
/**
 * 带宽类型
 * specialLine 专线,multiLine 汇聚
 */
type BandwidthType = 'specialLine' | 'multiLine'
/**
 * 设备硬件扩展
 */
interface DeviceHardwareExtend {
  cpu: DeviceCpuInfo[]
  memory: []
  disk: DeviceDiskInfo[]
  cpu_num: number
  device_type: string
  image_version: string
  memory_size: string
  price: number
  real_tasks: []
  stability_test_result: string
}
/**
 * 设备CPU信息
 */
interface DeviceCpuInfo {
  name: string
  core_number: number
  ghz: string
}
/**
 * 设备磁盘信息
 */
interface DeviceDiskInfo {
  name: string
  type: string
  iops: number
  capacity: number
}

/**
 * 设备网络卡扩展
 */
interface DeviceNetCardExtend {
  net_cards: NetCardInfo[]
}
/**
 * 设备测试结果扩展
 */
interface DeviceTestResultExtend {
  type: string
  maxTestBandwidth: string
  avgTestBandwidth: string
  upBandwidthTestTime: string
  tcpRetransmissionRatio: number
  duration: string
  lineQuality: any
}
/**
 * 设备计费扩展
 */
interface DeviceBillingExtend {
  strategy: StrategyType
  price: number
  price_discount: number
  bandwidth_discount: number
}
/**
 * 计费方式
 */
declare enum StrategyType {
  // 日95
  DAY95 = 1,
  // 包月
  MONTHLY,
}
/**
 * 结算周期
 */
 declare enum SettlementPeriod {
  // 周结
  WEEK = 1,
  // 月结
  MONTH,
}

/**
 * 列表信息返回
 */
interface ListResponse<T> {
  // 列表信息
  data: T[]
  // 总列数
  total: number
  // 总条数
  real_total: number
}
/**
 * 列表信息返回
 */
 interface ListResponse2<T> {
  // 列表信息
  list: T[]
}
/**
 * 收款人类型
 * 1:个人; 2:企业; 3:支付宝
 */
declare enum PayeeType {
  // 个人银行卡
  PERSION = 1,
  // 企业银行卡
  COMPANY,
  // 支付宝
  ALIPAY
}
/**
 * 收款人信息扩展
 */
interface PayeeExtends {
  // 必填项
  name: string
  card_no: string
  card_front_pic: string
  card_back_pic: string

  // 个人 与 企业 必填
  bank: string
  bank_addr: string
  bank_no: string
  
  // 企业必填
  license_pic: string
  address: string
  phone: string
  tax_no: string

  // 支付宝账号
  alipay_account: string
}
/**
 * 用户信息返回
 */
interface UserInfoResponse {
  // 用户ID
  id: number
  phone: string
  amount: number
  password: string
  payee_type: PayeeType
  payee_extends: PayeeExtends
  // 结算周期
  settlement_period: SettlementPeriod
  // 所属商务信息
  source: number
  // 用户角色
  role: RoleType
  ctime: string
  // 是否需要认证
  need_certification: number
  // 小程序认证地址
  certification_link: string
  // web端认证地址
  certification_link_web: string
}
/**
 * 上传文件返回
 */
interface UploadFileResponse {
  name: string
}

/**
 * 质量信息
 */
interface QualityCpuUsage {
	value: number;
	result: string;
}

interface QualityMemUsage {
	value: number;
	result: string;
}

interface QualityDiskReadDelay {
	value: number;
	result: string;
}

interface QualityDiskWriteDelay {
	value: number;
	result: string;
}

interface QualityDiskIop {
	value: number;
	result: string;
}

interface QualityDisk {
	diskName: string;
	sn: string;
	diskType: string;
	diskReadDelay: QualityDiskReadDelay;
	diskWriteDelay: QualityDiskWriteDelay;
	diskIops: QualityDiskIop;
	exceptInfo: string;
}

interface QualityOnlineRate {
	value: number;
	result: string;
}

interface QualityNat {
	value: string;
	result: string;
}

interface QualityMaxDelay {
	value: number;
	result: string;
}

interface QualityMaxLos {
	value: number;
	result: string;
}

interface QualityTestSat {
	value: number;
	result: string;
}

interface QualityTag {
	name: string;
	detail: string;
}

interface LineQualityDelay {
	value: number;
	result: string;
}
interface LineQualityLoss {
	value: number;
	result: string;
}
interface LineQuality {
	lineName: string;
  lineDelay: LineQualityDelay;
  lineLoss: LineQualityLoss;
}

interface QualityInfo {
	deviceUUID: string;
	date: string;
	income: number;
	detail: string;
	result: string;
	cpuUsage: QualityCpuUsage;
	memUsage: QualityMemUsage;
	disk: QualityDisk[];
	onlineRate: QualityOnlineRate;
	nat: QualityNat;
	maxDelay: QualityMaxDelay;
	maxLoss: QualityMaxLos;
	testSat: QualityTestSat;
	tags: QualityTag[];
	remark: string;
  diallingType: string;
  line : LineQuality[];
}

/**
 * 收益信息
 */
interface SettleInfo {
  // 收益金额
  amount: number
  // 95带宽
  bandwidth95: number
  // 结算状态
  unfreeze: number
  // 平台收益
  platform_amount: number
  // 归档
  archive: string
  // 类型
  biz_type: BizType
  // 创建时间
  ctime: string
  // 设备ID
  device_id: string
  // 备注
  remark: string
  // 收益订单号
  settle_order_no: string
}
/**
 * 收益账单(管理员的)
 */
interface SettleBillInfo {
  // 收益金额
  amount: number
  biz_type: BizType
  business: number
  device_id: string
  // 结算周期
  period: string
  phone: string
  // 平台收益 分
  platform_amount: number
  // 平台单价
  platform_price: number
  // 单价
  price: number
  // 用户id
  uid: number
}
/**
 * 账号总体数据
 */
interface AccountTotalData {
  // 累计收益
  total_increase_amount: number
  // 上月收益
  last_mouth_amount: number
  // 本月收益
  current_mouth_amount: number
  // 昨日收益
  last_day_amount: number
  // 所有节点数
  total_device: number
  // 在线节点数
  online_device: number
  // 当前业务总计设备数
  curr_biz_type_total_device: number
  // 当前业务在线设备数
  curr_biz_type_online_device: number
}
/**
 * 监控信息
 */
interface MonitorInfo {
  // CPU使用
  cpuUsage: number
  // 硬盘使用
  diskUsage: number
  // 内存使用
  memUsage: number
  // 上行带宽
  upBandwidth: number
  // 下行带宽
  downBandwidth: number
  // 时间戳
  timestamp: number
}
/**
 * 监控信息返回
 */
interface MonitorInfoResponse {
  code: number
  message: string
  monitors?: MonitorInfo[]
}
/**
 * 网卡信息返回
 */
interface NetCardInfoResponse {
  code: number
  message: string
  netcards: NetCardInfo[]
}
/**
 * 网卡信息
 */
interface NetCardInfo {
  ip: string
  isManager: boolean
  isValid: boolean
  name: string
  speed: number
  dialingInfo: DiaLingItemInfo[]
}
/**
 * 拨号信息
 */
interface DiaLingItemInfo {
  // 网卡的名字
  name?: string
  number: number
  vlanId: string
  account: string
  password: string
  ip: string
  successed: boolean
  connected: boolean
  failedReason: string
  mask: string
  mac: string
  gateway: string
  enableV6: number
  pppoeAC: string
  pppoeService: string
  v4Proto: string
  v6Proto: string
  v6IP: string
  v6Gateway: string
  v6MaskLen: number
  v6Successed: boolean
  v6Connected: boolean
}
/**
 * 测试结果返回
 */
interface TestResultResponse {
  result: TestResultItem[]
}
/**
 * 测试结果子项
 */
interface TestResultItem {
  // 压测平均
  avgTestBandwidth: string
  // 压测最大
  maxTestBandwidth: string
  // 测试时间
  upBandwidthTestTime: string
  // 格式化的时间
  time?: string
  // 耗时
  duration: string
  // 线路质量
  lineQuality: LineQualityItem[]
  // TCP重传率
  tcpRetransmissionRatio: number
  // 压测类型 drop: 丢包测试; limit: 极限测试
  type: TestResultItemType
}
type TestResultItemType = 'drop' | 'limit'
/**
 * 线路质量信息
 */
interface LineQualityItem {
  // 线路名
  name: string
  // 平均速率
  avgUpBandwidth: string
  // 公网IP
  ip: string
  // 网络延迟
  networkDelay: number
  // 丢包率
  packetLossRate: number
}
/**
 * 平台信息
 */
interface OsInfo {
  id: number
  name: string
  version: string
  md5: string
  url: string
}

interface HomeConfigContent {
  title: string
  subtitle: string
  img?: string
  swiperImg: string
}
interface HomeConfigDetail {
  title: string
  text: string
  img: string
}
interface HomeConfigAdvantage {
  label: string
  img: string
}

interface Window {
  __home_config__: {
    logo?: string
    bg?: string
    contents?: HomeConfigContent[]
    details?: HomeConfigDetail[]
    advantageTitle?: string
    advantages?: HomeConfigAdvantage[]
    footerinfos?: string[]
  }
}