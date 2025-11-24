import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deliveryService, bookingService } from "../../api/services";
import { useAuth } from "../../context/AuthContext";

function DeliveryView() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [delivery, setDelivery] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchDeliveryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, isAuthenticated]);

  const fetchDeliveryData = async () => {
    try {
      setLoading(true);
      setDeliveryMessage("");

      const bookingData = await bookingService.getById(bookingId);
      if (bookingData.user_id !== user.id) {
        setError("You do not have permission to view this delivery.");
        setLoading(false);
        return;
      }

      setBooking(bookingData);

      try {
        const deliveryData = await deliveryService.getByBooking(bookingId);
        setDelivery(deliveryData);
      } catch (deliveryErr) {
        if (deliveryErr.response?.status === 404) {
          setDelivery(null);
          setDeliveryMessage("No delivery available for this booking yet.");
        } else {
          throw deliveryErr;
        }
      }

      setError("");
    } catch (err) {
      setError("Failed to load delivery information. Please try again.");
      console.error("Error fetching delivery:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const fileBlocks = (deliveryData) => {
    const photoList = deliveryData.photo_urls || deliveryData.file_urls || [];
    const videoList = deliveryData.video_urls || [];
    const downloads = deliveryData.download_links || [];
    const items = [];

    photoList.forEach((url, idx) => {
      items.push({
        key: `photo-${idx}`,
        label: url.split("/").pop() || `Photo ${idx + 1}`,
        url,
        icon: "📂",
        cta: "Download",
      });
    });

    videoList.forEach((url, idx) => {
      items.push({
        key: `video-${idx}`,
        label: url.split("/").pop() || `Video ${idx + 1}`,
        url,
        icon: "🎬",
        cta: "Download",
      });
    });

    downloads.forEach((link, idx) => {
      items.push({
        key: `dl-${idx}`,
        label: link.description || link.type || `Link ${idx + 1}`,
        url: link.url,
        icon: "🔗",
        cta: "Open",
        download: false,
      });
    });

    return items;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "40px", textAlign: "center" }}>
        <div className="loading">Loading delivery information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <Link to="/my-bookings" className="btn btn-secondary">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const files = delivery ? fileBlocks(delivery) : [];

  return (
    <div className="container">
      <div className="delivery-container">
        <div className="breadcrumb">
          <Link to="/my-bookings">My Bookings</Link> / <span>Delivery</span>
        </div>

        <h1>Your Delivered Files</h1>

        {booking && (
          <div className="delivery-booking-info">
            <h2>{booking.package?.title || booking.package?.name}</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Event Date:</span>
                <span className="value">{formatDate(booking.event_date)}</span>
              </div>
              <div className="info-item">
                <span className="label">Location:</span>
                <span className="value">{booking.location}</span>
              </div>
            </div>
          </div>
        )}

        {deliveryMessage && (
          <div className="info-item" style={{ marginBottom: "20px" }}>
            <span className="text-muted">{deliveryMessage}</span>
          </div>
        )}

        {delivery && (
          <div className="delivery-content">
            <div className="delivery-card">
              <div className="delivery-header">
                <h3>Delivery Information</h3>
                <span className="delivery-date">
                  Delivered on {formatDate(delivery.delivered_at || delivery.created_at)}
                </span>
              </div>

              {(delivery.delivery_notes || delivery.notes) && (
                <div className="delivery-notes">
                  <h4>Photographer&apos;s Notes:</h4>
                  <p>{delivery.delivery_notes || delivery.notes}</p>
                </div>
              )}

              <div className="delivery-files">
                <h4>Your Files</h4>
                {files.length > 0 ? (
                  <div className="files-list">
                    {files.map((item) => (
                      <div key={item.key} className="file-item">
                        <div className="file-info">
                          <span className="file-icon">{item.icon}</span>
                          <span className="file-name">{item.label}</span>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-small btn-primary"
                          download={item.download !== false}
                        >
                          {item.cta || "Download"}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-files">No files available for download.</p>
                )}
              </div>

              {delivery.gallery_url && (
                <div className="gallery-section">
                  <h4>Online Gallery</h4>
                  <p>View all your photos in our online gallery:</p>
                  <a
                    href={delivery.gallery_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Open Gallery
                  </a>
                </div>
              )}

              <div className="delivery-footer">
                <p className="delivery-tip">
                  Tip: Download your files to your computer for safekeeping. Files will be available for download for 90 days.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="delivery-actions">
          <Link to="/my-bookings" className="btn btn-secondary">
            Back to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeliveryView;
