export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatCurrency = (price: number, unit: string): string => {
  if (unit === '%') {
    return `${price}%`;
  }
  return `¥${price.toFixed(4)}/${unit}`;
};

export const generateAccessKey = (): string => {
  return `AKIA${Math.random().toString(36).substring(2, 18).toUpperCase()}`;
};

export const generateSecretKey = (): string => {
  return Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 20);
};

export const getStatusBadge = (status: string): { label: string; className: string } => {
  const statusMap: Record<string, { label: string; className: string }> = {
    online: { label: '正常', className: 'badge-success' },
    maintenance: { label: '维护中', className: 'badge-warning' },
    offline: { label: '离线', className: 'badge-danger' },
    active: { label: '启用', className: 'badge-success' },
    inactive: { label: '停用', className: 'badge-gray' },
    pending: { label: '待审批', className: 'badge-warning' },
    approved: { label: '已通过', className: 'badge-success' },
    rejected: { label: '已拒绝', className: 'badge-danger' },
    published: { label: '已发布', className: 'badge-success' },
    draft: { label: '草稿', className: 'badge-gray' },
  };
  return statusMap[status] || { label: status, className: 'badge-gray' };
};

export const getNotificationTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    downtime: '故障',
    maintenance: '维护',
    info: '通知',
  };
  return typeMap[type] || type;
};

export const getNotificationTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    downtime: 'bg-danger-100 text-danger-700',
    maintenance: 'bg-warning-100 text-warning-700',
    info: 'bg-primary-100 text-primary-700',
  };
  return colorMap[type] || 'bg-gray-100 text-gray-700';
};

export const getRoleLabel = (role: string): string => {
  const roleMap: Record<string, string> = {
    super_admin: '超级管理员',
    admin: '管理员',
    user: '普通用户',
  };
  return roleMap[role] || role;
};

export const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    super_admin: 'bg-danger-100 text-danger-700',
    admin: 'bg-warning-100 text-warning-700',
    user: 'bg-gray-100 text-gray-700',
  };
  return colorMap[role] || 'bg-gray-100 text-gray-700';
};

export const calculatePercentage = (used: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const maskSecretKey = (key: string): string => {
  if (key.length <= 8) return key;
  return key.substring(0, 4) + '****************' + key.substring(key.length - 4);
};

export const maskAccessKey = (key: string): string => {
  if (key.length <= 12) return key;
  return key.substring(0, 8) + '******' + key.substring(key.length - 4);
};
