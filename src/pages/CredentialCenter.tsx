import { useState } from 'react';
import { Plus, RefreshCw, Copy, Eye, EyeOff, Trash2, Package, ChevronDown, AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatDate, maskSecretKey } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

export default function CredentialCenter() {
  const { applications, credentials, addCredential, rotateCredential, deleteCredential, currentUser, addOperationLog } = useAppStore();
  
  const [selectedAppId, setSelectedAppId] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteCredId, setDeleteCredId] = useState('');
  const [rotateCredId, setRotateCredId] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState('');
  const [credentialName, setCredentialName] = useState('');

  const userApps = applications.filter(app => app.userId === currentUser.id);
  const selectedApp = userApps.find(app => app.id === selectedAppId);
  const appCredentials = selectedAppId ? credentials.filter(c => c.applicationId === selectedAppId) : [];

  const handleCreate = () => {
    if (!credentialName.trim() || !selectedAppId) return;
    addCredential({
      name: credentialName,
      applicationId: selectedAppId,
      applicationName: selectedApp?.name || '',
    });
    addOperationLog({
      userId: currentUser.id,
      userName: currentUser.name,
      applicationId: selectedAppId,
      applicationName: selectedApp?.name || '',
      operation: 'create_credential',
      operationName: '创建凭证',
      detail: `创建凭证 "${credentialName}"`,
    });
    setShowCreateModal(false);
    setCredentialName('');
  };

  const handleRotate = () => {
    if (rotateCredId) {
      const cred = credentials.find(c => c.id === rotateCredId);
      rotateCredential(rotateCredId);
      addOperationLog({
        userId: currentUser.id,
        userName: currentUser.name,
        applicationId: cred?.applicationId || '',
        applicationName: cred?.applicationName || '',
        operation: 'rotate_credential',
        operationName: '轮换密钥',
        detail: `轮换凭证 "${cred?.name}" 的密钥`,
      });
      setShowRotateModal(false);
      setRotateCredId('');
    }
  };

  const handleDelete = () => {
    if (deleteCredId) {
      const cred = credentials.find(c => c.id === deleteCredId);
      deleteCredential(deleteCredId);
      addOperationLog({
        userId: currentUser.id,
        userName: currentUser.name,
        applicationId: cred?.applicationId || '',
        applicationName: cred?.applicationName || '',
        operation: 'delete_credential',
        operationName: '删除凭证',
        detail: `删除凭证 "${cred?.name}"`,
      });
      setShowDeleteDialog(false);
      setDeleteCredId('');
    }
  };

  const handleCopy = (secretKey: string) => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(secretKey);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const toggleVisibility = (credId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(credId)) {
      newVisible.delete(credId);
    } else {
      newVisible.add(credId);
    }
    setVisibleKeys(newVisible);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="调用凭证" subtitle="管理应用的API调用凭证" showSearch={false} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="card mb-6 bg-warning-50 border-warning-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-warning-800">安全提示</h4>
              <p className="text-sm text-warning-700">
                请妥善保管您的密钥，不要将其泄露给第三方。定期轮换密钥可以提高安全性。
              </p>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">选择应用</span>
            </div>
            <div className="relative flex-1 max-w-md">
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="input-field appearance-none pr-10"
              >
                <option value="">请选择应用</option>
                {userApps.map((app) => (
                  <option key={app.id} value={app.id}>{app.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {selectedApp && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">当前凭证数量:</span>
                <span className="font-semibold text-primary-600">{appCredentials.length}</span>
              </div>
            )}
          </div>
        </div>

        {!selectedAppId ? (
          <EmptyState
            title="请选择应用"
            description="选择一个应用来查看和管理其调用凭证"
          />
        ) : appCredentials.length === 0 ? (
          <EmptyState
            title="暂无凭证"
            description="创建凭证后即可开始调用开放能力API"
            action={
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建凭证
              </button>
            }
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500">
                应用 <span className="font-semibold text-gray-800">{selectedApp?.name}</span> 共有 {appCredentials.length} 个凭证
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建凭证
              </button>
            </div>

            <div className="space-y-4">
              {appCredentials.map((credential) => (
                <div key={credential.id} className="card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-800">{credential.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-success-100 text-success-700 rounded">
                            {credential.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Access Key:</span>
                            <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {credential.accessKey}
                            </code>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Secret Key:</span>
                            <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {visibleKeys.has(credential.id) ? credential.secretKey : maskSecretKey(credential.secretKey)}
                            </code>
                            <button
                              onClick={() => toggleVisibility(credential.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {visibleKeys.has(credential.id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleCopy(credential.secretKey)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {copiedKey === credential.secretKey && (
                              <span className="text-xs text-success-600">已复制</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRotateCredId(credential.id);
                          setShowRotateModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        轮换密钥
                      </button>
                      <button
                        onClick={() => {
                          setDeleteCredId(credential.id);
                          setShowDeleteDialog(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
                    <span>创建于 {formatDate(credential.createdAt)}</span>
                    {credential.rotatedAt && (
                      <span>最近轮换: {formatDate(credential.rotatedAt)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="创建凭证">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">凭证名称</label>
            <input
              type="text"
              value={credentialName}
              onChange={(e) => setCredentialName(e.target.value)}
              placeholder="请输入凭证名称"
              className="input-field"
            />
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              所属应用: <span className="font-medium">{selectedApp?.name}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={!credentialName.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              创建
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showRotateModal} onClose={() => setShowRotateModal(false)} title="轮换密钥">
        <div className="space-y-4">
          <p className="text-gray-600">
            轮换密钥将生成新的 Secret Key，原密钥将在5分钟后失效。请确保在轮换前更新您的应用配置。
          </p>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowRotateModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={handleRotate}
              className="btn-primary"
            >
              确认轮换
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="删除凭证"
        message="确定要删除此凭证吗？删除后将无法使用该凭证调用API。"
        danger
      />
    </div>
  );
}
