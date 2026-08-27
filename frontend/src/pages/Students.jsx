import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StudentForm from "../components/StudentForm";

export default function Students() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  function loadStudents() {
    setLoading(true);
    const params = search ? { search } : {};
    api
      .get("/students", { params })
      .then((res) => setStudents(res.data.students))
      .catch(() => setErrorMsg("Could not load students."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadStudents();
  }

  async function handleCreateOrUpdate(formData) {
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
      } else {
        await api.post("/students", formData);
      }
      setShowForm(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not save student.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    try {
      await api.delete(`/students/${id}`);
      loadStudents();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not delete student.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Students</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingStudent(null);
              setShowForm((v) => !v);
            }}
          >
            {showForm ? "Close form" : "+ Add student"}
          </button>
        )}
      </div>

      {errorMsg && <div className="alert-error">{errorMsg}</div>}

      {showForm && isAdmin && (
        <StudentForm
          initialData={editingStudent}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
        />
      )}

      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No.</th>
              <th>Class</th>
              <th>Section</th>
              <th>Phone</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="muted">
                  No students found.
                </td>
              </tr>
            )}
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.rollNumber}</td>
                <td>{s.class}</td>
                <td>{s.section}</td>
                <td>{s.phone}</td>
                {isAdmin && (
                  <td className="table-actions">
                    <button
                      className="btn-small"
                      onClick={() => {
                        setEditingStudent(s);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-small btn-danger" onClick={() => handleDelete(s._id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
