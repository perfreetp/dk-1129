import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Eye, RefreshCw, Filter, MessageSquare, Map, Wallet, UserCheck, Mic, Image, Mail, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatDate } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

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

const statusConfig = {
  pending: { label: '待审批', color: 'bg-warning-100 text-warning-700', icon: Clock },
  approved: { label: '已通过', color: 'bg-success-100 text-success-700', icon: CheckCircle2 },
  rejected: { label: '已拒绝', color: 'bg-danger-100 text-danger-700', icon: XCircle },
};

export default function ApprovalManagement() {
  const navigate = useNavigate();
  const { approvals, capabilities, approveApproval, rejectApproval, currentUser } = useAppStore();
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<typeof approvals[0] | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionApprovalId, setActionApprovalId] = useState('');

  const userApprovals = approvals.filter(a => a.userId === currentUser.id);
  const isAdmin = currentUser.role === 'admin';
  const pendingApprovals = isAdmin ? approvals.filter(a => a.status === 'pending') : userApprovals;

  const filteredApprovals = filterStatus === 'all' 
    ? pendingApprovals 
    : pendingApprovals.filter(a => a.status === filterStatus);

  const handleViewDetail = (approval: typeof approvals[0]) => {
    setSelectedApproval(approval);
    setShowDetailModal(true);
  };

  const handleAction = (approvalId: string, type: 'approve' | 'reject') => {
    setActionApprovalId(approvalId);
    setActionType(type);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (actionType === 'approve') {
      approveApproval(actionApprovalId);
    } else {
      rejectApproval(actionApprovalId);
    }
    setShowActionModal(false);
    setActionApprovalId('');
  };

  const getCapabilityIcon = (capabilityId: string) => {
    const capability = capabilities.find(c => c.id === capabilityId);
    const Icon = iconMap[capability?.icon || 'MessageSquare'];
    return Icon;
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title={isAdmin ? '审批管理' : '我的申请'} 
        subtitle={isAdmin ? '处理能力开通申请' : '查看您的申请状态'} 
        showSearch={false} 
      />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">全部状态</option>
                <option value="pending">待审批</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>
          </div>
          {isAdmin && (
            <button className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              刷新列表
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {approvals.filter(a => a.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-500">待审批</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {approvals.filter(a => a.status === 'approved').length}
                </p>
                <p className="text-sm text-gray-500">已通过</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {approvals.filter(a => a.status === 'rejected').length}
                </p>
                <p className="text-sm text-gray-500">已拒绝</p>
              </div>
            </div>
          </div>
        </div>

        {filteredApprovals.length === 0 ? (
          <EmptyState
            title={filterStatus === 'all' ? '暂无申请' : '暂无相关申请'}
            description={isAdmin ? '等待业务团队提交能力开通申请' : '您还没有提交任何能力开通申请'}
          />
        ) : (
          <div className="space-y-4">
            {filteredApprovals.map((approval) => {
              const status = statusConfig[approval.status];
              const StatusIcon = status.icon;
              const CapabilityIcon = getCapabilityIcon(approval.capabilityId);
              
              return (
                <div key={approval.id} className="card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <CapabilityIcon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-800">{approval.capabilityName}</h3>
                          <span className={`badge ${status.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          应用: {approval.applicationName} | 申请人: {approval.userName}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>申请时间: {formatDate(approval.createdAt)}</span>
                          {approval.processedAt && (
                            <span>处理时间: {formatDate(approval.processedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(approval)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        查看详情
                      </button>
                      {isAdmin && approval.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(approval.id, 'approve')}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            通过
                          </button>
                          <button
                            onClick={() => handleAction(approval.id, 'reject')}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            拒绝
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="申请详情" size="lg">
        {selectedApproval && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">能力名称</p>
                <p className="font-medium text-gray-800">{selectedApproval.capabilityName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">应用名称</p>
                <p className="font-medium text-gray-800">{selectedApproval.applicationName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">申请人</p>
                <p className="font-medium text-gray-800">{selectedApproval.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">申请状态</p>
                <span className={`badge ${statusConfig[selectedApproval.status].color}`}>
                  {statusConfig[selectedApproval.status].label}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">申请时间</p>
                <p className="font-medium text-gray-800">{formatDate(selectedApproval.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">处理时间</p>
                <p className="font-medium text-gray-800">{selectedApproval.processedAt ? formatDate(selectedApproval.processedAt) : '-'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">申请用途</p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{selectedApproval.reason}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setShowDetailModal(false)} className="btn-secondary">
                关闭
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showActionModal} onClose={() => setShowActionModal(false)} title={actionType === 'approve' ? '通过申请' : '拒绝申请'}>
        <div className="space-y-4">
          <p className="text-gray-600">
            {actionType === 'approve' 
              ? '确定要通过此申请吗？通过后申请人将可以使用该能力。' 
              : '确定要拒绝此申请吗？请在下方输入拒绝原因。'}
          </p>
          
          {actionType === 'reject' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">拒绝原因</label>
              <textarea
                rows={3}
                placeholder="请输入拒绝原因..."
                className="input-field resize-none"
              />
            </div>
          )}
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowActionModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={confirmAction}
              className={actionType === 'approve' ? 'btn-primary' : 'btn-danger'}
            >
              {actionType === 'approve' ? '确认通过' : '确认拒绝'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
