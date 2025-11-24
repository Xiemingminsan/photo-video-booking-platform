"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { bookingService, packageService, addonService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    completedBookings: 0,
    totalPackages: 0,
    totalAddons: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/")
      return
    }
    fetchDashboardData()
  }, [isAuthenticated, isAdmin])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [bookings, packages, addons] = await Promise.all([
        bookingService.getAll(),
        packageService.getAll(),
        addonService.getAll(),
      ])

      const pendingCount = bookings.filter((b) => b.status === "pending").length
      const approvedCount = bookings.filter((b) => b.status === "approved").length
      const completedCount = bookings.filter((b) => b.status === "completed").length

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pendingCount,
        approvedBookings: approvedCount,
        completedBookings: completedCount,
        totalPackages: packages.length,
        totalAddons: addons.length,
      })

      const sorted = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setRecentBookings(sorted.slice(0, 5))
      setError("")
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
      console.error("Error fetching dashboard data:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
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
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #FAB12F",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          ></div>
          <p style={{ marginTop: "16px", color: "#64748b", fontSize: "14px" }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FEF3E2",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.2)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "white", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>
                  ADMIN DASHBOARD
                </span>
              </div>
              <h1 style={{ fontSize: "36px", fontWeight: "700", color: "white", marginBottom: "8px", lineHeight: "1.2" }}>
                Welcome back!
              </h1>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
                Track bookings, packages, and add-ons at a glance.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <Link
                to="/admin/bookings"
                style={{
                  padding: "12px 24px",
                  background: "white",
                  color: "#FAB12F",
                  borderRadius: "8px",
                  fontWeight: "600",
                  textDecoration: "none",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
              >
                View Bookings
              </Link>
              <Link
                to="/admin/packages"
                style={{
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "8px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "transform 0.2s",
                }}
              >
                Add Package
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: "28px", height: "28px", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px", fontWeight: "500" }}>
                Total Bookings
              </p>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{stats.totalBookings}</p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: "28px", height: "28px", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px", fontWeight: "500" }}>Pending</p>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {stats.pendingBookings}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: "28px", height: "28px", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px", fontWeight: "500" }}>Approved</p>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {stats.approvedBookings}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: "28px", height: "28px", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px", fontWeight: "500" }}>Completed</p>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                {stats.completedBookings}
              </p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: "28px", height: "28px", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px", fontWeight: "500" }}>Packages</p>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{stats.totalPackages}</p>
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #FA812F 0%, #FA4032 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                style={{ width: "28px", height: "28px", color: "white" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px", fontWeight: "500" }}>Add-ons</p>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{stats.totalAddons}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "32px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/admin/packages"
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "16px 24px",
              background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
              color: "white",
              borderRadius: "10px",
              fontWeight: "600",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
          >
            Manage Packages
          </Link>
          <Link
            to="/admin/bookings"
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "16px 24px",
              background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
              color: "white",
              borderRadius: "10px",
              fontWeight: "600",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
          >
            Manage Bookings
          </Link>
          <Link
            to="/admin/addons"
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "16px 24px",
              background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
              color: "white",
              borderRadius: "10px",
              fontWeight: "600",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
          >
            Manage Add-ons
          </Link>
        </div>

        {/* Recent Bookings */}
        <div
          style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Recent Bookings</h2>
            <Link
              to="/admin/bookings"
              style={{
                color: "#FAB12F",
                fontWeight: "600",
                textDecoration: "none",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View All
              <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "#f1f5f9",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "32px", height: "32px", color: "#cbd5e1" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>No bookings yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ID
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Client
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Package
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Event Date
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, index) => (
                    <tr key={booking.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}>
                      <td style={{ padding: "16px", fontSize: "14px", color: "#475569", fontWeight: "600" }}>
                        #{booking.id}
                      </td>
                      <td style={{ padding: "16px", fontSize: "14px", color: "#0f172a", fontWeight: "500" }}>
                        {booking.user?.full_name || "N/A"}
                      </td>
                      <td style={{ padding: "16px", fontSize: "14px", color: "#64748b" }}>
                        {booking.package?.title || booking.package?.name || "N/A"}
                      </td>
                      <td style={{ padding: "16px", fontSize: "14px", color: "#64748b" }}>
                        {formatDate(booking.event_date)}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "600",
                            border: "1px solid",
                          }}
                          className={getStatusBadgeClass(booking.status)}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px",
                          fontSize: "14px",
                          color: "#0f172a",
                          fontWeight: "700",
                          textAlign: "right",
                        }}
                      >
                        ETB {booking.total_price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
