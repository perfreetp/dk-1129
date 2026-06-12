import { useState, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Bell, Download, TrendingUp, TrendingDown, Activity, Clock, Zap, FileText } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatNumber } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';

const COLORS = ['#165DFF', '#00B42A', '#FF7D00', '#F53F3F', '#8F5CF6'];

const generateMockData = (appId: string, capabilityId: string, range: string) => {
  const baseMultiplier = appId && appId !== 'all' && !isNaN(parseInt(appId)) ? parseInt(appId) / 10 : 1;
  const capMultiplier = capabilityId && capabilityId !== 'all' && !isNaN(parseInt(capabilityId)) ? parseInt(capabilityId) / 10 : 1;
  
  const data = {
    '24h': [
      { name: '00:00', calls: Math.floor(50 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '04:00', calls: Math.floor(30 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '08:00', calls: Math.floor(120 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '12:00', calls: Math.floor(200 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '16:00', calls: Math.floor(180 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '20:00', calls: Math.floor(100 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
    ],
    '7d': [
      { name: '周一', calls: Math.floor(1200 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '周二', calls: Math.floor(1500 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '周三', calls: Math.floor(1800 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '周四', calls: Math.floor(1300 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '周五', calls: Math.floor(1600 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '周六', calls: Math.floor(800 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
      { name: '周日', calls: Math.floor(600 * baseMultiplier * capMultiplier), success: 0, fail: 0 },
    ],
    '30d': Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1}日`,
      calls: Math.floor((Math.random() * 500 + 800) * baseMultiplier * capMultiplier),
      success: 0,
      fail: 0,
    })),
    '90d': Array.from({ length: 12 }, (_, i) => ({
      name: `第${i + 1}周`,
      calls: Math.floor((Math.random() * 2000 + 5000) * baseMultiplier * capMultiplier),
      success: 0,
      fail: 0,
    })),
  };
  
  return (data[range as keyof typeof data] || data['7d']).map(item => {
    const success = Math.floor(item.calls * (0.92 + Math.random() * 0.06));
    return {
      ...item,
      success,
      fail: item.calls - success,
    };
  });
};

export default function UsageMonitoring() {
  const { capabilities, applications, currentUser } = useAppStore();
  const [selectedCapability, setSelectedCapability] = useState('all');
  const [selectedApp, setSelectedApp] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ threshold: 90, enabled: true });
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string;
    capability: string;
    app: string;
    timeRange: string;
    date: string;
    fileName: string;
    csvContent: string;
  }>>([]);

  const userApps = applications.filter(app => app.userId === currentUser.id);

  const usageData = useMemo(() => 
    generateMockData(selectedApp, selectedCapability, timeRange), 
    [selectedApp, selectedCapability, timeRange]
  );

  const totalCalls = useMemo(() => usageData.reduce((sum, item) => sum + item.calls, 0), [usageData]);
  const totalSuccess = useMemo(() => usageData.reduce((sum, item) => sum + item.success, 0), [usageData]);
  const successRate = useMemo(() => totalCalls > 0 ? ((totalSuccess / totalCalls) * 100).toFixed(1) : '0.0', [totalSuccess, totalCalls]);

  const errorDistribution = useMemo(() => {
    const totalErrors = totalCalls - totalSuccess;
    if (totalErrors === 0) return [
      { name: '参数错误', value: 0 },
      { name: '权限不足', value: 0 },
      { name: '服务异常', value: 0 },
      { name: '超时', value: 0 },
      { name: '其他', value: 0 },
    ];
    return [
      { name: '参数错误', value: Math.floor(totalErrors * 0.35) },
      { name: '权限不足', value: Math.floor(totalErrors * 0.25) },
      { name: '服务异常', value: Math.floor(totalErrors * 0.20) },
      { name: '超时', value: Math.floor(totalErrors * 0.15) },
      { name: '其他', value: totalErrors - Math.floor(totalErrors * 0.95) },
    ];
  }, [totalCalls, totalSuccess]);

  const capabilityOptions = [
    { value: 'all', label: '全部能力' },
    ...capabilities.map(c => ({ value: c.id, label: c.name })),
  ];

  const appOptions = [
    { value: 'all', label: '全部应用' },
    ...userApps.map(a => ({ value: a.id, label: a.name })),
  ];

  const timeRangeOptions = [
    { value: '24h', label: '24小时' },
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' },
  ];

  const getFilterLabel = (type: 'capability' | 'app' | 'timeRange', value: string) => {
    if (type === 'capability') {
      return value === 'all' ? '全部能力' : capabilities.find(c => c.id === value)?.name || '未知';
    }
    if (type === 'app') {
      return value === 'all' ? '全部应用' : userApps.find(a => a.id === value)?.name || '未知';
    }
    return timeRangeOptions.find(o => o.value === value)?.label || '';
  };

  const generateReport = useCallback(() => {
    const selectedCapName = getFilterLabel('capability', selectedCapability);
    const selectedAppName = getFilterLabel('app', selectedApp);
    const selectedRangeName = getFilterLabel('timeRange', timeRange);
    
    const reportData = usageData.map(item => ({
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
    
    const summary = `\n\n======= 汇总统计 =======\n应用: ${selectedAppName}\n能力: ${selectedCapName}\n时间范围: ${selectedRangeName}\n总调用量: ${totalCalls}\n成功调用: ${totalSuccess}\n失败调用: ${totalCalls - totalSuccess}\n整体成功率: ${successRate}%`;

    const errorSummary = `\n\n======= 错误分布 =======\n错误类型,次数,占比\n${errorDistribution.map(e => `${e.name},${e.value},${totalCalls > 0 ? ((e.value / (totalCalls - totalSuccess)) * 100).toFixed(1) : 0}%`).join('\n')}`;

    return csvHeader + csvContent + summary + errorSummary;
  }, [selectedCapability, selectedApp, timeRange, usageData, totalCalls, totalSuccess, successRate, errorDistribution, capabilities, userApps]);

  const handleExportReport = useCallback(() => {
    const selectedCapName = getFilterLabel('capability', selectedCapability);
    const selectedAppName = getFilterLabel('app', selectedApp);
    const fileName = `用量报表_${selectedAppName}_${selectedCapName}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
    
    const fullReport = generateReport();
    
    const blob = new Blob(['\ufeff' + fullReport], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportHistory(prev => [{
      id: Date.now().toString(),
      capability: selectedCapName,
      app: selectedAppName,
      timeRange: timeRangeOptions.find(o => o.value === timeRange)?.label || '',
      date: new Date().toLocaleString('zh-CN'),
      fileName,
      csvContent: fullReport,
    }, ...prev].slice(0, 10));
  }, [selectedCapability, selectedApp, timeRange, generateReport, getFilterLabel, timeRangeOptions]);

  const handleReDownload = useCallback((record: typeof exportHistory[0]) => {
    const blob = new Blob(['\ufeff' + record.csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', record.fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header title="用量监控" subtitle="月报中心" showSearch={false} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="input-field w-40"
            >
              {appOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={selectedCapability}
              onChange={(e) => setSelectedCapability(e.target.value)}
              className="input-field w-40"
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
          <button onClick={handleExportReport} className="btn-primary flex items-center gap-2">
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
                  +12.5% 较上期
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
                  +0.5% 较上期
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
                <p className="text-2xl font-bold text-gray-800">{totalCalls - totalSuccess}</p>
                <p className="text-xs text-danger-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3" />
                  -18% 较上期
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
                  -5ms 较上期
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
              <BarChart data={usageData}>
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
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[80, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, '成功率']} />
                <Line 
                  type="monotone" 
                  dataKey={(item) => item.calls > 0 ? ((item.success / item.calls) * 100).toFixed(1) : '0'} 
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">最近导出记录</h3>
            {exportHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无导出记录</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {exportHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{record.fileName}</p>
                        <p className="text-xs text-gray-500">
                          应用: {record.app} | 能力: {record.capability} | {record.timeRange} | {record.date}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleReDownload(record)}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      重新下载
                    </button>
                  </div>
                ))}
              </div>
            )}
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
