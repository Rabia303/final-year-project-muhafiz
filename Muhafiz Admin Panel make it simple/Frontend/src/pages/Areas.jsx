import { useState } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import '../styles/areas.css';

const Areas = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentArea, setCurrentArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const areas = [
    { id: 1, name: 'Downtown', type: 'Commercial', subdivisions: 5, incidents: 24, status: 'Active' },
    { id: 2, name: 'Northside', type: 'Residential', subdivisions: 8, incidents: 12, status: 'Active' },
    { id: 3, name: 'East End', type: 'Mixed', subdivisions: 3, incidents: 18, status: 'Active' },
    { id: 4, name: 'West District', type: 'Industrial', subdivisions: 2, incidents: 5, status: 'Inactive' },
  ];

  const crimeCategories = [
    { id: 1, name: 'Theft', description: 'Property theft offenses', severity: 'Medium', status: 'Active' },
    { id: 2, name: 'Burglary', description: 'Breaking and entering', severity: 'High', status: 'Active' },
    { id: 3, name: 'Assault', description: 'Physical violence', severity: 'High', status: 'Active' },
    { id: 4, name: 'Vandalism', description: 'Property damage', severity: 'Low', status: 'Active' },
  ];

  const filteredAreas = areas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddArea = () => {
    setModalType('add');
    setCurrentArea({
      id: areas.length + 1,
      name: '',
      type: 'Residential',
      subdivisions: 0,
      incidents: 0,
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleEditArea = (areaId) => {
    setModalType('edit');
    const area = areas.find(a => a.id === areaId);
    setCurrentArea(area);
    setShowModal(true);
  };

  const handleSaveArea = () => {
    // In a real app, you would call an API here
    alert(`${modalType === 'add' ? 'Adding' : 'Updating'} area: ${currentArea.name}`);
    setShowModal(false);
  };

  return (
    <div className="areas-page">
      <h2 className="page-title">Area Reporting Panel</h2>
      
      <div className="areas-tabs">
        <div className="tab active">Towns & Areas</div>
        <div className="tab">Crime Categories</div>
      </div>

      <Card>
        <div className="areas-header">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddArea}>
            <i className="fas fa-plus"></i> Add Area
          </button>
        </div>

        <DataTable
          columns={['Name', 'Type', 'Subdivisions', 'Incidents', 'Status']}
          data={filteredAreas.map(area => ({
            Name: area.name,
            Type: area.type,
            Subdivisions: area.subdivisions,
            Incidents: area.incidents,
            Status: <span className={`status-badge ${area.status.toLowerCase()}`}>
              {area.status}
            </span>
          }))}
          actions={(id) => (
            <>
              <button 
                className="edit" 
                title="Edit"
                onClick={() => handleEditArea(id)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className="delete" 
                title="Delete"
                onClick={() => confirm('Are you sure you want to delete this area?')}
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          )}
        />
      </Card>

      <Card title="Crime Categories">
        <DataTable
          columns={['Name', 'Description', 'Severity', 'Status']}
          data={crimeCategories.map(category => ({
            Name: category.name,
            Description: category.description,
            Severity: <span className={`severity-badge ${category.severity.toLowerCase()}`}>
              {category.severity}
            </span>,
            Status: <span className={`status-badge ${category.status.toLowerCase()}`}>
              {category.status}
            </span>
          }))}
          actions={(id) => (
            <>
              <button className="edit" title="Edit">
                <i className="fas fa-edit"></i>
              </button>
              <button className="delete" title="Delete">
                <i className="fas fa-trash"></i>
              </button>
            </>
          )}
        />
      </Card>

      {showModal && currentArea && (
        <Modal 
          title={`${modalType === 'add' ? 'Add New' : 'Edit'} Area`} 
          onClose={() => setShowModal(false)} 
          show={showModal}
        >
          <div className="area-form">
            <div className="form-group">
              <label className="form-label">Area Name</label>
              <input
                type="text"
                className="form-control"
                value={currentArea.name}
                onChange={(e) => setCurrentArea({...currentArea, name: e.target.value})}
                placeholder="Enter area name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Area Type</label>
              <select
                className="form-control"
                value={currentArea.type}
                onChange={(e) => setCurrentArea({...currentArea, type: e.target.value})}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Subdivisions</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentArea.subdivisions}
                  onChange={(e) => setCurrentArea({...currentArea, subdivisions: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Initial Incidents</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentArea.incidents}
                  onChange={(e) => setCurrentArea({...currentArea, incidents: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={currentArea.status}
                onChange={(e) => setCurrentArea({...currentArea, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSaveArea}>
                {modalType === 'add' ? 'Add Area' : 'Update Area'}
              </button>
              <button className="btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Areas;