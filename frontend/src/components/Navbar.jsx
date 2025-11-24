"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav
      style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 1000 }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "70px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MC Events
            </span>
          </Link>

          <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, gap: "8px", alignItems: "center" }}>
            <li>
              <Link
                to="/"
                style={{
                  padding: "8px 16px",
                  color: "#4a5568",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                  display: "block",
                }}
                onMouseEnter={(e) => ((e.target.style.background = "#f7fafc"), (e.target.style.color = "#FAB12F"))}
                onMouseLeave={(e) => ((e.target.style.background = "transparent"), (e.target.style.color = "#4a5568"))}
              >
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {isAdmin() ? (
                  <>
                    <li>
                      <Link
                        to="/admin"
                        style={{
                          padding: "8px 16px",
                          color: "#4a5568",
                          textDecoration: "none",
                          borderRadius: "8px",
                          fontWeight: "500",
                          transition: "all 0.2s",
                          display: "block",
                        }}
                        onMouseEnter={(e) => (
                          (e.target.style.background = "#f7fafc"), (e.target.style.color = "#FAB12F")
                        )}
                        onMouseLeave={(e) => (
                          (e.target.style.background = "transparent"), (e.target.style.color = "#4a5568")
                        )}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/packages"
                        style={{
                          padding: "8px 16px",
                          color: "#4a5568",
                          textDecoration: "none",
                          borderRadius: "8px",
                          fontWeight: "500",
                          transition: "all 0.2s",
                          display: "block",
                        }}
                        onMouseEnter={(e) => (
                          (e.target.style.background = "#f7fafc"), (e.target.style.color = "#FAB12F")
                        )}
                        onMouseLeave={(e) => (
                          (e.target.style.background = "transparent"), (e.target.style.color = "#4a5568")
                        )}
                      >
                        Packages
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/bookings"
                        style={{
                          padding: "8px 16px",
                          color: "#4a5568",
                          textDecoration: "none",
                          borderRadius: "8px",
                          fontWeight: "500",
                          transition: "all 0.2s",
                          display: "block",
                        }}
                        onMouseEnter={(e) => (
                          (e.target.style.background = "#f7fafc"), (e.target.style.color = "#FAB12F")
                        )}
                        onMouseLeave={(e) => (
                          (e.target.style.background = "transparent"), (e.target.style.color = "#4a5568")
                        )}
                      >
                        Bookings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/addons"
                        style={{
                          padding: "8px 16px",
                          color: "#4a5568",
                          textDecoration: "none",
                          borderRadius: "8px",
                          fontWeight: "500",
                          transition: "all 0.2s",
                          display: "block",
                        }}
                        onMouseEnter={(e) => (
                          (e.target.style.background = "#f7fafc"), (e.target.style.color = "#FAB12F")
                        )}
                        onMouseLeave={(e) => (
                          (e.target.style.background = "transparent"), (e.target.style.color = "#4a5568")
                        )}
                      >
                        Add-ons
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/my-bookings"
                      style={{
                        padding: "8px 16px",
                        color: "#4a5568",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontWeight: "500",
                        transition: "all 0.2s",
                        display: "block",
                      }}
                      onMouseEnter={(e) => (
                        (e.target.style.background = "#f7fafc"), (e.target.style.color = "#FAB12F")
                      )}
                      onMouseLeave={(e) => (
                        (e.target.style.background = "transparent"), (e.target.style.color = "#4a5568")
                      )}
                    >
                      My Bookings
                    </Link>
                  </li>
                )}

                <li
                  style={{
                    marginLeft: "8px",
                    padding: "8px 12px",
                    background: "#f7fafc",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span style={{ color: "#2d3748", fontWeight: "500", fontSize: "14px" }}>{user?.full_name}</span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) => (
                      (e.target.style.transform = "translateY(-2px)"),
                      (e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)")
                    )}
                    onMouseLeave={(e) => (
                      (e.target.style.transform = "translateY(0)"), (e.target.style.boxShadow = "none")
                    )}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    style={{
                      padding: "10px 20px",
                      color: "#FAB12F",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      transition: "all 0.2s",
                      display: "block",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "#f7fafc")}
                    onMouseLeave={(e) => (e.target.style.background = "transparent")}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      transition: "all 0.2s",
                      display: "block",
                    }}
                    onMouseEnter={(e) => (
                      (e.target.style.transform = "translateY(-2px)"),
                      (e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)")
                    )}
                    onMouseLeave={(e) => (
                      (e.target.style.transform = "translateY(0)"), (e.target.style.boxShadow = "none")
                    )}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
