// src/pages/Blogs.jsx
import React, { useState } from "react";
import BlogList from "../components/BlogList";
import Navbar from "../components/Navbar";
import { ButtonGroup, Button, Container } from "react-bootstrap";

const Blogs = () => {
  const [showMine, setShowMine] = useState(false);

  return (
    <>
      <Navbar />
      <Container>
        <div className="container align-items-center mt-8"
          style={{textAlign: "center"}}>
          <h1>📝 Blog Feed</h1>
        </div>

        <div className="d-flex justify-content-center my-3">
          <ButtonGroup>
            <Button
              variant={!showMine ? "primary" : "outline-primary"}
              onClick={() => setShowMine(false)}
            >
              All Posts
            </Button>
            <Button
              variant={showMine ? "primary" : "outline-primary"}
              onClick={() => setShowMine(true)}
            >
              My Posts
            </Button>
          </ButtonGroup>
        </div>

        <BlogList mine={showMine} />
      </Container>
    </>
  );
};

export default Blogs;
