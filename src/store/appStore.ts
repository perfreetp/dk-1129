import { create } from 'zustand';
import { Capability, Application, Credential, Approval, Notification, User, AlertRule, Rating, OperationLog } from '../types';
import { mockCapabilities, mockApplications, mockCredentials, mockApprovals, mockNotifications, mockUsers, mockAlertRules, mockRatings } from '../data/mockData';

interface AppStore {
  capabilities: Capability[];
  applications: Application[];
  credentials: Credential[];
  approvals: Approval[];
  notifications: Notification[];
  users: User[];
  alertRules: AlertRule[];
  ratings: Rating[];
  operationLogs: OperationLog[];
  currentUser: User;
  selectedDomain: string;
  searchKeyword: string;

  setSelectedDomain: (domain: string) => void;
  setSearchKeyword: (keyword: string) => void;
  setCurrentUser: (user: User) => void;

  getFilteredCapabilities: () => Capability[];
  getCapabilityById: (id: string) => Capability | undefined;
  getApplicationById: (id: string) => Application | undefined;
  getCredentialsByAppId: (appId: string) => Credential[];
  getApprovalsByUserId: (userId: string) => Approval[];
  getPendingApprovals: () => Approval[];

  addCapability: (capability: { name: string; description: string; icon: string; businessDomain: string; price: number; freeQuota: number; unit: string; domain?: string }) => void;
  updateCapability: (id: string, updates: Partial<Capability>) => void;
  deleteCapability: (id: string) => void;

  addApplication: (app: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;

  addCredential: (credential: { name: string; applicationId: string; applicationName: string }) => void;
  rotateCredential: (id: string) => void;
  deleteCredential: (id: string) => void;

  submitApproval: (approval: Omit<Approval, 'id' | 'createdAt' | 'updatedAt'>) => void;
  approveApproval: (id: string, comment?: string) => void;
  rejectApproval: (id: string, comment?: string) => void;

  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  deleteNotification: (id: string) => void;

  addAlertRule: (rule: Omit<AlertRule, 'id' | 'createdAt'>) => void;
  updateAlertRule: (id: string, updates: Partial<AlertRule>) => void;
  deleteAlertRule: (id: string) => void;

  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  updateQuota: (appId: string, quota: number) => void;
  addWhitelist: (appId: string, ip: string) => void;
  removeWhitelist: (appId: string, ip: string) => void;

  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  getRatingsByCapabilityId: (capabilityId: string) => Rating[];
  updateCapabilityRating: (capabilityId: string) => void;

  addOperationLog: (log: Omit<OperationLog, 'id' | 'createdAt'>) => void;
  getOperationLogs: () => OperationLog[];
  getOperationLogsByAppId: (appId: string) => OperationLog[];
}

export const useAppStore = create<AppStore>((set, get) => ({
  capabilities: mockCapabilities,
  applications: mockApplications,
  credentials: mockCredentials,
  approvals: mockApprovals,
  notifications: mockNotifications,
  users: mockUsers,
  alertRules: mockAlertRules,
  ratings: mockRatings,
  operationLogs: [],
  currentUser: mockUsers[0],
  selectedDomain: '全部',
  searchKeyword: '',

  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setCurrentUser: (user) => set({ currentUser: user }),

  getFilteredCapabilities: () => {
    const { capabilities, selectedDomain, searchKeyword } = get();
    return capabilities.filter((cap) => {
      const matchDomain = selectedDomain === '全部' || cap.domain === selectedDomain;
      const matchKeyword = searchKeyword === '' || 
        cap.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        cap.description.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchDomain && matchKeyword;
    });
  },

  getCapabilityById: (id) => {
    return get().capabilities.find((cap) => cap.id === id);
  },

  getApplicationById: (id) => {
    return get().applications.find((app) => app.id === id);
  },

  getCredentialsByAppId: (appId) => {
    return get().credentials.filter((cred) => cred.applicationId === appId);
  },

  getApprovalsByUserId: (userId) => {
    return get().approvals.filter((appr) => appr.userId === userId);
  },

  getPendingApprovals: () => {
    return get().approvals.filter((appr) => appr.status === 'pending');
  },

  addCapability: (capability) => {
    const newCapability: Capability = {
      ...capability,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 0,
      ratingCount: 0,
      status: 'online',
      versionLogs: [],
      domain: capability.domain || capability.businessDomain,
      accessDocs: '',
      feeRules: '',
    };
    set((state) => ({ capabilities: [...state.capabilities, newCapability] }));
  },

  updateCapability: (id, updates) => {
    set((state) => ({
      capabilities: state.capabilities.map((cap) =>
        cap.id === id ? { ...cap, ...updates, updatedAt: new Date().toISOString() } : cap
      ),
    }));
  },

  deleteCapability: (id) => {
    set((state) => ({ capabilities: state.capabilities.filter((cap) => cap.id !== id) }));
  },

  addApplication: (app) => {
    const newApp: Application = {
      ...app,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quotaUsed: 0,
      whitelist: [],
    };
    set((state) => ({ applications: [...state.applications, newApp] }));
  },

  updateApplication: (id, updates) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app
      ),
    }));
  },

  deleteApplication: (id) => {
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
      credentials: state.credentials.filter((cred) => cred.applicationId !== id),
    }));
  },

  addCredential: (credential) => {
    const generateKey = () => {
      return Math.random().toString(36).substring(2, 18).toUpperCase();
    };
    const newCred: Credential = {
      ...credential,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessKey: `AKIA${generateKey()}`,
      secretKey: generateKey() + generateKey(),
      status: 'active',
    };
    set((state) => ({ credentials: [...state.credentials, newCred] }));
  },

  rotateCredential: (id) => {
    const generateKey = () => {
      return Math.random().toString(36).substring(2, 18).toUpperCase();
    };
    set((state) => ({
      credentials: state.credentials.map((cred) =>
        cred.id === id
          ? {
              ...cred,
              accessKey: `AKIA${generateKey()}`,
              secretKey: generateKey() + generateKey(),
              updatedAt: new Date().toISOString(),
            }
          : cred
      ),
    }));
  },

  deleteCredential: (id) => {
    set((state) => ({ credentials: state.credentials.filter((cred) => cred.id !== id) }));
  },

  submitApproval: (approval) => {
    const newApproval: Approval = {
      ...approval,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ approvals: [...state.approvals, newApproval] }));
  },

  approveApproval: (id, comment) => {
    set((state) => ({
      approvals: state.approvals.map((appr) =>
        appr.id === id
          ? {
              ...appr,
              status: 'approved',
              approverId: get().currentUser.id,
              approverName: get().currentUser.name,
              comment,
              processedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : appr
      ),
    }));
  },

  rejectApproval: (id, comment) => {
    set((state) => ({
      approvals: state.approvals.map((appr) =>
        appr.id === id
          ? {
              ...appr,
              status: 'rejected',
              approverId: get().currentUser.id,
              approverName: get().currentUser.name,
              comment,
              processedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : appr
      ),
    }));
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ notifications: [...state.notifications, newNotification] }));
  },

  updateNotification: (id, updates) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, ...updates, updatedAt: new Date().toISOString() } : notif
      ),
    }));
  },

  deleteNotification: (id) => {
    set((state) => ({ notifications: state.notifications.filter((notif) => notif.id !== id) }));
  },

  addAlertRule: (rule) => {
    const newRule: AlertRule = {
      ...rule,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ alertRules: [...state.alertRules, newRule] }));
  },

  updateAlertRule: (id, updates) => {
    set((state) => ({
      alertRules: state.alertRules.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      ),
    }));
  },

  deleteAlertRule: (id) => {
    set((state) => ({ alertRules: state.alertRules.filter((rule) => rule.id !== id) }));
  },

  addUser: (user) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ users: [...state.users, newUser] }));
  },

  updateUser: (id, updates) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    }));
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      applications: state.applications.filter((app) => app.userId !== id),
      approvals: state.approvals.filter((appr) => appr.userId !== id),
    }));
  },

  updateQuota: (appId, quota) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId ? { ...app, quota, updatedAt: new Date().toISOString() } : app
      ),
    }));
  },

  addWhitelist: (appId, ip) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId
          ? { ...app, whitelist: [...app.whitelist, ip], updatedAt: new Date().toISOString() }
          : app
      ),
    }));
  },

  removeWhitelist: (appId, ip) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === appId
          ? {
              ...app,
              whitelist: app.whitelist.filter((item) => item !== ip),
              updatedAt: new Date().toISOString(),
            }
          : app
      ),
    }));
  },

  addRating: (rating) => {
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ ratings: [...state.ratings, newRating] }));
    get().updateCapabilityRating(rating.capabilityId);
  },

  getRatingsByCapabilityId: (capabilityId) => {
    return get().ratings.filter((r) => r.capabilityId === capabilityId);
  },

  updateCapabilityRating: (capabilityId) => {
    const ratings = get().ratings.filter((r) => r.capabilityId === capabilityId);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0;
    
    set((state) => ({
      capabilities: state.capabilities.map((cap) =>
        cap.id === capabilityId
          ? {
              ...cap,
              rating: Math.round(avgRating * 10) / 10,
              ratingCount: ratings.length,
            }
          : cap
      ),
    }));
  },

  addOperationLog: (log) => {
    const newLog: OperationLog = {
      ...log,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ operationLogs: [newLog, ...state.operationLogs] }));
  },

  getOperationLogs: () => {
    return get().operationLogs;
  },

  getOperationLogsByAppId: (appId) => {
    return get().operationLogs.filter((log) => log.applicationId === appId);
  },
}));
