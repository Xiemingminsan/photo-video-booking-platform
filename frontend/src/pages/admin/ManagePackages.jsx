"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { packageService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function ManagePackages() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "photography",
    price: "",
    duration: "",
    featuresInput: "",
  })

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/")
      return
    }
    fetchPackages()
  }, [isAuthenticated, isAdmin])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const data = await packageService.getAll()
      setPackages(data)
      setError("")
    } catch (err) {
      setError("Failed to load packages. Please try again.")
      console.error("Error fetching packages:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg)
      setFormData({
        title: pkg.title,
        description: pkg.description,
        category: pkg.category,
        price: pkg.price,
        duration: pkg.duration || "",
        featuresInput: Array.isArray(pkg.features) ? pkg.features.join(", ") : "",
      })
    } else {
      setEditingPackage(null)
      setFormData({
        title: "",
        description: "",
        category: "photography",
        price: "",
        duration: "",
        featuresInput: "",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPackage(null)
    setError("")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const features = formData.featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)

      if (features.length === 0) {
        setError("Please enter at least one feature (comma separated).")
        return
      }

      const packageData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        duration: formData.duration ? Number.parseInt(formData.duration) : null,
        features,
      }

      if (editingPackage) {
        await packageService.update(editingPackage.id, packageData)
      } else {
        await packageService.create(packageData)
      }

      await fetchPackages()
      handleCloseModal()
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Failed to save package. Please try again."
      setError(formattedDetail)
      console.error("Error saving package:", err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) {
      return
    }

    try {
      await packageService.delete(id)
      await fetchPackages()
    } catch (err) {
      setError("Failed to delete package. Please try again.")
      console.error("Error deleting package:", err)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
        }}
      >
        <div style={{ color: "white", fontSize: "1.25rem", fontWeight: "500" }}>Loading packages...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FEF3E2" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
          padding: "2rem 1.5rem",
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Manage Packages</h1>
            <p style={{ opacity: 0.9, fontSize: "1rem" }}>Create and manage your photography packages</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            style={{
              background: "white",
              color: "#FAB12F",
              padding: "0.875rem 1.75rem",
              borderRadius: "10px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            + Add New Package
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {error && !showModal && (
          <div
            style={{
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              color: "#991b1b",
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }}>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Duration
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Features
                </th>
                <th
                  style={{
                    padding: "1.25rem",
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#1e293b",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center" }}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      style={{ margin: "0 auto 1rem" }}
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>
                      No packages found. Create your first package!
                    </p>
                  </td>
                </tr>
              ) : (
                packages.map((pkg, index) => (
                  <tr
                    key={pkg.id}
                    style={{
                      borderTop: index > 0 ? "1px solid #e2e8f0" : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  >
                    <td style={{ padding: "1.25rem" }}>
                      <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "0.25rem" }}>{pkg.title}</div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{pkg.description}</div>
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                          color: "white",
                          padding: "0.375rem 0.875rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {pkg.category}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem", color: "#475569", fontWeight: "500" }}>
                      {pkg.duration ? `${pkg.duration} hours` : "N/A"}
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <span
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "700",
                          color: "#FA812F",
                          background: "#FEF3E2",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          display: "inline-block",
                        }}
                      >
                        ETB {pkg.price}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem", fontSize: "0.875rem", color: "#64748b" }}>
                      {Array.isArray(pkg.features) ? pkg.features.slice(0, 2).join(", ") : ""}
                      {Array.isArray(pkg.features) && pkg.features.length > 2 && "..."}
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        <button
                          onClick={() => handleOpenModal(pkg)}
                          style={{
                            background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          style={{
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                padding: "1.5rem",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                {editingPackage ? "Edit Package" : "Add New Package"}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  fontSize: "1.5rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {error && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                    color: "#991b1b",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    fontWeight: "500",
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label
                    htmlFor="title"
                    style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                  >
                    Package Name *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Wedding Premium Package"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label
                    htmlFor="description"
                    style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Describe the package..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border 0.2s",
                      fontFamily: "inherit",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label
                      htmlFor="category"
                      style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        background: "white",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="photography">Photography</option>
                      <option value="videography">Videography</option>
                      <option value="combo">Combo</option>
                      <option value="editing">Editing</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                    >
                      Duration (hours) *
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="e.g., 4"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border 0.2s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label
                    htmlFor="price"
                    style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                  >
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1500.00"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    htmlFor="features"
                    style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                  >
                    Features (comma separated) *
                  </label>
                  <textarea
                    id="features"
                    name="featuresInput"
                    value={formData.featuresInput}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="e.g., 200 edited photos, online gallery"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border 0.2s",
                      fontFamily: "inherit",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      background: "#e2e8f0",
                      color: "#475569",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#cbd5e1")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(250,177,47,0.3)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(250,177,47,0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(250,177,47,0.3)"
                    }}
                  >
                    {editingPackage ? "Update Package" : "Create Package"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagePackages
