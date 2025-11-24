"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { bookingService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function MyBookings() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (location.state?.message) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
    }

    fetchBookings()
  }, [user, isAuthenticated])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getUserBookings(user.id)
      setBookings(data)
      setError("")
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Failed to load your bookings. Please try again."
      setError(formattedDetail)
      console.error("Error fetching bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" }
      case "confirmed":
        return { bg: "#dbeafe", text: "#1e40af", border: "#60a5fa" }
      case "completed":
        return { bg: "#d1fae5", text: "#065f46", border: "#34d399" }
      case "cancelled":
        return { bg: "#fee2e2", text: "#991b1b", border: "#f87171" }
      default:
        return { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f7fafc, #edf2f7)",
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #FAB12F",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div style={{ color: "#4a5568", fontSize: "16px" }}>Loading your bookings...</div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f7fafc, #edf2f7)", padding: "40px 20px" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "32px",
            color: "white",
          }}
        >
          <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 8px" }}>My Bookings</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Manage and track your photography sessions</p>
        </div>

        {successMessage && (
          <div
            style={{
              background: "#d1fae5",
              border: "1px solid #34d399",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              color: "#065f46",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            {successMessage}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #f87171",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "60px 40px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                borderRadius: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1a202c", margin: "0 0 12px" }}>
              No bookings yet
            </h2>
            <p style={{ color: "#718096", marginBottom: "32px" }}>
              You haven't made any bookings. Browse our packages to get started!
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "10px",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "24px" }}>
            {bookings.map((booking) => {
              const statusColors = getStatusColor(booking.status)
              return (
                <div
                  key={booking.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
                >
                  <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1a202c", margin: "0 0 8px" }}>
                          {booking.package?.title || booking.package?.name || "Package"}
                        </h3>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            background: statusColors.bg,
                            color: statusColors.text,
                            border: `1px solid ${statusColors.border}`,
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            textTransform: "uppercase",
                          }}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "700", color: "#FAB12F" }}>
                        ETB{booking.total_price}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "24px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#718096",
                          marginBottom: "4px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Event Date
                      </div>
                      <div style={{ color: "#2d3748", fontWeight: "500" }}>{formatDate(booking.event_date)}</div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#718096",
                          marginBottom: "4px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Location
                      </div>
                      <div style={{ color: "#2d3748", fontWeight: "500" }}>{booking.location}</div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#718096",
                          marginBottom: "4px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Booked On
                      </div>
                      <div style={{ color: "#2d3748", fontWeight: "500" }}>{formatDate(booking.created_at)}</div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div style={{ padding: "0 24px 16px" }}>
                      <div style={{ background: "#f7fafc", borderRadius: "8px", padding: "12px" }}>
                        <div style={{ fontSize: "12px", color: "#718096", marginBottom: "4px", fontWeight: "600" }}>
                          Special Requests
                        </div>
                        <div style={{ color: "#2d3748" }}>{booking.notes}</div>
                      </div>
                    </div>
                  )}

                  {booking.addons && booking.addons.length > 0 && (
                    <div style={{ padding: "0 24px 16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748", marginBottom: "8px" }}>
                        Add-ons
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {booking.addons.map((addon) => (
                          <div
                            key={addon.id}
                            style={{
                              background: "#edf2f7",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "13px",
                              color: "#4a5568",
                            }}
                          >
                            {addon.addon?.name || addon.name} - ETB{addon.addon?.price || addon.price}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.admin_notes && (
                    <div style={{ padding: "0 24px 16px" }}>
                      <div
                        style={{
                          background: "#fef3c7",
                          borderRadius: "8px",
                          padding: "12px",
                          border: "1px solid #fcd34d",
                        }}
                      >
                        <div style={{ fontSize: "12px", color: "#92400e", marginBottom: "4px", fontWeight: "600" }}>
                          Admin Notes
                        </div>
                        <div style={{ color: "#78350f" }}>{booking.admin_notes}</div>
                      </div>
                    </div>
                  )}

                  {booking.status === "completed" && (
                    <div style={{ padding: "0 24px 24px" }}>
                      <Link
                        to={`/delivery/${booking.id}`}
                        style={{
                          display: "inline-block",
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "10px",
                          fontWeight: "600",
                          transition: "all 0.2s",
                        }}
                      >
                        View Delivery
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
