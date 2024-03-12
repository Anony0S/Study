import { WithDrawType, StrategyType, PayeeType, RoleType, SettlementPeriod } from './type'

// 1 申请中 2 已拒绝 3 打款中 4 打款驳回 5 打款完成
export const withdrawTypeTag: {
  [key in WithDrawType]: {
    label: string;
    type: string;
  };
} = {
  [WithDrawType.Applying]: {
    label: "申请中",
    type: "info",
  },
  [WithDrawType.Refuse]: {
    label: "已拒绝",
    type: "danger",
  },
  [WithDrawType.Moneying]: {
    label: "打款中",
    type: "info",
  },
  [WithDrawType.Reject]: {
    label: "打款驳回",
    type: "danger",
  },
  [WithDrawType.Done]: {
    label: "打款完成",
    type: "success",
  },
};

export const accessTypeStr: {
  [key in AccessType]: string;
} = {
  host: "主机",
  switch: "交换机",
};
export const bandwidthTypeStr: {
  [key in BandwidthType]: string;
} = {
  specialLine: "专线",
  multiLine: "汇聚",
};
export const dialingTypeStr: {
  [key in DialingType]: string;
} = {
  PPPOE: "服务器拨号",
  "1VN": "路由器",
  PUBLIC_MULTI_IP: "固定公网多IP",
  PUBLIC_SINGLE_IP: "固定公网单IP",
};
export const deviceStatusStr: {
  [key in DeviceStatus]: string;
} = {
  waitingForConfigNetwork: "待配置网络",
  auditing: "审核中",
  serving: "服务中",
  waitingForTest: "待测试",
  testedFailed: "测试不通",
  abandoned: "已下机"
};
/**
 * 计费策略
 */
export const billingStr: {
  [key in StrategyType]: string;
} = {
  [StrategyType.DAY95]: '日95',
  [StrategyType.MONTHLY]: '包月',
}
/**
 * 计费策略
 */
export const settlementPeriodStr: {
  [key in SettlementPeriod]: string;
} = {
  [SettlementPeriod.WEEK]: '周结',
  [SettlementPeriod.MONTH]: '月结',
}
/**
 * 收款人类型
 */
export const payeeTypeStr: {
  [key in PayeeType]: string;
} = {
  [PayeeType.PERSION]: '个人银行卡',
  [PayeeType.COMPANY]: '企业银行卡',
  [PayeeType.ALIPAY]: '支付宝',
}

/**
 * 身份类型
 */
 export const roleTypeStr: {
  [key in RoleType]: string;
} = {
  [RoleType.ALL]: '未知',
  [RoleType.USER]: '用户',
  [RoleType.BUSINESS]: '商务',
  [RoleType.ADMIN]: '管理员',
}