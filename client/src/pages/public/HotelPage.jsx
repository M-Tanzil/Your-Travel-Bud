import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    loadHotel();
  }, [id]);

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
                    alt=""
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

                ₹{hotel.pricePerNight}

              </h4>

              <small>

                Per Night

              </small>

              <p className="mt-3">

                {hotel.description}

              </p>

              <p>

                <strong>City :</strong>{" "}

                {hotel.cityId?.name}

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
                        ₹{room.price}
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

            {hotel.location?.coordinates?.lat && (

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