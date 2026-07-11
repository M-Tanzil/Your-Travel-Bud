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
import { placeAPI } from "../../api";

const PlacePage = () => {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlace();
  }, [id]);

  const loadPlace = async () => {
    try {
      const res = await placeAPI.getOne(id);
      setPlace(res.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );

  if (!place)
    return (
      <div className="text-center py-5">
        Place not found
      </div>
    );

  return (
    <Container className="py-4">

      <Row>

        <Col lg={8}>

          <Card className="shadow-sm border-0">

            <img
              src={
                place.photos?.[0]?.url ||
                "https://placehold.co/1000x500?text=No+Image"
              }
              alt={place.name}
              style={{
                width: "100%",
                height: "450px",
                objectFit: "cover",
              }}
            />

          </Card>

        </Col>

        <Col lg={4}>

          <Card className="shadow-sm border-0 h-100">

            <Card.Body>

              <h2>{place.name}</h2>

              <Badge bg="secondary">
                {place.category}
              </Badge>

              <hr />

              <p>
                {place.description}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {place.cityId?.name}
              </p>

              <p>
                <strong>Best Time:</strong>{" "}
                {place.bestTimeToVisit}
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                {place.distanceFromCenter} km
              </p>

              {place.ticketPrice && (
                <p>
                  <strong>Ticket:</strong>{" "}
                  {place.ticketPrice.isFree
                    ? "Free"
                    : `₹${place.ticketPrice.adult}`}
                </p>
              )}

            </Card.Body>

          </Card>

        </Col>

      </Row>

      {/* Opening Hours */}

      <Card className="shadow-sm border-0 mt-4">

        <Card.Body>

          <h4>Opening Hours</h4>

          <p>

            {place.openingHours?.open}
            {" - "}
            {place.openingHours?.close}

          </p>

        </Card.Body>

      </Card>

      {/* Address */}

      <Card className="shadow-sm border-0 mt-4">

        <Card.Body>

          <h4>Location</h4>

          <p>

            {place.location?.address}

          </p>

          {place.location?.googleMapsUrl && (

            <Button
              href={place.location.googleMapsUrl}
              target="_blank"
            >
              📍 Open in Google Maps
            </Button>

          )}

          {place.location?.coordinates?.lat && (

            <iframe
              title="Place Map"
              width="100%"
              height="350"
              style={{
                border: 0,
                borderRadius: "12px",
                marginTop: "20px",
              }}
              src={`https://www.google.com/maps?q=${place.location.coordinates.lat},${place.location.coordinates.lng}&output=embed`}
            />

          )}

        </Card.Body>

      </Card>

    </Container>
  );
};

export default PlacePage;