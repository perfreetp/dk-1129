import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CapabilityCatalog from './pages/CapabilityCatalog';
import CapabilityDetail from './pages/CapabilityDetail';
import ApplicationManagement from './pages/ApplicationManagement';
import CredentialManagement from './pages/CredentialManagement';
import CredentialCenter from './pages/CredentialCenter';
import ApprovalManagement from './pages/ApprovalManagement';
import UsageMonitoring from './pages/UsageMonitoring';
import IncidentAnnouncement from './pages/IncidentAnnouncement';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<CapabilityCatalog />} />
            <Route path="/capabilities/:id" element={<CapabilityDetail />} />
            <Route path="/applications" element={<ApplicationManagement />} />
            <Route path="/applications/:appId/credentials" element={<CredentialManagement />} />
            <Route path="/credentials" element={<CredentialCenter />} />
            <Route path="/approvals" element={<ApprovalManagement />} />
            <Route path="/monitoring" element={<UsageMonitoring />} />
            <Route path="/announcements" element={<IncidentAnnouncement />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
