import { 
  LayoutGrid, 
  Package, 
  FileText, 
  Settings, 
  Bell, 
  BarChart3, 
  AlertTriangle, 
  Users,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

const menuItems = [
  { id: 'catalog', label: '能力目录', icon: LayoutGrid, path: '/' },
  { id: 'applications', label: '应用管理', icon: Package, path: '/applications' },
  { id: 'approvals', label: '申请审批', icon: Settings, path: '/approvals' },
  { id: 'monitoring', label: '用量监控', icon: BarChart3, path: '/monitoring' },
  { id: 'notifications', label: '故障公告', icon: AlertTriangle, path: '/announcements' },
  { id: 'admin', label: '运营后台', icon: Users, path: '/admin' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, getPendingApprovals } = useAppStore();
  
  const pendingCount = getPendingApprovals().length;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">能力中心</h1>
            <p className="text-xs text-gray-500">开放能力管理平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const showBadge = item.id === 'approvals' && pendingCount > 0;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group relative ${
                active
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.email}</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}
