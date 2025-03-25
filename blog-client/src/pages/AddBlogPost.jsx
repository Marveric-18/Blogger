import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import RichTextInput from "../components/RichTextInput";
import Navbar from "../components/Navbar";
import api from "../api";

const AddBlogPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [signedUrl, setSignedUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      
      if(file && signedUrl){
        const res = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if(res.status !== 200){
          alert("Something went wrong while uploaing file");
        }
        imageUrl = res.url;
      }

      const response = await api.post("/blog/", {
        title: title,
        body: value,
        imageUrl: imageUrl || null
      });
      if (response.status === 200) {
        alert("Post created successfully!");
        setTitle("");
        setContent("");
        setValue("");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post.");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file || !file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
  
    const res = await api.get("/blog/signed-url", {
      params: {
        fileName: file.name,
        fileType: file.type,
      },
    });

    if(res.status !== 200){
      alert("Something went wrong while uploading the file");
      setFile(null);
    }

    if(!res.data?.data.presignedUrl){
      alert("Something went wrong while uploading the file");
      setFile(null);
    }

    setSignedUrl(res.data?.data.presignedUrl);
    setFile(file);
  }

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2>Create New Post</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <RichTextInput
              value={value}
              setContent={setContent}
              setValue={setValue}
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Submit Post
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default AddBlogPost;
