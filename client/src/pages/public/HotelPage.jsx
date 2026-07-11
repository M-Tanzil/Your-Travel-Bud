import { useEffect, useState } from "react";
import { wishlistAPI, bookingAPI } from "../../api";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { hotelAPI } from "../../api";

const HotelPage = () => {
  const { id } = useParams();
const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");


  useEffect(() => {
    loadHotel();
  }, [id]);
  const [bookingData, setBookingData] = useState({
  roomType: "single",
  checkIn: "",
  checkOut: "",
  adults: 1,
  children: 0,
  rooms: 1,
});
 const handleBookNow = async () => {
  try {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      return alert("Please select check-in and check-out dates.");
    }

    const totalPrice =
      (hotel.pricePerNight || 0) *
      bookingData.rooms;

    const payload = {
      hotelId: hotel._id,
      roomType: bookingData.roomType,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,

      guests: {
        adults: Number(bookingData.adults),
        children: Number(bookingData.children),
      },

      rooms: Number(bookingData.rooms),

      totalPrice,
    };

    const res = await bookingAPI.bookHotel(payload);

    alert(
      `Booking Successful 🎉\nReference: ${res.data.data.bookingReference}`
    );
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Booking failed"
    );
  }
};
const handleWishlist = async () => {
  try {
    await wishlistAPI.add({
      itemId: hotel._id,
      itemType: "Hotel",
    });

    alert("Added to wishlist ❤️");
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to add wishlist"
    );
  }
};

  const loadHotel = async () => {
    try {
      const res = await hotelAPI.getOne(id);

      setHotel(res.data.data);

      if (res.data.data.photos?.length) {
        setSelectedImage(res.data.data.photos[0].url);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-5">
        Hotel not found
      </div>
    );
  }

  const amenities = [
    ["wifi", "📶 WiFi"],
    ["pool", "🏊 Swimming Pool"],
    ["parking", "🚗 Parking"],
    ["gym", "🏋 Gym"],
    ["restaurant", "🍽 Restaurant"],
    ["spa", "💆 Spa"],
    ["airConditioning", "❄ Air Conditioning"],
    ["roomService", "🛎 Room Service"],
    ["bar", "🍸 Bar"],
    ["laundry", "👕 Laundry"],
  ];

  return (
    <Container className="py-4">

      {/* Hero */}

      <Row>

        <Col lg={8}>

          <Card className="shadow-sm border-0">

            <img
              src={
  selectedImage ||
  hotel.photos?.[0]?.url ||
  "https://placehold.co/900x500?text=No+Image"
}
              alt={hotel.name}
              style={{
                width: "100%",
                height: "450px",
                objectFit: "cover",
              }}
            />

          </Card>

          {hotel.photos?.length > 1 && (

            <Row className="mt-3">

              {hotel.photos.map((photo, index) => (

                <Col xs={3} key={index}>

                  <img
  src={photo.url}
  alt={photo.caption || hotel.name}
  title={photo.caption || hotel.name}
                    onClick={() => setSelectedImage(photo.url)}
                    style={{
                      width: "100%",
                      height: "90px",
                      cursor: "pointer",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                </Col>

              ))}

            </Row>

          )}

        </Col>

        <Col lg={4}>

          <Card className="shadow-sm border-0">

            <Card.Body>

              <h2 className="fw-bold">
                {hotel.name}
              </h2>

              <div className="mb-2">

                <Badge bg="warning">
                  ⭐ {hotel.rating}
                </Badge>

                {" "}

                <Badge bg="info">
                  {hotel.starRating} Star
                </Badge>

              </div>

              {hotel.isVerified && (

                <Badge bg="success">
                  ✔ Verified
                </Badge>

              )}

              {" "}

              {hotel.isFeatured && (

                <Badge bg="danger">
                  ⭐ Featured
                </Badge>

              )}

              <hr />

              <h4 className="text-success">
  {hotel.pricePerNight
    ? `₹${hotel.pricePerNight}`
    : "Price not available"}
</h4>

              <small>

                Per Night

              </small>
              

              <p className="mt-3">

                {hotel.description}

              </p>
              <Card className="mt-3 border-0 bg-light">
  <Card.Body>

    <h6 className="fw-bold mb-3">
      Book this Hotel
    </h6>

    <div className="mb-2">
      <label>Room Type</label>

      <select
        className="form-control"
        value={bookingData.roomType}
        onChange={(e) =>
          setBookingData({
            ...bookingData,
            roomType: e.target.value,
          })
        }
      >
        <option value="single">Single</option>
        <option value="double">Double</option>
        <option value="suite">Suite</option>
        <option value="deluxe">Deluxe</option>
        <option value="family">Family</option>
      </select>
    </div>

    <div className="mb-2">
      <label>Check In</label>

      <input
        type="date"
        className="form-control"
        value={bookingData.checkIn}
        onChange={(e) =>
          setBookingData({
            ...bookingData,
            checkIn: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-2">
      <label>Check Out</label>

      <input
        type="date"
        className="form-control"
        value={bookingData.checkOut}
        onChange={(e) =>
          setBookingData({
            ...bookingData,
            checkOut: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-2">
      <label>Adults</label>

      <input
        type="number"
        min="1"
        className="form-control"
        value={bookingData.adults}
        onChange={(e) =>
          setBookingData({
            ...bookingData,
            adults: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-2">
      <label>Children</label>

      <input
        type="number"
        min="0"
        className="form-control"
        value={bookingData.children}
        onChange={(e) =>
          setBookingData({
            ...bookingData,
            children: e.target.value,
          })
        }
      />
    </div>

    <div className="mb-3">
      <label>Rooms</label>

      <input
        type="number"
        min="1"
        className="form-control"
        value={bookingData.rooms}
        onChange={(e) =>
          setBookingData({
            ...bookingData,
            rooms: e.target.value,
          })
        }
      />
    </div>

    <Button
      variant="success"
      className="w-100"
      onClick={handleBookNow}
    >
      🏨 Book Now
    </Button>

  </Card.Body>
</Card>
<Button
  variant="outline-danger"
  className="w-100 mt-2"
  onClick={handleWishlist}
>
  ❤️ Add to Wishlist
</Button>

              <p>

                <strong>City :</strong>{" "}

                <Link to={`/city/${hotel.cityId?._id}`}>
  {hotel.cityId?.name}
</Link>

              </p>

              <p>

                <strong>Address :</strong>

                <br />

                {hotel.location?.address}

              </p>

              {hotel.location?.googleMapsUrl && (

                <Button
                  className="w-100 mt-2"
                  href={hotel.location.googleMapsUrl}
                  target="_blank"
                >

                  📍 Open in Google Maps

                </Button>

              )}

            </Card.Body>

          </Card>

        </Col>

      </Row>

      {/* Amenities */}

      <Card className="shadow-sm border-0 mt-4">

        <Card.Body>

          <h4 className="mb-4">

            Hotel Amenities

          </h4>

          <Row>

            {amenities.map(([key, label]) =>
              hotel.amenities?.[key] ? (

                <Col md={4} key={key} className="mb-3">

                  <div
                    style={{
                      padding: 15,
                      borderRadius: 10,
                      background: "#f8f9fa",
                    }}
                  >

                    {label}

                  </div>

                </Col>

              ) : null
            )}

          </Row>

        </Card.Body>

      </Card>
            {/* Room Types */}

      <Card className="shadow-sm border-0 mt-4">

        <Card.Body>

          <h4 className="mb-4">
            Available Rooms
          </h4>

          <Row>

            {hotel.roomTypes?.length ? (

              hotel.roomTypes.map((room, index) => (

                <Col md={4} key={index} className="mb-3">

                  <Card className="border-0 shadow-sm h-100">

                    <Card.Body>

                      <h5>{room.type}</h5>

                      <h3 className="text-success">
  {room.price ? `₹${room.price}` : "Price unavailable"}
</h3>

                      <p>
                        Capacity : {room.capacity} Guests
                      </p>

                      <p className="text-muted">
                        {room.description}
                      </p>

                    </Card.Body>

                  </Card>

                </Col>

              ))

            ) : (

              <p>No room information available.</p>

            )}

          </Row>

        </Card.Body>

      </Card>

      {/* Google Map */}

      <Card className="shadow-sm border-0 mt-4">

        <Card.Body>

          <h4 className="mb-3">

            Hotel Location

          </h4>

          <p>

            {hotel.location?.address}

          </p>

          {hotel.location?.googleMapsUrl && (

            <Button
              variant="primary"
              href={hotel.location.googleMapsUrl}
              target="_blank"
            >

              📍 Open in Google Maps

            </Button>

          )}

         <div className="mt-4">

  {hotel.location?.coordinates?.lat ? (

    <iframe
      title="Hotel Map"
      width="100%"
      height="350"
      style={{
        border: 0,
        borderRadius: "12px",
      }}
      loading="lazy"
      src={`https://www.google.com/maps?q=${hotel.location.coordinates.lat},${hotel.location.coordinates.lng}&output=embed`}
    />

  ) : hotel.location?.googleMapsUrl ? (

    <div className="text-center py-4">

      <p style={{ color: "gray" }}>
        Map preview not available.
      </p>

      <Button
        variant="outline-primary"
        href={hotel.location.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        📍 Open in Google Maps
      </Button>

    </div>

  ) : (

    <p style={{ color: "gray" }}>
      Location information not available.
    </p>

  )}

</div>

        </Card.Body>

      </Card>

      {/* Nearby Attractions */}

      {hotel.nearbyPlaces?.length > 0 && (

        <Card className="shadow-sm border-0 mt-4">

          <Card.Body>

            <h4>

              Nearby Attractions

            </h4>

            <Row>

              {hotel.nearbyPlaces.map((place, index) => (

                <Col md={6} key={index} className="mb-3">

                  <Card>

                    <Card.Body>

                      <h5>{place.name}</h5>

                      <p>

                        ⭐ {place.rating || "N/A"}

                      </p>

                      <p>

                        {place.vicinity}

                      </p>

                    </Card.Body>

                  </Card>

                </Col>

              ))}

            </Row>

          </Card.Body>

        </Card>

      )}

    </Container>

  );
};

export default HotelPage;