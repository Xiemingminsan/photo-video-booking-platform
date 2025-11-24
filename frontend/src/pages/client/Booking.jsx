"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { packageService, addonService, bookingService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function Booking() {
  const { packageId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [packageData, setPackageData] = useState(null)
  const [addons, setAddons] = useState([])
  const [selectedAddons, setSelectedAddons] = useState([])
  const [formData, setFormData] = useState({
    event_date: "",
    event_time: "",
    event_type: "",
    location: "",
    notes: "",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    if (!packageId) {
      setError("Invalid package selected.")
      setLoading(false)
      return
    }
    fetchData()
  }, [packageId, isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pkgData, addonsData] = await Promise.all([packageService.getById(packageId), addonService.getAll()])
      setPackageData(pkgData)
      setAddons(addonsData)
      setError("")
    } catch (err) {
      setError("Failed to load booking information. Please try again.")
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddonToggle = (addonId) => {
    setSelectedAddons((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]))
  }

  const calculateTotal = () => {
    if (!packageData) return 0
    const packagePrice = Number.parseFloat(packageData.price)
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find((a) => a.id === addonId)
      return sum + (addon ? Number.parseFloat(addon.price) : 0)
    }, 0)
    return packagePrice + addonsTotal
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const bookingData = {
        package_id: packageId,
        event_date: formData.event_date,
        event_time: formData.event_time,
        event_type: formData.event_type,
        location: formData.location,
        notes: formData.notes,
        addon_ids: selectedAddons.map((addonId) => ({
          addon_id: addonId,
          quantity: 1,
        })),
      }

      await bookingService.create(bookingData)
      navigate("/my-bookings", {
        state: { message: "Booking submitted successfully!" },
      })
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail || "Failed to create booking. Please try again."
      setError(formattedDetail)
      console.error("Error creating booking:", err)
    } finally {
      setSubmitting(false)
    }
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
          <div style={{ color: "#4a5568", fontSize: "16px" }}>Loading booking form...</div>
        </div>
      </div>
    )
  }

  if (error && !packageData) {
    return (
      <div
        style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f7fafc, #edf2f7)", padding: "40px 20px" }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #f87171",
              borderRadius: "12px",
              padding: "16px",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
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
          <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0 0 8px" }}>Book Your Session</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Fill in the details below to complete your booking</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px" }}>
          <div>
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

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "32px",
                  marginBottom: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a202c", marginBottom: "24px" }}>
                  Event Details
                </h2>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#2d3748",
                      marginBottom: "8px",
                    }}
                  >
                    Event Type *
                  </label>
                  <input
                    type="text"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    required
                    placeholder="Wedding, corporate shoot, birthday..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#2d3748",
                        marginBottom: "8px",
                      }}
                    >
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#2d3748",
                        marginBottom: "8px",
                      }}
                    >
                      Event Time *
                    </label>
                    <input
                      type="time"
                      name="event_time"
                      value={formData.event_time}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "15px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#2d3748",
                      marginBottom: "8px",
                    }}
                  >
                    Event Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter the event venue or address"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#2d3748",
                      marginBottom: "8px",
                    }}
                  >
                    Special Requests
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Any special requirements or notes for the photographer..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
              </div>

              {addons.length > 0 && (
                <div
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "32px",
                    marginBottom: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a202c", marginBottom: "20px" }}>
                    Add-ons (Optional)
                  </h2>
                  <div style={{ display: "grid", gap: "12px" }}>
                    {addons.map((addon) => (
                      <label
                        key={addon.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "16px",
                          border: `2px solid ${selectedAddons.includes(addon.id) ? "#FAB12F" : "#e2e8f0"}`,
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          background: selectedAddons.includes(addon.id) ? "#f7fafc" : "white",
                        }}
                        onMouseEnter={(e) =>
                          !selectedAddons.includes(addon.id) && (e.currentTarget.style.borderColor = "#cbd5e0")
                        }
                        onMouseLeave={(e) =>
                          !selectedAddons.includes(addon.id) && (e.currentTarget.style.borderColor = "#e2e8f0")
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={() => handleAddonToggle(addon.id)}
                          style={{ width: "20px", height: "20px", cursor: "pointer" }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600", color: "#1a202c", marginBottom: "4px" }}>{addon.name}</div>
                          <div style={{ fontSize: "14px", color: "#718096" }}>{addon.description}</div>
                        </div>
                        <div style={{ fontSize: "18px", fontWeight: "700", color: "#FAB12F" }}>+ETB{addon.price}</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: submitting ? "#cbd5e0" : "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                }}
                onMouseEnter={(e) =>
                  !submitting &&
                  ((e.target.style.transform = "translateY(-2px)"),
                  (e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)"))
                }
                onMouseLeave={(e) =>
                  !submitting &&
                  ((e.target.style.transform = "translateY(0)"),
                  (e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)"))
                }
              >
                {submitting ? "Submitting..." : "Submit Booking"}
              </button>
            </form>
          </div>

          <div>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                position: "sticky",
                top: "100px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a202c", marginBottom: "24px" }}>
                Booking Summary
              </h2>

              <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#718096",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Package
                </div>
                <div style={{ color: "#2d3748", fontWeight: "600" }}>{packageData?.title || packageData?.name}</div>
              </div>

              <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#718096",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Event Type
                </div>
                <div style={{ color: "#2d3748" }}>{formData.event_type || "—"}</div>
              </div>

              <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#718096",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Event Date/Time
                </div>
                <div style={{ color: "#2d3748" }}>
                  {formData.event_date || "—"} {formData.event_time || ""}
                </div>
              </div>

              <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#718096",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Duration
                </div>
                <div style={{ color: "#2d3748" }}>{packageData?.duration} hours</div>
              </div>

              <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#4a5568" }}>Package Price</span>
                  <span style={{ fontWeight: "600", color: "#2d3748" }}>ETB{packageData?.price}</span>
                </div>
              </div>

              {selectedAddons.length > 0 && (
                <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #e2e8f0" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#4a5568" }}>Add-ons</span>
                    <span style={{ fontWeight: "600", color: "#2d3748" }}>
                      ETB
                      {selectedAddons.reduce((sum, addonId) => {
                        const addon = addons.find((a) => a.id === addonId)
                        return sum + (addon ? Number.parseFloat(addon.price) : 0)
                      }, 0)}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#718096" }}>
                    {selectedAddons.map((addonId) => {
                      const addon = addons.find((a) => a.id === addonId)
                      return addon ? (
                        <div key={addon.id} style={{ marginTop: "4px" }}>
                          • {addon.name}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              <div
                style={{
                  background: "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>Total</span>
                  <span style={{ color: "white", fontSize: "28px", fontWeight: "700" }}>ETB{calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
