"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { packageService } from "../../api/services"

function Home() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const params = filter ? { category: filter } : {}
      const data = await packageService.getAll(params)
      setPackages(data)
      setError("")
    } catch (err) {
      setError("Failed to load packages. Please try again.")
      console.error("Error fetching packages:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    fetchPackages()
  }, [filter])

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
        <div
          style={{
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "500",
          }}
        >
          Loading packages...
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FEF3E2" }}>
      {/* Hero Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
          padding: "4rem 1.5rem 3rem",
          color: "white",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              marginBottom: "1rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Photography Packages
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              opacity: "0.95",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Choose the perfect package for your special moments
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Filter Section */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <label
            htmlFor="category-filter"
            style={{
              fontWeight: "600",
              color: "#334155",
              fontSize: "0.95rem",
            }}
          >
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={filter}
            onChange={handleFilterChange}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "500",
              cursor: "pointer",
              background: "white",
              transition: "all 0.2s",
              outline: "none",
            }}
          >
            <option value="">All Categories</option>
            <option value="photography">Photography</option>
            <option value="videography">Videography</option>
            <option value="combo">Photo & Video Combo</option>
            <option value="editing">Editing Only</option>
          </select>
        </div>

        {error && (
          <div
            style={{
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              color: "#991b1b",
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              fontWeight: "500",
              boxShadow: "0 2px 10px rgba(239,68,68,0.1)",
            }}
          >
            {error}
          </div>
        )}

        {/* Packages Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {packages.length === 0 ? (
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500" }}>
                No packages available at the moment.
              </p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(0,0,0,0.05)",
                  cursor: "pointer",
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
                {/* Category Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                    color: "white",
                    padding: "0.375rem 0.875rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {pkg.category}
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#1e293b",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {pkg.title}
                  </h3>
                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: "1.6",
                      marginBottom: "1.5rem",
                      minHeight: "3rem",
                    }}
                  >
                    {pkg.description}
                  </p>

                  {/* Details Grid */}
                  <div
                    style={{
                      display: "grid",
                      gap: "0.75rem",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        background: "#f8fafc",
                        borderRadius: "8px",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAB12F" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span style={{ fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
                        Duration:{" "}
                        <strong style={{ color: "#1e293b" }}>{pkg.duration ? `${pkg.duration} hours` : "N/A"}</strong>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem",
                        background: "#f8fafc",
                        borderRadius: "8px",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAB12F" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontSize: "0.9rem", color: "#475569", fontWeight: "500" }}>
                        Features: <strong style={{ color: "#1e293b" }}>{pkg.features?.length || 0} included</strong>
                      </span>
                    </div>
                  </div>

                  {/* Price */}
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
                    <div style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>Starting at</div>
                    <div style={{ fontSize: "2rem", fontWeight: "700" }}>ETB {pkg.price}</div>
                  </div>

                  {/* Button */}
                  <Link
                    to={`/package/${pkg.id}`}
                    style={{
                      display: "block",
                      background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                      color: "white",
                      padding: "0.875rem",
                      borderRadius: "10px",
                      textAlign: "center",
                      fontWeight: "600",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 12px rgba(250,177,47,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)"
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(250,177,47,0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(250,177,47,0.3)"
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
