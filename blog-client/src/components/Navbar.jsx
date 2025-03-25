import React from "react";
import { Button, Container, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-between align-items-center my-3">
      <Nav variant="pills" activeKey={location.pathname}>
        <Nav.Item>
          <Nav.Link eventKey="/" onClick={() => navigate("/")}>
            Posts
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/create" onClick={() => navigate("/create")}>
            Add Post
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default Navbar;
