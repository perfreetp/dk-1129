export interface Capability {
  id: string;
  name: string;
  description: string;
  icon: string;
  domain: string;
  businessDomain: string;
  status: 'online' | 'maintenance' | 'offline';
  rating: number;
  ratingCount: number;
  price: number;
  unit: string;
  freeQuota: number;
  accessDocs: string;
  feeRules: string;
  versionLogs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  userId: string;
  userName: string;
  quota: number;
  quotaUsed: number;
  whitelist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  id: string;
  name: string;
  applicationId: string;
  applicationName: string;
  accessKey: string;
  secretKey: string;
  status: 'active' | 'inactive';
  expiresAt?: string;
  rotatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  capabilityId: string;
  capabilityName: string;
  applicationId: string;
  applicationName: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  approverId?: string;
  approverName?: string;
  comment?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'downtime' | 'maintenance' | 'info';
  status: 'published' | 'draft';
  startTime?: string;
  endTime?: string;
  affectedCapabilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'admin' | 'user';
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Rating {
  id: string;
  capabilityId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  userId: string;
  capabilityId: string;
  capabilityName: string;
  metric: string;
  threshold: number;
  notifyMethods: ('email' | 'sms' | 'wechat')[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface MonitoringOverview {
  todayCalls: number;
  successRate: number;
  errorRate: number;
  avgResponseTime: number;
}

export interface TrendData {
  date: string;
  calls: number;
  successRate: number;
  errorRate: number;
}

export interface ErrorItem {
  code: string;
  message: string;
  count: number;
  percentage: number;
}

export interface CallRecord {
  id: string;
  applicationId: string;
  capabilityId: string;
  status: string;
  errorCode?: string;
  errorMessage?: string;
  responseTime: number;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}
