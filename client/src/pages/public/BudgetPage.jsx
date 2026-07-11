import { useState, useEffect } from "react";
import { budgetAPI, cityAPI } from "../../api";

import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
const BudgetPage = () => {
  const [form, setForm] = useState({
    cityId: "",
    days: 3,
    travelers: 1,
    hotelType: "budget",
    transport: "train",
  });

  const [result, setResult] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const res = await cityAPI.getAll({
        limit: 1000,
      });

      setCities(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };


const handleEstimate = async () => {
  if (!form.cityId) {
    return alert("Please select a destination");
  }

  try {
    setLoading(true);

    const res =
      await budgetAPI.estimate(form);

    setResult(res.data.data);
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Failed to estimate budget"
    );
  }

  setLoading(false);
};

  return (
    <Container className="py-5">

      <h2 className="fw-bold mb-4">
        💰 Trip Budget Estimator
      </h2>

      <Card className="shadow-sm border-0">

        <Card.Body>
           

          <Row>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Destination
                </Form.Label>

                <Form.Select
  value={form.cityId}
  onChange={(e) =>
    setForm({
      ...form,
      cityId: e.target.value,
    })
  }
>
  <option value="">
    Select Destination
  </option>

  {cities.map((city) => (
    <option
      key={city._id}
      value={city._id}
    >
      {city.name}, {city.country}
    </option>
  ))}
</Form.Select>
              </Form.Group>

            </Col>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Number of Days
                </Form.Label>

                <Form.Control
                  type="number"
                  min={1}
                  value={form.days}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      days:
                        e.target.value,
                    })
                  }
                />

              </Form.Group>

            </Col>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Travelers
                </Form.Label>

                <Form.Control
                  type="number"
                  min={1}
                  value={
                    form.travelers
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      travelers:
                        e.target.value,
                    })
                  }
                />

              </Form.Group>

            </Col>

            <Col md={6}>

              <Form.Group className="mb-3">

                <Form.Label>
                  Hotel Type
                </Form.Label>

                <Form.Select
                  value={
                    form.hotelType
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hotelType:
                        e.target.value,
                    })
                  }
                >

                  <option value="budget">
                    Budget
                  </option>

                  <option value="mid-range">
                    Mid Range
                  </option>

                  <option value="luxury">
                    Luxury
                  </option>

                </Form.Select>

              </Form.Group>

            </Col>

            <Col md={6}>

              <Form.Group className="mb-4">

                <Form.Label>
                  Transport
                </Form.Label>

                <Form.Select
                  value={
                    form.transport
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      transport:
                        e.target.value,
                    })
                  }
                >

                  <option value="train">
                    Train
                  </option>

                  <option value="bus">
                    Bus
                  </option>

                  <option value="flight">
                    Flight
                  </option>

                </Form.Select>

              </Form.Group>

            </Col>

          </Row>

          <Button
            onClick={
              handleEstimate
            }
            disabled={loading}
          >
            {loading
              ? "Calculating..."
              : "Estimate Budget"}
          </Button>

        </Card.Body>

      </Card>

      {result && (

        <Card className="mt-4 shadow-sm border-0">

          <Card.Body>
            {result?.city && (
  <h5 className="mb-3">
    📍 {result.city}
  </h5>
)}

            <h4 className="mb-4">
              Estimated Cost
            </h4>

            <p>
              🏨 Hotel :
              ₹{
                result.hotelCost
              }
            </p>

            <p>
              🚂 Transport :
              ₹{
                result.transportCost
              }
            </p>

            <p>
              🍽 Food :
              ₹{
                result.foodCost
              }
            </p>

            <hr />

            <h3 className="text-success">

              Total :
              ₹{
                result.totalBudget
              }

            </h3>

          </Card.Body>

        </Card>

      )}

    </Container>
  );
};

export default BudgetPage;