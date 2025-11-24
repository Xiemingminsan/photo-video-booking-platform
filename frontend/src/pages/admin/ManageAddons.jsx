"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { addonService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function ManageAddons() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [addons, setAddons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingAddon, setEditingAddon] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "other",
  })

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/")
      return
    }
    fetchAddons()
  }, [isAuthenticated, isAdmin])

  const fetchAddons = async () => {
    try {
      setLoading(true)
      const data = await addonService.getAll()
      setAddons(data)
      setError("")
    } catch (err) {
      setError("Failed to load add-ons. Please try again.")
      console.error("Error fetching add-ons:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (addon = null) => {
    if (addon) {
      setEditingAddon(addon)
      setFormData({
        name: addon.name,
        description: addon.description,
        price: addon.price,
        category: addon.category || "other",
      })
    } else {
      setEditingAddon(null)
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "other",
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAddon(null)
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
      const addonData = {
        ...formData,
        price: Number.parseFloat(formData.price),
      }

      if (editingAddon) {
        await addonService.update(editingAddon.id, addonData)
      } else {
        await addonService.create(addonData)
      }

      await fetchAddons()
      handleCloseModal()
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Failed to save add-on. Please try again."
      setError(formattedDetail)
      console.error("Error saving add-on:", err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this add-on?")) {
      return
    }

    try {
      await addonService.delete(id)
      await fetchAddons()
    } catch (err) {
      setError("Failed to delete add-on. Please try again.")
      console.error("Error deleting add-on:", err)
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "equipment":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="17 2 12 7 7 2" />
          </svg>
        )
      case "personnel":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
      case "editing":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        )
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
    }
  }

  const getCategoryGradient = (category) => {
    switch (category) {
      case "equipment":
        return "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)"
      case "personnel":
        return "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)"
      case "editing":
        return "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)"
      default:
        return "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)"
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
        <div style={{ color: "white", fontSize: "1.25rem", fontWeight: "500" }}>Loading add-ons...</div>
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
            <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Manage Add-ons</h1>
            <p style={{ opacity: 0.9, fontSize: "1rem" }}>Create and manage optional add-ons for your packages</p>
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
            + Add New Add-on
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {addons.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                background: "white",
                borderRadius: "12px",
                padding: "3rem",
                textAlign: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                style={{ margin: "0 auto 1rem" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>
                No add-ons found. Create your first add-on!
              </p>
            </div>
          ) : (
            addons.map((addon) => (
              <div
                key={addon.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"
                }}
              >
                {/* Icon Header */}
                <div
                  style={{
                    background: getCategoryGradient(addon.category),
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginBottom: "1rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  {getCategoryIcon(addon.category)}
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: getCategoryGradient(addon.category),
                    color: "white",
                    padding: "0.375rem 0.875rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textTransform: "capitalize",
                  }}
                >
                  {addon.category}
                </div>

                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "0.75rem",
                  }}
                >
                  {addon.name}
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.6",
                    marginBottom: "1.5rem",
                    minHeight: "3rem",
                  }}
                >
                  {addon.description}
                </p>

                {/* Price Badge */}
                <div
                  style={{
                    background: "#FEF3E2",
                    color: "#FA812F",
                    padding: "1rem",
                    borderRadius: "10px",
                    marginBottom: "1.25rem",
                    textAlign: "center",
                    border: "2px solid #FAB12F",
                  }}
                >
                  <div style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>Add-on Price</div>
                  <div style={{ fontSize: "1.75rem", fontWeight: "700" }}>ETB {addon.price}</div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleOpenModal(addon)}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                      color: "white",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.9rem",
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
                    onClick={() => handleDelete(addon.id)}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.9rem",
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
              </div>
            ))
          )}
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
              maxWidth: "500px",
              width: "100%",
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
                {editingAddon ? "Edit Add-on" : "Add New Add-on"}
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
                    htmlFor="name"
                    style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                  >
                    Add-on Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Extra Hour Coverage"
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
                    placeholder="Describe the add-on..."
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
                    placeholder="e.g., 150.00"
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
                    <option value="equipment">Equipment</option>
                    <option value="personnel">Personnel</option>
                    <option value="editing">Editing</option>
                    <option value="other">Other</option>
                  </select>
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
                    {editingAddon ? "Update Add-on" : "Create Add-on"}
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

export default ManageAddons
