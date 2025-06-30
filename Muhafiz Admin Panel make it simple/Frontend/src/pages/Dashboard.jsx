import Card from '../components/Card';
import DataTable from '../components/DataTable';
import '../styles/dashboard.css';
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,254', icon: 'users', trend: 'up', change: '12%' },
    { title: 'New Incidents', value: '24', icon: 'exclamation-triangle', trend: 'up', change: '5%' },
    { title: 'Resolved Cases', value: '18', icon: 'check-circle', trend: 'down', change: '3%' },
    { title: 'Community Posts', value: '156', icon: 'comments', trend: 'up', change: '8%' },
  ];

  const recentIncidents = [
    { id: 1, type: 'Theft', location: 'Downtown', severity: 'Medium', date: '2023-06-15', status: 'Pending' },
    { id: 2, type: 'Vandalism', location: 'Suburb', severity: 'Low', date: '2023-06-14', status: 'Under Review' },
    { id: 3, type: 'Burglary', location: 'Residential Area', severity: 'High', date: '2023-06-13', status: 'Approved' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', joinDate: '2023-06-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator', joinDate: '2023-06-14', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', joinDate: '2023-06-13', status: 'Suspended' },
  ];
const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("authToken");
  navigate("/");
};

  return (
    <div className="dashboard-page">
      {/* <h2 className="page-title">Dashboard Overview</h2> */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2 className="page-title">Dashboard Overview</h2>
  <button
    onClick={logout}
    style={{
      backgroundColor: "#ff4d4f",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer"
    }}
  >
    🔓 Logout
  </button>
</div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="stat-card">
              <div>
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-value">
                  <span>{stat.value}</span>
                  <span className={`trend ${stat.trend}`}>
                    <i className={`fas fa-arrow-${stat.trend}`}></i> {stat.change}
                  </span>
                </div>
              </div>
              <div className="stat-icon">
                <i className={`fas fa-${stat.icon}`}></i>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <Card title="Recent Incidents">
            <DataTable
              columns={['Type', 'Location', 'Severity', 'Date', 'Status']}
              data={recentIncidents.map(incident => ({
                Type: incident.type,
                Location: incident.location,
                Severity: <span className={`severity-badge ${incident.severity.toLowerCase()}`}>
                  {incident.severity}
                </span>,
                Date: incident.date,
                Status: <span className={`status-badge ${incident.status.toLowerCase().replace(' ', '-')}`}>
                  {incident.status}
                </span>
              }))}
            />
          </Card>
        </div>

        <div className="dashboard-section">
          <Card title="Recent Users">
            <DataTable
              columns={['Name', 'Email', 'Role', 'Join Date', 'Status']}
              data={recentUsers.map(user => ({
                Name: user.name,
                Email: user.email,
                Role: user.role,
                'Join Date': user.joinDate,
                Status: <span className={`status-badge ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              }))}
            />
          </Card>
        </div>
      </div>

      <div className="dashboard-section">
        <Card title="Activity Timeline">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot primary"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>New incident reported</h4>
                  <small>10 minutes ago</small>
                </div>
                <p>Theft reported in downtown area</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot success"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>Case resolved</h4>
                  <small>1 hour ago</small>
                </div>
                <p>Burglary case #1245 marked as resolved</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;