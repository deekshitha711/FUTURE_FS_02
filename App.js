import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    source: "",
    notes: ""
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // FETCH LEADS
  useEffect(() => {
    fetch("http://localhost:5000/leads")
      .then(res => res.json())
      .then(data => setLeads(data));
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD LEAD
  const submitForm = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    window.location.reload();
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    window.location.reload();
  };

  // DELETE
  const confirmDelete = async () => {
  await fetch(`http://localhost:5000/leads/${selectedId}`, {
    method: "DELETE"
  });

  setShowDeletePopup(false);
  window.location.reload();
};

  return (
    <div className="app">
      <h1>CRM DASHBOARD</h1>
      <h3>Client Lead Management</h3>

      {/* SEARCH + FILTER */}
      <div className="controls">
        <input
          placeholder="Search by name..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div className="layout">

        {/* TABLE */}
        <div className="table-card">
          <h2>Leads</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {leads
                .filter(lead =>
                  lead.name.toLowerCase().includes(search.toLowerCase())
                )
                .filter(lead =>
                  filter ? lead.status === filter : true
                )
                .map((lead) => (
                  <tr key={lead._id}>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.source}</td>

                    <td className={`status ${lead.status}`}>
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(lead._id, e.target.value)
                        }
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                    </td>

                    <td>{lead.notes}</td>

                    <td>
                    <button
                      onClick={() => {
                        setSelectedId(lead._id);
                        setShowDeletePopup(true);
                      }}
                      >Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        <div className="form-card">
          <h2>Add Lead</h2>

          <form onSubmit={submitForm}>
            <input name="name" placeholder="Name" onChange={handleChange} required />
            <input name="email" placeholder="Email" onChange={handleChange} required />
            <input name="source" placeholder="Source" onChange={handleChange} />
            <textarea name="notes" placeholder="Notes" onChange={handleChange}></textarea>

            <button>Add Lead</button>
          </form>
        </div>

      </div>
      {showDeletePopup && (
        <div className="popup">
        <div className="popup-box">
        <h3>Delete Lead?</h3>
        <p>Are you sure you want to delete this lead?</p>

        <div className="popup-buttons">
        <button onClick={confirmDelete}>Yes, Delete</button>
        <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
        </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default App;