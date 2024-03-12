/**
 * 用户的身份
 */
export enum RoleType {
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
 * 用户的菜单
 */
export enum UserMenuType {
  DATA = 'data',
  NODE_LIST = 'nodelist',
  BIND_NODE = 'bindnode',
  BILL = 'bill',
  USER = 'user',
}
/**
 * 管理员菜单
 */
export enum AdminMenuType {
  DATA = 'data',
  NODE_MANAGE = 'node_manage',
  USER_MANAGE = 'user_manage',
  WITHDRA_MANAGE = 'withdra_manage',
  SETTLE = 'settle'
}
/**
 * 提现状态
 * 1 申请中 2 已拒绝 3 打款中 4 打款驳回 5 打款完成
 */
export enum WithDrawType {
  Applying = 1,
  Refuse,
  Moneying,
  Reject,
  Done
}
/**
 * 接入类型
 * host 主机, switch 交换机
 */
export enum AccessType {
  Host = 'host',
  Switch ='switch',
}
/**
 * 节点信息中的子模块列表
 */
export enum NodeListComps {
  // 性能相关
  Monitor = 'monitor',
  // 网卡信息
  NetCard = 'netcard',
  // 拨号信息
  Dialing = 'dialing',
  // 硬件 磁盘/CPU
  Hardware = 'hardware',
  // 收益
  Settle = 'settle',
  // 计费策略
  Billing = 'billing',
  // 压测结果
  Test = 'test'
}
/**
 * 计费方式
 */
export enum StrategyType {
  // 日95
  DAY95 = 1,
  // 包月
  MONTHLY,
}
/**
 * 收款人类型
 */
 export enum PayeeType {
  // 个人银行卡
  PERSION = 1,
  // 企业银行卡
  COMPANY,
  // 支付宝
  ALIPAY
}
/**
 * 结算周期
 */
export enum SettlementPeriod {
  // 周结
  WEEK = 1,
  // 月结
  MONTH,
}