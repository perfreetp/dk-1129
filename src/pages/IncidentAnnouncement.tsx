import { useState } from 'react';
import { AlertTriangle, Bell, BellOff, Calendar, Clock, Search, Filter, Send, MessageCircle, HelpCircle, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatDate } from '../utils/helpers';
import Header from '../components/Header';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const mockFAQs = [
  { id: '1', question: '如何申请开通能力？', answer: '在能力目录中选择需要的能力，点击申请按钮，选择应用并填写用途后提交审批。' },
  { id: '2', question: '审批需要多长时间？', answer: '一般情况下，审批会在1-2个工作日内完成。紧急情况可以联系管理员加急处理。' },
  { id: '3', question: '调用API失败怎么办？', answer: '请检查您的凭证是否正确，应用是否已开通该能力，以及额度是否充足。如果问题仍未解决，请联系技术支持。' },
  { id: '4', question: '如何查看调用日志？', answer: '在用量监控页面可以查看调用量、成功率和错误详情。' },
  { id: '5', question: '额度用完了怎么办？', answer: '可以在应用管理中申请额度调整，或者联系运营人员申请临时额度。' },
];

const notificationTypes = [
  { value: 'all', label: '全部类型' },
  { value: 'downtime', label: '故障通知' },
  { value: 'maintenance', label: '维护公告' },
  { value: 'info', label: '信息通知' },
];

export default function IncidentAnnouncement() {
  const { notifications, addNotification, deleteNotification, currentUser } = useAppStore();
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    type: 'info' as 'downtime' | 'maintenance' | 'info',
    startTime: '',
    endTime: '',
  });

  const isAdmin = currentUser.role === 'admin';

  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filterType);

  const handleCreate = () => {
    if (!newNotification.title || !newNotification.content) return;
    addNotification({
      title: newNotification.title,
      content: newNotification.content,
      type: newNotification.type,
      status: 'published',
      affectedCapabilities: [],
      startTime: newNotification.startTime ? new Date(newNotification.startTime).toISOString() : new Date().toISOString(),
      endTime: newNotification.endTime ? new Date(newNotification.endTime).toISOString() : undefined,
    });
    setShowCreateModal(false);
    setNewNotification({ title: '', content: '', type: 'info', startTime: '', endTime: '' });
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteNotification(deleteId);
      setShowDeleteDialog(false);
      setDeleteId('');
    }
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'downtime':
        return { label: '故障通知', color: 'bg-danger-100 text-danger-700', icon: AlertTriangle };
      case 'maintenance':
        return { label: '维护公告', color: 'bg-warning-100 text-warning-700', icon: Clock };
      default:
        return { label: '信息通知', color: 'bg-info-100 text-info-700', icon: Bell };
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header title="故障公告" subtitle="查看系统公告和订阅告警" showSearch={false} />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input-field w-36"
                >
                  {notificationTypes.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  发布公告
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="card text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无公告</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const typeConfig = getTypeConfig(notification.type);
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <div key={notification.id} className="card-hover">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 ${typeConfig.color} rounded-lg flex items-center justify-center`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`badge ${typeConfig.color}`}>{typeConfig.label}</span>
                              <span className="text-xs text-gray-400">
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{notification.title}</h3>
                            <p className="text-sm text-gray-600">{notification.content}</p>
                            {notification.startTime && (
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(notification.startTime)}
                                </span>
                                {notification.endTime && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(notification.endTime)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(notification.id);
                                setShowDeleteDialog(true);
                              }}
                              className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-danger-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">告警订阅</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">故障告警</p>
                    <p className="text-sm text-gray-500">当服务出现故障时通知您</p>
                  </div>
                  <button className="relative w-12 h-6 bg-primary-600 rounded-full transition-colors">
                    <span className="absolute top-1 w-4 h-4 bg-white rounded-full translate-x-7" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">维护公告</p>
                    <p className="text-sm text-gray-500">接收系统维护通知</p>
                  </div>
                  <button className="relative w-12 h-6 bg-primary-600 rounded-full transition-colors">
                    <span className="absolute top-1 w-4 h-4 bg-white rounded-full translate-x-7" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">额度预警</p>
                    <p className="text-sm text-gray-500">当额度使用超过80%时提醒</p>
                  </div>
                  <button className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors">
                    <span className="absolute top-1 w-4 h-4 bg-white rounded-full translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-800">常见问题</h3>
              </div>
              <div className="space-y-3">
                {mockFAQs.map((faq) => (
                  <div key={faq.id} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1">
                <MessageCircle className="w-4 h-4" />
                联系技术支持
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="发布公告" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">公告类型</label>
            <select
              value={newNotification.type}
              onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as 'downtime' | 'maintenance' | 'info' })}
              className="input-field"
            >
              <option value="downtime">故障通知</option>
              <option value="maintenance">维护公告</option>
              <option value="info">信息通知</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">公告标题</label>
            <input
              type="text"
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              placeholder="请输入公告标题"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">公告内容</label>
            <textarea
              value={newNotification.content}
              onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
              rows={4}
              placeholder="请输入公告内容..."
              className="input-field resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
              <input
                type="datetime-local"
                value={newNotification.startTime}
                onChange={(e) => setNewNotification({ ...newNotification, startTime: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
              <input
                type="datetime-local"
                value={newNotification.endTime}
                onChange={(e) => setNewNotification({ ...newNotification, endTime: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
              取消
            </button>
            <button
              onClick={handleCreate}
              disabled={!newNotification.title || !newNotification.content}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              发布公告
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="删除公告"
        message="确定要删除此公告吗？删除后将无法恢复。"
        danger
      />
    </div>
  );
}
