import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Zap, ExternalLink, Heart, Share2, MessageSquare, Map, Wallet, UserCheck, Mic, Image, Mail, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatCurrency, getStatusBadge, formatDate } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';

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
  { id: 'overview', label: '介绍' },
  { id: 'access', label: '接入说明' },
  { id: 'pricing', label: '费用规则' },
  { id: 'versions', label: '版本日志' },
  { id: 'ratings', label: '用户评价' },
];

export default function CapabilityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCapabilityById, applications, submitApproval, currentUser, getApprovalsByUserId, getRatingsByCapabilityId, addRating, approvals } = useAppStore();
  
  const capability = getCapabilityById(id || '');
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [existingApprovalInfo, setExistingApprovalInfo] = useState<{appName: string; status: string} | null>(null);
  const [selectedApp, setSelectedApp] = useState('');
  const [applyReason, setApplyReason] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const userApps = applications.filter(app => app.userId === currentUser.id);
  const userApprovals = getApprovalsByUserId(currentUser.id);
  const existingApproval = userApprovals.find(a => a.capabilityId === id);
  const capabilityRatings = getRatingsByCapabilityId(id || '');

  const checkExistingApproval = (appId: string) => {
    const existing = approvals.find(a => a.applicationId === appId && a.capabilityId === id);
    if (existing) {
      setExistingApprovalInfo({ appName: existing.applicationName, status: existing.status });
      setShowExistingModal(true);
      return true;
    }
    return false;
  };

  const handleAppChange = (appId: string) => {
    setSelectedApp(appId);
    if (appId && checkExistingApproval(appId)) {
      return;
    }
  };

  const handleSubmitApply = () => {
    if (!selectedApp || !applyReason) return;
    
    const existing = approvals.find(a => a.applicationId === selectedApp && a.capabilityId === id);
    if (existing) {
      setExistingApprovalInfo({ appName: existing.applicationName, status: existing.status });
      setShowExistingModal(true);
      return;
    }

    const app = applications.find(a => a.id === selectedApp);
    if (app) {
      submitApproval({
        capabilityId: id || '',
        capabilityName: capability?.name || '',
        applicationId: selectedApp,
        applicationName: app.name,
        userId: currentUser.id,
        userName: currentUser.name,
        status: 'pending',
        reason: applyReason,
      });
      setShowApplyModal(false);
      setSelectedApp('');
      setApplyReason('');
    }
  };

  const handleSubmitRating = () => {
    if (newRating === 0 || !ratingComment.trim()) return;
    addRating({
      capabilityId: id || '',
      userId: currentUser.id,
      userName: currentUser.name,
      rating: newRating,
      comment: ratingComment,
    });
    setShowRatingModal(false);
    setNewRating(0);
    setRatingComment('');
  };

  if (!capability) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">能力不存在</p>
      </div>
    );
  }

  const Icon = iconMap[capability.icon] || MessageSquare;
  const statusBadge = getStatusBadge(capability.status);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header title="能力详情" subtitle={capability.name} showSearch={false} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="card mb-6">
          <div className="flex items-start gap-6">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
              capability.status === 'online' ? 'bg-primary-100' :
              capability.status === 'maintenance' ? 'bg-warning-100' : 'bg-gray-100'
            }`}>
              <Icon className={`w-10 h-10 ${
                capability.status === 'online' ? 'text-primary-600' :
                capability.status === 'maintenance' ? 'text-warning-600' : 'text-gray-500'
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{capability.name}</h1>
                <span className={`badge ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{capability.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-warning-400 text-warning-400" />
                  {capability.rating} ({capability.ratingCount}条评价)
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  免费额度: {capability.freeQuota} {capability.unit}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  更新于 {formatDate(capability.updatedAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-lg transition-all ${
                  isFavorite ? 'bg-danger-100 text-danger-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-3">
            {existingApproval ? (
              <>
                <span className={`px-4 py-2 rounded-lg font-medium ${
                  existingApproval.status === 'approved' ? 'bg-success-100 text-success-700' :
                  existingApproval.status === 'pending' ? 'bg-warning-100 text-warning-700' : 'bg-danger-100 text-danger-700'
                }`}>
                  {existingApproval.status === 'approved' ? '已开通' :
                   existingApproval.status === 'pending' ? '审批中' : '已拒绝'}
                </span>
                {existingApproval.status === 'rejected' && (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    重新申请
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  立即申请
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  查看文档
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-100 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">功能特性</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                  企业级服务，高可用高可靠
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                  简单易用的API接口
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                  完善的文档和SDK支持
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2" />
                  实时监控和告警通知
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">适用场景</h3>
              <p className="text-gray-600">
                适用于企业内部各类业务系统，包括用户注册、订单通知、营销推送等多种场景。
              </p>
            </div>
          )}

          {activeTab === 'access' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">接入指南</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">1. 申请开通</h4>
                  <p className="text-sm text-gray-600">在能力目录中选择该能力，点击申请按钮提交审批。</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">2. 创建凭证</h4>
                  <p className="text-sm text-gray-600">审批通过后，在应用管理中创建调用凭证。</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">3. 接入调用</h4>
                  <p className="text-sm text-gray-600">参考API文档进行接口调用。</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">API文档</h4>
                <a href={capability.accessDocs} className="text-primary-600 hover:underline flex items-center gap-1">
                  {capability.accessDocs}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">计费方式</h3>
              <p className="text-gray-600 mb-6">{capability.feeRules}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">基础版</h4>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(capability.price, capability.unit)}</p>
                  <p className="text-sm text-gray-500 mt-1">适合中小规模使用</p>
                </div>
                <div className="p-4 border-2 border-primary-500 rounded-lg bg-primary-50">
                  <h4 className="font-medium text-gray-700 mb-2">专业版</h4>
                  <p className="text-2xl font-bold text-primary-600">{formatCurrency(capability.price * 0.8, capability.unit)}</p>
                  <p className="text-sm text-gray-500 mt-1">量大从优，适合大规模使用</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">定制版</h4>
                  <p className="text-2xl font-bold text-primary-600">联系销售</p>
                  <p className="text-sm text-gray-500 mt-1">专属服务，定制化需求</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-success-50 rounded-lg border border-success-200">
                <p className="text-success-700 text-sm">
                  免费额度: {capability.freeQuota} {capability.unit}/月，超出部分按上述价格计费。
                </p>
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">版本历史</h3>
              <div className="space-y-4">
                {capability.versionLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {capability.versionLogs.length - index}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{log}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">用户评价 ({capabilityRatings.length})</h3>
                <button 
                  onClick={() => setShowRatingModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  发表评价
                </button>
              </div>
              
              <div className="space-y-4">
                {capabilityRatings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">暂无评价，成为第一个评价者吧</p>
                ) : (
                  capabilityRatings.map((rating) => (
                    <div key={rating.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            {rating.userName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800">{rating.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= rating.rating ? 'fill-warning-400 text-warning-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{rating.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatDate(rating.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="申请开通" size="lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择应用</label>
            <select
              value={selectedApp}
              onChange={(e) => handleAppChange(e.target.value)}
              className="input-field"
            >
              <option value="">请选择应用</option>
              {userApps.map((app) => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
            {userApps.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">暂无应用，请先创建应用</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">申请用途</label>
            <textarea
              value={applyReason}
              onChange={(e) => setApplyReason(e.target.value)}
              rows={4}
              placeholder="请说明使用该能力的具体用途..."
              className="input-field resize-none"
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowApplyModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={handleSubmitApply}
              disabled={!selectedApp || !applyReason}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交申请
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showRatingModal} onClose={() => setShowRatingModal(false)} title="发表评价">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">评分</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${star <= newRating ? 'fill-warning-400 text-warning-400' : 'text-gray-300'}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {newRating === 0 ? '请选择评分' : `${newRating}星`}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              rows={4}
              placeholder="请分享您的使用体验..."
              className="input-field resize-none"
            />
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowRatingModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={handleSubmitRating}
              disabled={newRating === 0 || !ratingComment.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交评价
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showExistingModal} onClose={() => { setShowExistingModal(false); setExistingApprovalInfo(null); }} title="已有申请记录">
        <div className="space-y-4">
          <div className="p-4 bg-warning-50 rounded-lg">
            <p className="text-warning-800">
              该应用 <span className="font-semibold">{existingApprovalInfo?.appName}</span> 已提交过此能力的申请
            </p>
            <p className="text-warning-700 mt-2">
              当前状态: 
              <span className={`ml-2 px-2 py-0.5 rounded text-sm font-medium ${
                existingApprovalInfo?.status === 'approved' ? 'bg-success-100 text-success-700' :
                existingApprovalInfo?.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                'bg-danger-100 text-danger-700'
              }`}>
                {existingApprovalInfo?.status === 'approved' ? '已通过' :
                 existingApprovalInfo?.status === 'pending' ? '审批中' : '已拒绝'}
              </span>
            </p>
          </div>
          <p className="text-gray-600 text-sm">
            {existingApprovalInfo?.status === 'pending' && '您的申请正在审批中，请耐心等待。'}
            {existingApprovalInfo?.status === 'approved' && '您的申请已通过审核，无需重复申请。'}
            {existingApprovalInfo?.status === 'rejected' && '您的申请已被拒绝，如需重新申请，请前往申请审批页面处理。'}
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              onClick={() => { 
                setShowExistingModal(false); 
                setExistingApprovalInfo(null);
                navigate('/approvals');
              }} 
              className="btn-secondary"
            >
              前往审批页面
            </button>
            <button 
              onClick={() => { 
                setShowExistingModal(false); 
                setExistingApprovalInfo(null);
                setShowApplyModal(false);
              }} 
              className="btn-primary"
            >
              知道了
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
