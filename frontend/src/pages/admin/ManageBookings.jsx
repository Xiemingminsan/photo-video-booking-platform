"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { bookingService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function ManageBookings() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/")
      return
    }
    fetchBookings()
  }, [isAuthenticated, isAdmin])

  useEffect(() => {
    filterBookings()
  }, [statusFilter, bookings])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getAll()
      setBookings(data)
      setError("")
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Failed to load bookings. Please try again."
      setError(formattedDetail)
      console.error("Error fetching bookings:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings)
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter))
    }
  }

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: "0.375rem 0.875rem",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
        <div style={{ color: "white", fontSize: "1.25rem", fontWeight: "500" }}>Loading bookings...</div>
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
            <h1 style={{ fontSize: "2.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Manage Bookings</h1>
            <p style={{ opacity: 0.9, fontSize: "1rem" }}>Review and update booking requests from clients</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: "white",
              color: "#FAB12F",
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              border: "none",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              outline: "none",
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {error && (
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
                  ID
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
                  Client
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
                  Package
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
                  Event Date
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
                  Location
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
                  Status
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
                  Total
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
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "3rem", textAlign: "center" }}>
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      style={{ margin: "0 auto 1rem" }}
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>No bookings found.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    style={{
                      borderTop: index > 0 ? "1px solid #e2e8f0" : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                  >
                    <td style={{ padding: "1.25rem" }}>
                      <span
                        style={{
                          background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                          color: "white",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "6px",
                          fontSize: "0.875rem",
                          fontWeight: "700",
                        }}
                      >
                        #{booking.id}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "0.25rem" }}>
                        {booking.user?.full_name || "N/A"}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{booking.user?.email || ""}</div>
                    </td>
                    <td style={{ padding: "1.25rem", color: "#475569", fontWeight: "500" }}>
                      {booking.package?.title || booking.package?.name || "N/A"}
                    </td>
                    <td style={{ padding: "1.25rem", color: "#475569", fontWeight: "500" }}>
                      {formatDate(booking.event_date)}
                    </td>
                    <td
                      style={{
                        padding: "1.25rem",
                        fontSize: "0.875rem",
                        color: "#64748b",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {booking.location}
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <span style={getStatusBadgeStyle(booking.status)}>{booking.status}</span>
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
                        ETB {booking.total_price}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <button
                          onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                          style={{
                            background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                            color: "white",
                            padding: "0.5rem 1.25rem",
                            borderRadius: "8px",
                            border: "none",
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: "0 2px 8px rgba(250,177,47,0.3)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(250,177,47,0.4)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(250,177,47,0.3)"
                          }}
                        >
                          View Details
                        </button>
                        {booking.status === "completed" && (
                          <button
                            onClick={() => navigate(`/admin/delivery/${booking.id}`)}
                            style={{
                              background: "white",
                              color: "#16a34a",
                              padding: "0.5rem 1.25rem",
                              borderRadius: "8px",
                              border: "2px solid #16a34a",
                              fontSize: "0.875rem",
                              fontWeight: "700",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#16a34a"
                              e.currentTarget.style.color = "white"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "white"
                              e.currentTarget.style.color = "#16a34a"
                            }}
                          >
                            Upload Delivery
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageBookings
