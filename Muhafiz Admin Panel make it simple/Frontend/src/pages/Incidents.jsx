import { useEffect, useState } from "react";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import "../styles/incident.css";

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIncidents(data);
        } else if (Array.isArray(data.incidents)) {
          setIncidents(data.incidents);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIncidents([]);
      });
  }, []);

  const filtered = incidents.filter((i) =>
    i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.town?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (id) => {
    const incident = incidents.find((i) => i._id === id);
    setSelectedIncident(incident);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      fetch(`http://localhost:5000/api/incidents/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setIncidents((prev) => prev.filter((i) => i._id !== id));
        })
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const updateStatus = (id, status) => {
    fetch(`http://localhost:5000/api/incidents/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setIncidents((prev) =>
          prev.map((i) => (i._id === id ? updated : i))
        );
      })
      .catch((err) => console.error("Status update failed:", err));
  };

  return (
    <div className="incidents-page">
      <h2 className="page-title">Incident Reports</h2>

      <Card>
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by title or town..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable
          columns={["Title", "Town", "Subdivision", "Category", "Severity", "Date"]}
          data={filtered.map((i) => ({
            id: i._id,
            Title: i.title || "—",
            Town: i.town || "—",
            Subdivision: i.subdivision || "—",
            Category: i.category || "—",
            Severity: i.severity || "—",
            Date: i.date || "—",
          }))}
          actions={(id) => (
            <div className="action-buttons">
              <button className="view" onClick={() => handleView(id)} title="View">
                <i className="fas fa-eye"></i>
              </button>
              <button className="approve" onClick={() => updateStatus(id, "Approved")} title="Approve">
                <i className="fas fa-check"></i>
              </button>
              <button className="reject" onClick={() => updateStatus(id, "Rejected")} title="Reject">
                <i className="fas fa-times"></i>
              </button>
              <button className="delete" onClick={() => handleDelete(id)} title="Delete">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          )}
        />
      </Card>

      {showModal && selectedIncident && (
        <Modal title="Incident Details" onClose={() => setShowModal(false)} show={showModal}>
          <div className="incident-details">
            <p><strong>Title:</strong> {selectedIncident.title}</p>
            <p><strong>Description:</strong> {selectedIncident.description}</p>
            <p><strong>Town:</strong> {selectedIncident.town}</p>
            <p><strong>Subdivision:</strong> {selectedIncident.subdivision}</p>
            <p><strong>Category:</strong> {selectedIncident.category}</p>
            <p><strong>Severity:</strong> {selectedIncident.severity}</p>
            <p><strong>Date:</strong> {selectedIncident.date}</p>
            {selectedIncident.status && (
              <p><strong>Status:</strong> {selectedIncident.status}</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Incidents;
