"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { bookingService } from "../../api/services"

function BookingDetails() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusData, setStatusData] = useState({ status: "", admin_notes: "" })

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getById(bookingId)
      setBooking(data)
      setStatusData({
        status: data.status,
        admin_notes: data.admin_notes || "",
      })
      setError("")
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Failed to load booking."
      setError(formattedDetail)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (e) => {
    setStatusData({
      ...statusData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    try {
      await bookingService.updateStatus(bookingId, statusData)
      await fetchBooking()
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Failed to update booking."
      setError(formattedDetail)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: "0.5rem 1.25rem",
      borderRadius: "25px",
      fontSize: "0.95rem",
      fontWeight: "700",
      textTransform: "capitalize",
      display: "inline-block",
    }

    switch (status) {
      case "pending":
        return { ...baseStyle, background: "#FEF3E2", color: "#FA812F" }
      case "approved":
        return { ...baseStyle, background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)", color: "white" }
      case "completed":
        return { ...baseStyle, background: "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)", color: "white" }
      case "rejected":
        return { ...baseStyle, background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", color: "#991b1b" }
      default:
        return { ...baseStyle, background: "#f1f5f9", color: "#475569" }
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
        <div style={{ color: "white", fontSize: "1.25rem", fontWeight: "500" }}>Loading booking...</div>
      </div>
    )
  }

  if (error && !booking) {
    return (
      <div style={{ minHeight: "100vh", background: "#FEF3E2", padding: "2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              color: "#991b1b",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            {error || "Booking not found."}
          </div>
          <Link
            to="/admin/bookings"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
              color: "white",
              padding: "0.875rem 1.75rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            ← Back to Bookings
          </Link>
        </div>
      </div>
    )
  }

  const addonList = booking.addons && booking.addons.length > 0 ? booking.addons : booking.booking_addons || []

  const addonTotal = addonList.reduce((sum, addon) => {
    const price = Number.parseFloat(addon.addon?.price || addon.price || 0)
    const qty = addon.quantity || 1
    return sum + price * qty
  }, 0)

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
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.9rem", opacity: 0.85, marginBottom: "0.5rem", fontWeight: "500" }}>
              Booking #{bookingId}
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Booking Details</h1>
            <p style={{ opacity: 0.9, fontSize: "1rem" }}>Review and manage this booking request</p>
          </div>
          <div style={getStatusBadgeStyle(booking.status)}>{booking.status}</div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Client Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FAB12F"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", marginBottom: "1rem" }}>
              Client Information
            </h2>
            <div style={{ color: "#64748b", lineHeight: "1.8" }}>
              <p>
                <strong style={{ color: "#1e293b" }}>Name:</strong> {booking.user?.full_name || "N/A"}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Email:</strong> {booking.user?.email || "N/A"}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Phone:</strong> {booking.user?.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* Package Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FA812F"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", marginBottom: "1rem" }}>
              Package Details
            </h2>
            <div style={{ color: "#64748b", lineHeight: "1.8" }}>
              <p>
                <strong style={{ color: "#1e293b" }}>Title:</strong>{" "}
                {booking.package?.title || booking.package?.name || "N/A"}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Category:</strong> {booking.package?.category}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Duration:</strong>{" "}
                {booking.package?.duration ? `${booking.package.duration} hours` : "N/A"}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Base Price:</strong>{" "}
                <span style={{ color: "#FA812F", fontWeight: "700" }}>ETB {booking.package?.price}</span>
              </p>
            </div>
          </div>

          {/* Event Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FAB12F"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", marginBottom: "1rem" }}>
              Event Information
            </h2>
            <div style={{ color: "#64748b", lineHeight: "1.8" }}>
              <p>
                <strong style={{ color: "#1e293b" }}>Type:</strong> {booking.event_type}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Date:</strong> {formatDate(booking.event_date)}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Time:</strong> {booking.event_time}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Location:</strong> {booking.location}
              </p>
              <p>
                <strong style={{ color: "#1e293b" }}>Notes:</strong> {booking.notes || "—"}
              </p>
            </div>
          </div>

          {/* Add-ons & Pricing Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px solid transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FA812F"
              e.currentTarget.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "transparent"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)",
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b", marginBottom: "1rem" }}>
              Add-ons & Total
            </h2>
            {addonList.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}>
                {addonList.map((addon) => (
                  <li
                    key={addon.id}
                    style={{
                      padding: "0.5rem",
                      background: "#f8fafc",
                      borderRadius: "6px",
                      marginBottom: "0.5rem",
                      color: "#64748b",
                      fontSize: "0.9rem",
                    }}
                  >
                    {addon.addon?.name || addon.name} —{" "}
                    <strong style={{ color: "#1e293b" }}>ETB {addon.addon?.price || addon.price}</strong> x{" "}
                    {addon.quantity || 1}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#94a3b8", fontStyle: "italic", marginBottom: "1rem" }}>No add-ons selected.</p>
            )}
            <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: "1rem", marginTop: "1rem" }}>
              <p style={{ color: "#64748b", marginBottom: "0.5rem" }}>
                <strong style={{ color: "#1e293b" }}>Add-ons Total:</strong>{" "}
                <span style={{ color: "#FA812F", fontWeight: "700" }}>ETB {addonTotal.toFixed(2)}</span>
              </p>
              <p style={{ fontSize: "1.15rem", fontWeight: "700" }}>
                <strong style={{ color: "#1e293b" }}>Grand Total:</strong>{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "1.5rem",
                  }}
                >
                  ETB {booking.total_price}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e293b", marginBottom: "1.5rem" }}>
            Update Booking Status
          </h3>

          {error && (
            <div
              style={{
                background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                color: "#991b1b",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                marginBottom: "1.5rem",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateStatus}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label
                  htmlFor="status"
                  style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                >
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={statusData.status}
                  onChange={handleStatusChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    background: "white",
                    cursor: "pointer",
                    fontWeight: "500",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="admin_notes"
                  style={{ display: "block", fontWeight: "600", color: "#1e293b", marginBottom: "0.5rem" }}
                >
                  Admin Notes
                </label>
                <textarea
                  id="admin_notes"
                  name="admin_notes"
                  value={statusData.admin_notes}
                  onChange={handleStatusChange}
                  rows={3}
                  placeholder="Add notes for the client..."
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  background: "#e2e8f0",
                  color: "#475569",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#cbd5e1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#e2e8f0")}
              >
                ← Back
              </button>
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                  color: "white",
                  padding: "0.875rem 1.75rem",
                  borderRadius: "10px",
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails
