"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { packageService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function PackageDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPackageDetails()
  }, [id])

  const fetchPackageDetails = async () => {
    try {
      setLoading(true)
      const data = await packageService.getById(id)
      setPackageData(data)
      setError("")
    } catch (err) {
      setError("Failed to load package details. Please try again.")
      console.error("Error fetching package:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/package/${id}` } })
    } else {
      navigate(`/booking/${id}`)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            padding: "20px 40px",
            background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
            color: "white",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Loading package details...
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            padding: "24px",
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: "12px",
            color: "#c33",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        >
          {error || "Package not found"}
        </div>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "500",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
          padding: "60px 20px",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "14px",
              marginBottom: "16px",
              opacity: 0.9,
            }}
          >
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Home
            </Link>
            {" / "}
            <span>{packageData.title || packageData.name}</span>
          </div>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              margin: "0 0 12px 0",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {packageData.title || packageData.name}
          </h1>
          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "500",
              backdropFilter: "blur(10px)",
            }}
          >
            {packageData.category}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "-40px auto 0", padding: "0 20px 60px" }}>
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 8px 20px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Price Section */}
          <div
            style={{
              padding: "32px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "16px", marginBottom: "8px", opacity: 0.9 }}>Package Price</div>
            <div style={{ fontSize: "48px", fontWeight: "700" }}>ETB {packageData.price}</div>
          </div>

          {/* Description */}
          <div style={{ padding: "40px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Description
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                color: "#4a5568",
                marginBottom: "40px",
              }}
            >
              {packageData.description}
            </p>

            {/* Package Details Grid */}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "24px",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Package Details
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              {/* Duration Card */}
              <div
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  borderRadius: "12px",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(250, 112, 154, 0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ marginBottom: "12px" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.9 }}>Duration</div>
                <div style={{ fontSize: "20px", fontWeight: "600" }}>
                  {packageData.duration ? `${packageData.duration} hours` : "Varies"}
                </div>
              </div>

              {/* Category Card */}
              <div
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                  borderRadius: "12px",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ marginBottom: "12px" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.9 }}>Category</div>
                <div style={{ fontSize: "20px", fontWeight: "600" }}>{packageData.category}</div>
              </div>

              {/* Price Card */}
              <div
                style={{
                  padding: "24px",
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  borderRadius: "12px",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(240, 147, 251, 0.3)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ marginBottom: "12px" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div style={{ fontSize: "14px", marginBottom: "4px", opacity: 0.9 }}>Price</div>
                <div style={{ fontSize: "20px", fontWeight: "600" }}>ETB {packageData.price}</div>
              </div>
            </div>

            {/* What's Included */}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "20px",
                color: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
              What's Included
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 40px 0",
              }}
            >
              {Array.isArray(packageData.features) && packageData.features.length > 0 ? (
                packageData.features.map((feat, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: "16px",
                      marginBottom: "12px",
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: "8px",
                      borderLeft: "4px solid #FAB12F",
                      fontSize: "16px",
                      color: "#2d3748",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FAB12F" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                    {feat}
                  </li>
                ))
              ) : (
                <li
                  style={{
                    padding: "16px",
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#718096",
                  }}
                >
                  Contact us for full package details.
                </li>
              )}
            </ul>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleBookNow}
                style={{
                  padding: "16px 48px",
                  background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)"
                }}
              >
                Book This Package
              </button>
              <Link
                to="/"
                style={{
                  display: "inline-block",
                  padding: "16px 48px",
                  background: "white",
                  color: "#FAB12F",
                  border: "2px solid #FAB12F",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FAB12F"
                  e.currentTarget.style.color = "white"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.color = "#FAB12F"
                }}
              >
                View Other Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageDetails
