import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
} from "react-bootstrap";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const AppNavbar = () => {
  const {
    user,
    logout,
    isAdmin,
  } = useAuth();

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const navigate =
    useNavigate();

  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const handleLogout =
    async () => {
      await logout();
      navigate("/");
      setExpanded(false);
    };

  return (
    <Navbar
      expand="lg"
      className="tb-navbar"
      expanded={expanded}
      onToggle={
        setExpanded
      }
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={() =>
            setExpanded(false)
          }
        >
          ✈️ Travel Buddy
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/explore"
              onClick={() =>
                setExpanded(false)
              }
            >
              Explore
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/hidden-gems"
              onClick={() =>
                setExpanded(false)
              }
            >
              Hidden Gems
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/leaderboard"
              onClick={() =>
                setExpanded(false)
              }
            >
              Top Rated
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/blogs"
              onClick={() =>
                setExpanded(false)
              }
            >
              Community
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <Form.Check
              type="switch"
              id="theme-toggle"
              checked={
                theme ===
                "dark"
              }
              onChange={
                toggleTheme
              }
              style={{
                marginBottom: 0,
              }}
            />

            {user ? (
              <>
                {isAdmin && (
                  <Nav.Link
                    as={NavLink}
                    to="/admin"
                    className="text-warning fw-semibold"
                    onClick={() =>
                      setExpanded(
                        false
                      )
                    }
                  >
                    Admin
                  </Nav.Link>
                )}

                <NavDropdown
                  title={
                    <span>
                      👤{" "}
                      {
                        user.name?.split(
                          " "
                        )[0]
                      }
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/dashboard"
                    onClick={() =>
                      setExpanded(
                        false
                      )
                    }
                  >
                    Dashboard
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/my-trips"
                    onClick={() =>
                      setExpanded(
                        false
                      )
                    }
                  >
                    My Trips
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/my-bookings"
                    onClick={() =>
                      setExpanded(
                        false
                      )
                    }
                  >
                    My Bookings
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/wishlist"
                    onClick={() =>
                      setExpanded(
                        false
                      )
                    }
                  >
                    Wishlist
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/profile"
                    onClick={() =>
                      setExpanded(
                        false
                      )
                    }
                  >
                    Profile
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    onClick={
                      handleLogout
                    }
                    className="text-danger"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() =>
                    setExpanded(
                      false
                    )
                  }
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    setExpanded(
                      false
                    )
                  }
                >
                  Sign Up
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;