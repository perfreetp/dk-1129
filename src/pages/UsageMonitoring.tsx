import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Bell, Download, TrendingUp, TrendingDown, Activity, Clock, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatNumber } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const mockUsageData = [
  { name: '周一', calls: 1200, success: 1180, fail: 20 },
  { name: '周二', calls: 1500, success: 1470, fail: 30 },
  { name: '周三', calls: 1800, success: 1760, fail: 40 },
  { name: '周四', calls: 1300, success: 1270, fail: 30 },
  { name: '周五', calls: 1600, success: 1580, fail: 20 },
  { name: '周六', calls: 800, success: 790, fail: 10 },
  { name: '周日', calls: 600, success: 595, fail: 5 },
];

const errorDistribution = [
  { name: '参数错误', value: 35 },
  { name: '权限不足', value: 25 },
  { name: '服务异常', value: 20 },
  { name: '超时', value: 15 },
  { name: '其他', value: 5 },
];

const COLORS = ['#165DFF', '#00B42A', '#FF7D00', '#F53F3F', '#8F5CF6'];

const mockAlerts = [
  { id: '1', type: 'warning', title: '调用量异常', message: '短信服务调用量突增50%', time: '10分钟前', status: 'active' },
  { id: '2', type: 'error', title: '成功率下降', message: '地图服务成功率降至85%', time: '30分钟前', status: 'active' },
  { id: '3', type: 'info', title: '额度预警', message: '您的短信服务额度已使用80%', time: '1小时前', status: 'resolved' },
];

export default function UsageMonitoring() {
  const { capabilities } = useAppStore();
  const [selectedCapability, setSelectedCapability] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ threshold: 90, enabled: true });

  const totalCalls = mockUsageData.reduce((sum, item) => sum + item.calls, 0);
  const totalSuccess = mockUsageData.reduce((sum, item) => sum + item.success, 0);
  const successRate = ((totalSuccess / totalCalls) * 100).toFixed(1);

  const capabilityOptions = [
    { value: 'all', label: '全部能力' },
    ...capabilities.map(c => ({ value: c.id, label: c.name })),
  ];

  const timeRangeOptions = [
    { value: '24h', label: '24小时' },
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' },
  ];

  const handleExportReport = () => {
    const selectedCap = selectedCapability === 'all' 
      ? '全部能力' 
      : capabilities.find(c => c.id === selectedCapability)?.name || '未知';
    
    const reportData = mockUsageData.map(item => ({
      日期: item.name,
      总调用量: item.calls,
      成功调用: item.success,
      失败调用: item.fail,
      成功率: `${((item.success / item.calls) * 100).toFixed(1)}%`,
    }));

    const csvHeader = '日期,总调用量,成功调用,失败调用,成功率\n';
    const csvContent = reportData
      .map(row => `${row.日期},${row.总调用量},${row.成功调用},${row.失败调用},${row.成功率}`)
      .join('\n');
    
    const summary = `\n\n汇总统计\n筛选条件: ${selectedCap}\n时间范围: ${timeRangeOptions.find(o => o.value === timeRange)?.label}\n总调用量,总成功,总失败,整体成功率\n${totalCalls},${totalSuccess},${totalCalls - totalSuccess},${successRate}%`;

    const errorSummary = `\n\n错误原因分布\n错误类型,次数\n${errorDistribution.map(e => `${e.name},${e.value}`).join('\n')}`;

    const fullReport = csvHeader + csvContent + summary + errorSummary;
    
    const blob = new Blob(['\ufeff' + fullReport], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `用量报表_${selectedCap}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header title="用量监控" subtitle="查看能力调用数据和告警" showSearch={false} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <select
              value={selectedCapability}
              onChange={(e) => setSelectedCapability(e.target.value)}
              className="input-field w-48"
            >
              {capabilityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field w-32"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <button onClick={handleExportReport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总调用量</p>
                <p className="text-2xl font-bold text-gray-800">{formatNumber(totalCalls)}</p>
                <p className="text-xs text-success-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% 较上周
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">成功率</p>
                <p className="text-2xl font-bold text-gray-800">{successRate}%</p>
                <p className="text-xs text-success-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.5% 较上周
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">错误数</p>
                <p className="text-2xl font-bold text-gray-800">155</p>
                <p className="text-xs text-danger-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -18% 较上周
                </p>
              </div>
              <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">平均响应时间</p>
                <p className="text-2xl font-bold text-gray-800">45ms</p>
                <p className="text-xs text-success-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -5ms 较上周
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">调用量趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" name="总调用" fill="#165DFF" />
                <Bar dataKey="success" name="成功" fill="#00B42A" />
                <Bar dataKey="fail" name="失败" fill="#F53F3F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">成功率趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[80, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, '成功率']} />
                <Line 
                  type="monotone" 
                  dataKey={(item) => ((item.success / item.calls) * 100).toFixed(1)} 
                  name="成功率" 
                  stroke="#00B42A" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">错误分布</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={errorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {errorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">告警通知</h3>
              <button
                onClick={() => setShowAlertModal(true)}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Bell className="w-4 h-4" />
                配置告警
              </button>
            </div>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'error' ? 'bg-danger-50 border-danger-500' :
                    alert.type === 'warning' ? 'bg-warning-50 border-warning-500' :
                    'bg-info-50 border-info-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.status === 'active' ? 'bg-danger-100 text-danger-700' :
                      'bg-success-100 text-success-700'
                    }`}>
                      {alert.status === 'active' ? '待处理' : '已解决'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">最近错误详情</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">能力名称</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">错误类型</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">错误信息</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">请求ID</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">2024-01-15 14:32:18</td>
                  <td className="py-3 px-4 text-sm text-gray-800">短信服务</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 bg-danger-100 text-danger-700 rounded">参数错误</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">手机号格式不正确</td>
                  <td className="py-3 px-4 text-sm text-gray-600">req-20240115-001</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">2024-01-15 14:30:05</td>
                  <td className="py-3 px-4 text-sm text-gray-800">地图服务</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded">服务异常</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">第三方服务超时</td>
                  <td className="py-3 px-4 text-sm text-gray-600">req-20240115-002</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">2024-01-15 14:28:42</td>
                  <td className="py-3 px-4 text-sm text-gray-800">支付服务</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-1 bg-info-100 text-info-700 rounded">权限不足</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">应用未开通该能力</td>
                  <td className="py-3 px-4 text-sm text-gray-600">req-20240115-003</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)} title="告警配置">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">启用告警</p>
              <p className="text-sm text-gray-500">当指标超过阈值时发送通知</p>
            </div>
            <button
              onClick={() => setAlertConfig({ ...alertConfig, enabled: !alertConfig.enabled })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                alertConfig.enabled ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  alertConfig.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">成功率阈值 (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={alertConfig.threshold}
              onChange={(e) => setAlertConfig({ ...alertConfig, threshold: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
              <span>0%</span>
              <span className="font-medium text-gray-800">{alertConfig.threshold}%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">通知方式</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-gray-700">邮件通知</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-gray-700">短信通知</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-gray-700">企业微信通知</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowAlertModal(false)} className="btn-secondary">
              取消
            </button>
            <button className="btn-primary">保存配置</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
