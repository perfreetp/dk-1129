import { Star, Clock, Zap, ChevronRight, MessageSquare, Map, Wallet, UserCheck, Mic, Image, Mail, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { domains } from '../data/mockData';
import { formatCurrency, getStatusBadge } from '../utils/helpers';
import Header from '../components/Header';
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

export default function CapabilityCatalog() {
  const navigate = useNavigate();
  const { selectedDomain, setSelectedDomain, getFilteredCapabilities, getApprovalsByUserId, currentUser } = useAppStore();
  
  const capabilities = getFilteredCapabilities();
  const userApprovals = getApprovalsByUserId(currentUser.id);

  const getApprovalStatus = (capId: string) => {
    const approval = userApprovals.find(a => a.capabilityId === capId);
    if (approval) {
      if (approval.status === 'approved') return '已开通';
      if (approval.status === 'pending') return '审批中';
      return '已拒绝';
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="能力目录" subtitle="浏览和发现企业开放能力" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedDomain === domain
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {capabilities.length === 0 ? (
          <EmptyState
            title="暂无匹配的能力"
            description="尝试调整筛选条件或搜索关键词"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {capabilities.map((cap) => {
              const Icon = iconMap[cap.icon] || MessageSquare;
              const statusBadge = getStatusBadge(cap.status);
              const approvalStatus = getApprovalStatus(cap.id);
              
              return (
                <div
                  key={cap.id}
                  className="card-hover cursor-pointer group"
                  onClick={() => navigate(`/capabilities/${cap.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      cap.status === 'online' ? 'bg-primary-100' :
                      cap.status === 'maintenance' ? 'bg-warning-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        cap.status === 'online' ? 'text-primary-600' :
                        cap.status === 'maintenance' ? 'text-warning-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                          {cap.name}
                        </h3>
                        <span className={`badge ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {cap.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                          {cap.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cap.ratingCount}条评价
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {cap.freeQuota > 0 ? `免费${cap.freeQuota}` : '收费'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {formatCurrency(cap.price, cap.unit)}
                    </span>
                    {approvalStatus ? (
                      <span className={`text-xs px-2 py-1 rounded ${
                        approvalStatus === '已开通' ? 'bg-success-100 text-success-700' :
                        approvalStatus === '审批中' ? 'bg-warning-100 text-warning-700' : 'bg-danger-100 text-danger-700'
                      }`}>
                        {approvalStatus}
                      </span>
                    ) : (
                      <button className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">
                        立即申请
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
