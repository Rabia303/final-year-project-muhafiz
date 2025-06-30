import { useEffect, useState } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import '../styles/users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // View user modal
  const handleViewUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
    setShowModal(true);
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete user");
          return res.json();
        })
        .then(() => {
          setUsers((prev) => prev.filter((u) => u._id !== userId));
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Failed to delete user.");
        });
    }
  };

  // Search logic
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page">
      <h2 className="page-title">Manage Users</h2>

      <Card>
        <div className="users-header">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={['S.No.', 'Name', 'Email', 'Join Date']}
          data={filteredUsers.map((user, index) => ({
            id: user._id, // used for action buttons
            'S.No.': index + 1,
            Name: user.name || '—',
            Email: user.email || '—',
            'Join Date': user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : '—',
          }))}
          actions={(rowId) => (
            <div className="table-actions">
              <button
                className="action-btn view"
                title="View User"
                onClick={() => handleViewUser(rowId)}
              >
                <i className="fas fa-eye"></i>
              </button>
              <button
                className="action-btn delete"
                title="Delete User"
                onClick={() => handleDeleteUser(rowId)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          )}
        />
      </Card>

      {showModal && selectedUser && (
        <Modal title="User Details" onClose={() => setShowModal(false)} show={showModal}>
          <div className="user-details">
            <div className="user-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="user-info">
              <h3>{selectedUser.name}</h3>
              <p>{selectedUser.email}</p>
            </div>
            <div className="user-stats">
              <div className="stat-item">
                <h4>Joined</h4>
                <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              <div className="stat-item">
                <h4>Updated</h4>
                <p>{new Date(selectedUser.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Users;
