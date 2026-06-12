import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Key, Settings, Globe, ChevronRight, Clock, Package } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatDate, getStatusBadge, calculatePercentage } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

export default function ApplicationManagement() {
  const navigate = useNavigate();
  const { applications, addApplication, deleteApplication, currentUser, getCredentialsByAppId } = useAppStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteAppId, setDeleteAppId] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });

  const userApps = applications.filter(app => app.userId === currentUser.id);

  const handleCreate = () => {
    if (!formData.name.trim()) return;
    addApplication({
      name: formData.name,
      description: formData.description,
      status: 'active',
      userId: currentUser.id,
      userName: currentUser.name,
      quota: 10000,
      quotaUsed: 0,
      whitelist: [],
    });
    setShowCreateModal(false);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = () => {
    if (deleteAppId) {
      deleteApplication(deleteAppId);
      setShowDeleteDialog(false);
      setDeleteAppId('');
    }
  };

  const getActionButtons = (appId: string) => {
    const credCount = getCredentialsByAppId(appId).length;
    
    return [
      { icon: Key, label: '调用凭证', path: `/applications/${appId}/credentials`, count: credCount },
      { icon: Settings, label: '额度配置', path: `/applications/${appId}/quota` },
      { icon: Globe, label: '白名单', path: `/applications/${appId}/whitelist` },
    ];
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="应用管理" subtitle="管理您的应用和配置" showSearch={false} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索应用..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            创建应用
          </button>
        </div>

        {userApps.length === 0 ? (
          <EmptyState
            title="暂无应用"
            description="创建第一个应用来开始使用开放能力"
            action={
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建应用
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userApps.map((app) => {
              const statusBadge = getStatusBadge(app.status);
              const percentage = calculatePercentage(app.quotaUsed, app.quota);
              const actions = getActionButtons(app.id);
              
              return (
                <div key={app.id} className="card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{app.name}</h3>
                        <span className={`badge ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteAppId(app.id);
                          setShowDeleteDialog(true);
                        }}
                        className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-danger-500" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">{app.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">额度使用</span>
                      <span className="text-gray-700 font-medium">
                        {app.quotaUsed.toLocaleString()} / {app.quota.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage > 80 ? 'bg-danger-500' :
                          percentage > 50 ? 'bg-warning-500' : 'bg-success-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.whitelist.slice(0, 3).map((ip) => (
                      <span key={ip} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {ip}
                      </span>
                    ))}
                    {app.whitelist.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">
                        +{app.whitelist.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-2">
                      {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.label}
                            onClick={() => navigate(action.path)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all"
                          >
                            <Icon className="w-4 h-4" />
                            {action.label}
                            {action.count !== undefined && (
                              <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                                {action.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      创建于 {formatDate(app.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="创建应用">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">应用名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入应用名称"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">应用描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="请输入应用描述"
              className="input-field resize-none"
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={!formData.name.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              创建
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="删除应用"
        message="确定要删除此应用吗？删除后将无法恢复，相关的调用凭证也将被删除。"
        danger
      />
    </div>
  );
}
