import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit, Trash2, Users, Package, FileText, Download, Search, Filter, MessageSquare, Map, Wallet, UserCheck, Mic, Image, Mail, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatDate, getStatusBadge } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Map,
  Wallet,
  UserCheck,
  Mic,
  Image,
  Mail,
  MessageCircle,
};

const tabs = [
  { id: 'overview', label: '概览', icon: FileText },
  { id: 'capabilities', label: '能力管理', icon: Package },
  { id: 'users', label: '用户管理', icon: Users },
];

const mockUsageStats = [
  { name: '短信', calls: 12500, apps: 28 },
  { name: '地图', calls: 8300, apps: 15 },
  { name: '支付', calls: 5600, apps: 12 },
  { name: '人脸', calls: 3200, apps: 8 },
  { name: '语音', calls: 4100, apps: 10 },
  { name: '图像', calls: 6800, apps: 14 },
];

export default function AdminDashboard() {
  const { capabilities, users, approvals, addCapability, deleteCapability, deleteUser } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteType, setDeleteType] = useState<'capability' | 'user'>('capability');
  const [deleteId, setDeleteId] = useState('');
  const [newCapability, setNewCapability] = useState({
    name: '',
    description: '',
    icon: 'MessageSquare',
    businessDomain: '',
    price: 0,
    freeQuota: 1000,
    unit: '次',
  });

  const handleCreateCapability = () => {
    if (!newCapability.name || !newCapability.description) return;
    addCapability({
      name: newCapability.name,
      description: newCapability.description,
      icon: newCapability.icon,
      businessDomain: newCapability.businessDomain,
      price: newCapability.price,
      freeQuota: newCapability.freeQuota,
      unit: newCapability.unit,
    });
    setShowCreateModal(false);
    setNewCapability({
      name: '',
      description: '',
      icon: 'MessageSquare',
      businessDomain: '',
      price: 0,
      freeQuota: 1000,
      unit: '次',
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      if (deleteType === 'capability') {
        deleteCapability(deleteId);
      } else {
        deleteUser(deleteId);
      }
      setShowDeleteDialog(false);
      setDeleteId('');
    }
  };

  const filteredCapabilities = capabilities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingApprovals = approvals.filter(a => a.status === 'pending').length;

  return (
    <div className="flex-1 flex flex-col">
      <Header title="运营后台" subtitle="管理平台能力和用户" showSearch={false} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex border-b border-gray-100 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{capabilities.length}</p>
                    <p className="text-sm text-gray-500">能力总数</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                    <p className="text-sm text-gray-500">用户总数</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{pendingApprovals}</p>
                    <p className="text-sm text-gray-500">待审批</p>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-info-100 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-info-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">12.5万</p>
                    <p className="text-sm text-gray-500">月调用量</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">能力调用排行</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockUsageStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" name="调用量" fill="#165DFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">待处理审批</h3>
                <div className="space-y-3">
                  {approvals
                    .filter(a => a.status === 'pending')
                    .slice(0, 5)
                    .map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800">{approval.capabilityName}</p>
                          <p className="text-sm text-gray-500">{approval.userName} - {formatDate(approval.createdAt)}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded">待审批</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">最近新增用户</h3>
                <div className="space-y-3">
                  {users.slice(-5).reverse().map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索能力..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加能力
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCapabilities.map((capability) => {
                const Icon = iconMap[capability.icon] || MessageSquare;
                const statusBadge = getStatusBadge(capability.status);
                
                return (
                  <div key={capability.id} className="card-hover">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          capability.status === 'online' ? 'bg-primary-100' :
                          capability.status === 'maintenance' ? 'bg-warning-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            capability.status === 'online' ? 'text-primary-600' :
                            capability.status === 'maintenance' ? 'text-warning-600' : 'text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{capability.name}</h3>
                            <span className={`badge ${statusBadge.className}`}>{statusBadge.label}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{capability.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{capability.businessDomain}</span>
                            <span>{capability.price}元/{capability.unit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteType('capability');
                            setDeleteId(capability.id);
                            setShowDeleteDialog(true);
                          }}
                          className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-danger-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索用户..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">姓名</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">邮箱</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">角色</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">创建时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role === 'admin' ? '管理员' : '普通用户'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteType('user');
                                setDeleteId(user.id);
                                setShowDeleteDialog(true);
                              }}
                              className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-danger-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="添加能力" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">能力名称</label>
            <input
              type="text"
              value={newCapability.name}
              onChange={(e) => setNewCapability({ ...newCapability, name: e.target.value })}
              placeholder="请输入能力名称"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">能力描述</label>
            <textarea
              value={newCapability.description}
              onChange={(e) => setNewCapability({ ...newCapability, description: e.target.value })}
              rows={3}
              placeholder="请输入能力描述"
              className="input-field resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">业务域</label>
              <select
                value={newCapability.businessDomain}
                onChange={(e) => setNewCapability({ ...newCapability, businessDomain: e.target.value })}
                className="input-field"
              >
                <option value="">请选择业务域</option>
                <option value="短信服务">短信服务</option>
                <option value="地图服务">地图服务</option>
                <option value="支付服务">支付服务</option>
                <option value="身份识别">身份识别</option>
                <option value="语音服务">语音服务</option>
                <option value="图像服务">图像服务</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">图标</label>
              <select
                value={newCapability.icon}
                onChange={(e) => setNewCapability({ ...newCapability, icon: e.target.value })}
                className="input-field"
              >
                {Object.entries(iconMap).map(([key]) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">单价 (元)</label>
              <input
                type="number"
                value={newCapability.price}
                onChange={(e) => setNewCapability({ ...newCapability, price: Number(e.target.value) })}
                placeholder="0.00"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">免费额度</label>
              <input
                type="number"
                value={newCapability.freeQuota}
                onChange={(e) => setNewCapability({ ...newCapability, freeQuota: Number(e.target.value) })}
                placeholder="1000"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">单位</label>
              <input
                type="text"
                value={newCapability.unit}
                onChange={(e) => setNewCapability({ ...newCapability, unit: e.target.value })}
                placeholder="次"
                className="input-field"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={handleCreateCapability}
              disabled={!newCapability.name || !newCapability.description}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title={`删除${deleteType === 'capability' ? '能力' : '用户'}`}
        message={`确定要删除此${deleteType === 'capability' ? '能力' : '用户'}吗？删除后将无法恢复。`}
        danger
      />
    </div>
  );
}
