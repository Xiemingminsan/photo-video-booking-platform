"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { bookingService, deliveryService } from "../../api/services"
import { useAuth } from "../../context/AuthContext"

function UploadDelivery() {
  const { isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState("")
  const [formData, setFormData] = useState({
    file_urls: "",
    gallery_url: "",
    delivery_notes: "",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/")
      return
    }
    fetchCompletedBookings()
  }, [isAuthenticated, isAdmin])

  const fetchCompletedBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getAll({ status: "completed" })
      setBookings(data.filter((b) => b.status === "completed"))
      setError("")
    } catch (err) {
      setError("Failed to load bookings. Please try again.")
      console.error("Error fetching bookings:", err)
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

  const handleBookingChange = async (e) => {
    const bookingId = e.target.value
    setSelectedBooking(bookingId)
    setSuccess("")
    setError("")

    if (bookingId) {
      try {
        const existingDelivery = await deliveryService.getByBooking(bookingId)
        setFormData({
          file_urls: existingDelivery.photo_urls?.join("\n") || existingDelivery.file_urls?.join("\n") || "",
          gallery_url:
            existingDelivery.download_links?.find((l) => l.type === "gallery")?.url ||
            existingDelivery.gallery_url ||
            "",
          delivery_notes: existingDelivery.delivery_notes || existingDelivery.notes || "",
        })
      } catch (err) {
        setFormData({
          file_urls: "",
          gallery_url: "",
          delivery_notes: "",
        })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    try {
      const photo_urls = formData.file_urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url)

      const download_links = formData.gallery_url
        ? [
            {
              type: "gallery",
              url: formData.gallery_url.trim(),
              description: "Gallery",
            },
          ]
        : []

      const deliveryData = {
        photo_urls,
        download_links,
        notes: formData.delivery_notes.trim(),
      }

      try {
        await deliveryService.getByBooking(selectedBooking)
        await deliveryService.update(selectedBooking, deliveryData)
        setSuccess("Delivery updated successfully!")
      } catch (err) {
        await deliveryService.create({
          booking_id: selectedBooking,
          ...deliveryData,
        })
        setSuccess("Delivery created successfully!")
      }

      setFormData({
        file_urls: "",
        gallery_url: "",
        delivery_notes: "",
      })
      setSelectedBooking("")
    } catch (err) {
      const detail = err.response?.data?.detail
      const formattedDetail = Array.isArray(detail) ? detail.map((d) => d.msg).join(", ") : detail
      setError(formattedDetail || "Failed to save delivery. Please try again.")
      console.error("Error saving delivery:", err)
    } finally {
      setSubmitting(false)
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
          Loading bookings...
        </div>
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
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              margin: "0 0 12px 0",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Upload Delivery Files
          </h1>
          <p
            style={{
              fontSize: "18px",
              opacity: 0.9,
              margin: 0,
            }}
          >
            Upload and manage delivery files for completed bookings
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "-40px auto 0", padding: "0 20px 60px" }}>
        {/* Messages */}
        {error && (
          <div
            style={{
              padding: "20px",
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: "12px",
              color: "#c33",
              marginBottom: "20px",
              fontSize: "16px",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              padding: "20px",
              background: "#efe",
              border: "1px solid #cfc",
              borderRadius: "12px",
              color: "#3c3",
              marginBottom: "20px",
              fontSize: "16px",
            }}
          >
            {success}
          </div>
        )}

        {/* Form */}
        {bookings.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "60px 40px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cbd5e0"
              strokeWidth="2"
              style={{ margin: "0 auto 20px" }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p style={{ fontSize: "18px", color: "#718096" }}>No completed bookings available for delivery upload.</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "40px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            {/* Select Booking */}
            <div style={{ marginBottom: "28px" }}>
              <label
                htmlFor="booking"
                style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginBottom: "8px",
                }}
              >
                Select Booking *
              </label>
              <select
                id="booking"
                value={selectedBooking}
                onChange={handleBookingChange}
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  background: "white",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              >
                <option value="">-- Choose a completed booking --</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    #{booking.id} - {booking.user?.full_name} - {booking.package?.name}({formatDate(booking.event_date)}
                    )
                  </option>
                ))}
              </select>
            </div>

            {selectedBooking && (
              <>
                {/* File URLs */}
                <div style={{ marginBottom: "28px" }}>
                  <label
                    htmlFor="file_urls"
                    style={{
                      display: "block",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "8px",
                    }}
                  >
                    File URLs *
                  </label>
                  <textarea
                    id="file_urls"
                    name="file_urls"
                    value={formData.file_urls}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Enter file URLs, one per line:&#10;https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg&#10;https://example.com/album.zip"
                    style={{
                      width: "100%",
                      padding: "14px",
                      fontSize: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      fontFamily: "monospace",
                      resize: "vertical",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                  <small style={{ fontSize: "14px", color: "#718096", display: "block", marginTop: "8px" }}>
                    Enter one URL per line. These URLs should point to downloadable files.
                  </small>
                </div>

                {/* Gallery URL */}
                <div style={{ marginBottom: "28px" }}>
                  <label
                    htmlFor="gallery_url"
                    style={{
                      display: "block",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "8px",
                    }}
                  >
                    Gallery URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="gallery_url"
                    name="gallery_url"
                    value={formData.gallery_url}
                    onChange={handleChange}
                    placeholder="https://gallery.example.com/album/12345"
                    style={{
                      width: "100%",
                      padding: "14px",
                      fontSize: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                  <small style={{ fontSize: "14px", color: "#718096", display: "block", marginTop: "8px" }}>
                    Link to an online gallery where the client can view all photos.
                  </small>
                </div>

                {/* Delivery Notes */}
                <div style={{ marginBottom: "32px" }}>
                  <label
                    htmlFor="delivery_notes"
                    style={{
                      display: "block",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "8px",
                    }}
                  >
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    id="delivery_notes"
                    name="delivery_notes"
                    value={formData.delivery_notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add any notes or instructions for the client..."
                    style={{
                      width: "100%",
                      padding: "14px",
                      fontSize: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      resize: "vertical",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#FAB12F")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: "14px 32px",
                      background: submitting ? "#cbd5e0" : "linear-gradient(135deg, #FAB12F 0%, #FA812F 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: submitting ? "not-allowed" : "pointer",
                      transition: "transform 0.2s",
                      opacity: submitting ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => !submitting && (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    {submitting ? "Saving..." : "Save Delivery"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBooking("")
                      setFormData({
                        file_urls: "",
                        gallery_url: "",
                        delivery_notes: "",
                      })
                      setError("")
                      setSuccess("")
                    }}
                    style={{
                      padding: "14px 32px",
                      background: "white",
                      color: "#FAB12F",
                      border: "2px solid #FAB12F",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
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
                    Clear Form
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Tips Box */}
        <div
          style={{
            marginTop: "24px",
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1a1a1a",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Tips for Delivery Upload
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              "Make sure all file URLs are publicly accessible or require authentication",
              "Use cloud storage services like Google Drive, Dropbox, or AWS S3",
              "Consider creating a ZIP archive for easier download",
              "Test all URLs before submitting to ensure they work",
              "Include high-resolution versions if promised in the package",
            ].map((tip, idx) => (
              <li
                key={idx}
                style={{
                  padding: "12px 0",
                  borderBottom: idx < 4 ? "1px solid #e2e8f0" : "none",
                  fontSize: "16px",
                  color: "#4a5568",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FAB12F"
                  strokeWidth="2"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UploadDelivery
