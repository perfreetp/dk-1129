import { Capability, Application, Credential, Approval, Notification, User, Rating, AlertRule, MonitoringOverview, TrendData, ErrorItem, FAQ } from '../types';

export const mockCapabilities: Capability[] = [
  {
    id: '1',
    name: '短信服务',
    description: '提供企业级短信发送能力，支持验证码、通知、营销等多种场景',
    icon: 'MessageSquare',
    domain: '通信服务',
    businessDomain: '短信服务',
    status: 'online',
    rating: 4.8,
    ratingCount: 1256,
    price: 0.05,
    unit: '条',
    freeQuota: 1000,
    accessDocs: 'https://docs.example.com/sms',
    feeRules: '短信服务采用按量计费方式，阶梯定价，量大从优。',
    versionLogs: [
      'v2.1.0 - 新增国际短信支持',
      'v2.0.0 - 优化发送速度，提升至1000条/秒',
      'v1.5.0 - 增加短信模板审核功能',
      'v1.0.0 - 初始版本发布'
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-10T14:30:00Z'
  },
  {
    id: '2',
    name: '地图服务',
    description: '提供地图展示、地理编码、路径规划等地图相关能力',
    icon: 'Map',
    domain: '位置服务',
    businessDomain: '地图服务',
    status: 'online',
    rating: 4.9,
    ratingCount: 892,
    price: 0.01,
    unit: '次',
    freeQuota: 10000,
    accessDocs: 'https://docs.example.com/map',
    feeRules: '地图服务按调用次数计费，不同接口价格略有差异。',
    versionLogs: [
      'v3.0.0 - 新增3D地图支持',
      'v2.5.0 - 优化路径规划算法',
      'v2.0.0 - 支持全球地图覆盖'
    ],
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-07-05T11:20:00Z'
  },
  {
    id: '3',
    name: '支付服务',
    description: '提供多种支付方式的统一接入能力，支持微信、支付宝、银行卡等',
    icon: 'Wallet',
    domain: '金融服务',
    businessDomain: '支付服务',
    status: 'online',
    rating: 4.7,
    ratingCount: 2156,
    price: 0.6,
    unit: '%',
    freeQuota: 0,
    accessDocs: 'https://docs.example.com/payment',
    feeRules: '支付服务按交易金额的百分比收取手续费。',
    versionLogs: [
      'v2.2.0 - 新增跨境支付支持',
      'v2.1.0 - 优化退款流程',
      'v2.0.0 - 支持分账功能'
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-08-15T16:45:00Z'
  },
  {
    id: '4',
    name: '身份识别',
    description: '提供人脸、身份证、银行卡等多种识别能力',
    icon: 'UserCheck',
    domain: '安全服务',
    businessDomain: '身份识别',
    status: 'maintenance',
    rating: 4.6,
    ratingCount: 678,
    price: 0.5,
    unit: '次',
    freeQuota: 1000,
    accessDocs: 'https://docs.example.com/identity',
    feeRules: '身份识别服务按识别次数计费。',
    versionLogs: [
      'v1.5.0 - 新增活体检测功能',
      'v1.0.0 - 初始版本发布'
    ],
    createdAt: '2024-03-25T10:30:00Z',
    updatedAt: '2024-09-01T09:00:00Z'
  },
  {
    id: '5',
    name: '语音服务',
    description: '提供语音合成、语音识别、语音转写等能力',
    icon: 'Mic',
    domain: 'AI服务',
    businessDomain: '语音服务',
    status: 'online',
    rating: 4.5,
    ratingCount: 445,
    price: 0.001,
    unit: '字符',
    freeQuota: 50000,
    accessDocs: 'https://docs.example.com/voice',
    feeRules: '语音服务按字符数计费。',
    versionLogs: [
      'v2.0.0 - 支持多语言语音合成',
      'v1.0.0 - 初始版本发布'
    ],
    createdAt: '2024-04-10T11:00:00Z',
    updatedAt: '2024-08-20T14:00:00Z'
  },
  {
    id: '6',
    name: '图像识别',
    description: '提供图像分类、目标检测、OCR等图像识别能力',
    icon: 'Image',
    domain: 'AI服务',
    businessDomain: '图像识别',
    status: 'online',
    rating: 4.8,
    ratingCount: 567,
    price: 0.3,
    unit: '次',
    freeQuota: 500,
    accessDocs: 'https://docs.example.com/image',
    feeRules: '图像识别服务按识别次数计费。',
    versionLogs: [
      'v1.3.0 - 新增OCR识别',
      'v1.2.0 - 优化识别准确率',
      'v1.0.0 - 初始版本发布'
    ],
    createdAt: '2024-05-05T09:30:00Z',
    updatedAt: '2024-09-10T10:30:00Z'
  },
  {
    id: '7',
    name: '邮件服务',
    description: '提供企业级邮件发送能力，支持批量发送和模板管理',
    icon: 'Mail',
    domain: '通信服务',
    businessDomain: '邮件服务',
    status: 'online',
    rating: 4.4,
    ratingCount: 321,
    price: 0.02,
    unit: '封',
    freeQuota: 500,
    accessDocs: 'https://docs.example.com/email',
    feeRules: '邮件服务按发送数量计费。',
    versionLogs: [
      'v1.1.0 - 新增邮件模板功能',
      'v1.0.0 - 初始版本发布'
    ],
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-08-25T15:00:00Z'
  },
  {
    id: '8',
    name: '消息队列',
    description: '提供高可用、高性能的消息队列服务',
    icon: 'MessageCircle',
    domain: '基础服务',
    businessDomain: '消息队列',
    status: 'offline',
    rating: 4.9,
    ratingCount: 189,
    price: 0.0001,
    unit: '消息',
    freeQuota: 100000,
    accessDocs: 'https://docs.example.com/mq',
    feeRules: '消息队列服务按消息数量计费。',
    versionLogs: [
      'v1.0.0 - 初始版本发布'
    ],
    createdAt: '2024-07-15T08:00:00Z',
    updatedAt: '2024-09-05T12:00:00Z'
  }
];

export const mockApplications: Application[] = [
  {
    id: '1',
    name: '用户中心',
    description: '企业用户管理核心系统',
    status: 'active',
    userId: '1',
    userName: '张三',
    quota: 100000,
    quotaUsed: 23456,
    whitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-10T14:30:00Z'
  },
  {
    id: '2',
    name: '订单系统',
    description: '电商订单管理系统',
    status: 'active',
    userId: '1',
    userName: '张三',
    quota: 50000,
    quotaUsed: 48901,
    whitelist: ['172.16.0.0/12'],
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-09-08T16:20:00Z'
  },
  {
    id: '3',
    name: '营销平台',
    description: '营销活动管理平台',
    status: 'inactive',
    userId: '2',
    userName: '李四',
    quota: 20000,
    quotaUsed: 15678,
    whitelist: [],
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-09-01T10:00:00Z'
  }
];

export const mockCredentials: Credential[] = [
  {
    id: '1',
    name: '生产凭证',
    applicationId: '1',
    applicationName: '用户中心',
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: '测试凭证',
    applicationId: '1',
    applicationName: '用户中心',
    accessKey: 'AKIAIOSFODNN7EXAMPLE2',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY2',
    status: 'active',
    expiresAt: '2025-01-15T10:30:00Z',
    createdAt: '2024-06-15T09:00:00Z',
    updatedAt: '2024-06-15T09:00:00Z'
  },
  {
    id: '3',
    name: '生产凭证',
    applicationId: '2',
    applicationName: '订单系统',
    accessKey: 'AKIAIOSFODNN7EXAMPLE3',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY3',
    status: 'active',
    createdAt: '2024-02-20T09:30:00Z',
    updatedAt: '2024-02-20T09:30:00Z'
  }
];

export const mockApprovals: Approval[] = [
  {
    id: '1',
    capabilityId: '1',
    capabilityName: '短信服务',
    applicationId: '1',
    applicationName: '用户中心',
    userId: '1',
    userName: '张三',
    status: 'approved',
    reason: '用于用户注册验证码和密码找回',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    approverId: '3',
    approverName: '管理员',
    comment: '审批通过，请合理使用'
  },
  {
    id: '2',
    capabilityId: '3',
    capabilityName: '支付服务',
    applicationId: '2',
    applicationName: '订单系统',
    userId: '1',
    userName: '张三',
    status: 'pending',
    reason: '用于电商平台支付功能',
    createdAt: '2024-09-10T09:00:00Z',
    updatedAt: '2024-09-10T09:00:00Z'
  },
  {
    id: '3',
    capabilityId: '4',
    capabilityName: '身份识别',
    applicationId: '1',
    applicationName: '用户中心',
    userId: '1',
    userName: '张三',
    status: 'rejected',
    reason: '用于实名认证功能',
    createdAt: '2024-09-05T10:00:00Z',
    updatedAt: '2024-09-06T11:00:00Z',
    approverId: '3',
    approverName: '管理员',
    comment: '暂不开放，等待安全评估'
  },
  {
    id: '4',
    capabilityId: '2',
    capabilityName: '地图服务',
    applicationId: '3',
    applicationName: '营销平台',
    userId: '2',
    userName: '李四',
    status: 'pending',
    reason: '用于线下门店位置展示',
    createdAt: '2024-09-11T08:30:00Z',
    updatedAt: '2024-09-11T08:30:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '身份识别服务维护通知',
    content: '身份识别服务将于2024-09-15 00:00-04:00进行系统维护，期间服务将暂停，请提前做好业务安排。',
    type: 'maintenance',
    status: 'published',
    startTime: '2024-09-15T00:00:00Z',
    endTime: '2024-09-15T04:00:00Z',
    affectedCapabilities: ['4'],
    createdAt: '2024-09-10T10:00:00Z',
    updatedAt: '2024-09-10T10:00:00Z'
  },
  {
    id: '2',
    title: '消息队列服务故障公告',
    content: '消息队列服务于2024-09-11 08:00出现故障，目前正在紧急修复中，预计1小时内恢复。',
    type: 'downtime',
    status: 'published',
    startTime: '2024-09-11T08:00:00Z',
    affectedCapabilities: ['8'],
    createdAt: '2024-09-11T08:05:00Z',
    updatedAt: '2024-09-11T08:05:00Z'
  },
  {
    id: '3',
    title: '支付服务新增功能通知',
    content: '支付服务将于近期新增跨境支付功能，支持美元、欧元等多种货币。',
    type: 'info',
    status: 'published',
    affectedCapabilities: ['3'],
    createdAt: '2024-09-08T14:00:00Z',
    updatedAt: '2024-09-08T14:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'zhangsan',
    name: '张三',
    role: 'user',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 'active',
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: '2',
    username: 'lisi',
    name: '李四',
    role: 'user',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 'active',
    createdAt: '2024-02-15T09:00:00Z'
  },
  {
    id: '3',
    username: 'admin',
    name: '管理员',
    role: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    username: 'superadmin',
    name: '超级管理员',
    role: 'super_admin',
    email: 'superadmin@example.com',
    phone: '13800138003',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockRatings: Rating[] = [
  {
    id: '1',
    capabilityId: '1',
    userId: '1',
    userName: '张三',
    rating: 5,
    comment: '非常好用，发送速度快，稳定性高',
    createdAt: '2024-09-01T10:00:00Z'
  },
  {
    id: '2',
    capabilityId: '1',
    userId: '2',
    userName: '李四',
    rating: 4,
    comment: '整体不错，希望能增加更多模板',
    createdAt: '2024-08-25T14:30:00Z'
  },
  {
    id: '3',
    capabilityId: '2',
    userId: '1',
    userName: '张三',
    rating: 5,
    comment: '地图服务很稳定，API文档清晰',
    createdAt: '2024-09-05T11:00:00Z'
  }
];

export const mockAlertRules: AlertRule[] = [
  {
    id: '1',
    userId: '1',
    capabilityId: '1',
    capabilityName: '短信服务',
    metric: 'errorRate',
    threshold: 5,
    notifyMethods: ['email', 'sms'],
    status: 'active',
    createdAt: '2024-09-01T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    capabilityId: '3',
    capabilityName: '支付服务',
    metric: 'successRate',
    threshold: 99,
    notifyMethods: ['email'],
    status: 'active',
    createdAt: '2024-09-05T14:00:00Z'
  }
];

export const mockMonitoringOverview: MonitoringOverview = {
  todayCalls: 125680,
  successRate: 99.2,
  errorRate: 0.8,
  avgResponseTime: 125
};

export const mockTrendData: TrendData[] = [
  { date: '09-05', calls: 102450, successRate: 98.5, errorRate: 1.5 },
  { date: '09-06', calls: 115680, successRate: 99.1, errorRate: 0.9 },
  { date: '09-07', calls: 108920, successRate: 99.3, errorRate: 0.7 },
  { date: '09-08', calls: 125340, successRate: 99.0, errorRate: 1.0 },
  { date: '09-09', calls: 118760, successRate: 99.4, errorRate: 0.6 },
  { date: '09-10', calls: 132450, successRate: 99.2, errorRate: 0.8 },
  { date: '09-11', calls: 125680, successRate: 99.2, errorRate: 0.8 }
];

export const mockErrorItems: ErrorItem[] = [
  { code: 'E001', message: '参数错误', count: 56, percentage: 35 },
  { code: 'E002', message: '权限不足', count: 32, percentage: 20 },
  { code: 'E003', message: '服务超时', count: 28, percentage: 17.5 },
  { code: 'E004', message: '额度用尽', count: 24, percentage: 15 },
  { code: '其他', message: '其他错误', count: 20, percentage: 12.5 }
];

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: '如何申请能力开通？',
    answer: '在能力目录中选择需要的能力，点击申请按钮，填写申请信息后提交审批。审批通过后即可使用。',
    category: '申请流程',
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: '2',
    question: '调用凭证如何获取？',
    answer: '在应用管理中进入应用详情，点击"生成凭证"按钮即可生成新的调用凭证。',
    category: '凭证管理',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '3',
    question: '额度不够用怎么办？',
    answer: '可以在应用详情的额度配置中申请调整额度，提交后由管理员审批。',
    category: '额度管理',
    createdAt: '2024-02-01T09:00:00Z'
  },
  {
    id: '4',
    question: '如何查看调用统计？',
    answer: '在用量监控页面可以查看调用量、成功率、错误率等统计数据。',
    category: '监控统计',
    createdAt: '2024-02-10T11:00:00Z'
  },
  {
    id: '5',
    question: '服务故障如何获取通知？',
    answer: '在故障公告页面可以订阅告警通知，支持邮件、短信等多种通知方式。',
    category: '故障通知',
    createdAt: '2024-03-01T10:00:00Z'
  }
];

export const domains = ['全部', '通信服务', '位置服务', '金融服务', '安全服务', 'AI服务', '基础服务'];
