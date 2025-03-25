import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import sanitizeHtml from "sanitize-html";
import { Container, Spinner } from "react-bootstrap";
import Navbar from "./Navbar";

import styles from "./index.module.css";

const BlogContent = ({ html }) => {
  const clean = sanitizeHtml(html, {
    allowedTags: ["b", "i", "em", "strong", "p", "a", "ul", "ol", "li"],
    allowedAttributes: {
      a: ["href"],
    },
  });
  return (
    <>
      <div
        className={`${styles["BlogContent"]}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </>
  );
};

const BlogPost = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/${id}`);
        if (res.data) {
          setPost(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (!post) return;
      try {
        if (post.imageUrl) {
          const res = await api.get("/blog/signed-url/download", {
            params: {
              imageUrl: post.imageUrl,
            },
          });
          if (res.status === 200) {
            console.log(res);
            setImageUrl(res.data.data.presignedUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImageUrl();
  }, [post]);

  if (loading) return <Spinner animation="border" className="m-4" />;

  if (!post) return <Container className="mt-4">Post not found.</Container>;

  return (
    <>
      <Navbar />
      <Container className="mt-4 d-flex justify-content-start">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(-1)} // 👈 Go back to previous page
        >
          ← Back
        </button>
      </Container>

      <Container
        className={`mt-4 d-flex justify-content-center ${styles["Blog"]}`}
      >
        <div className="px-3 px-md-5 py-3 w-100" style={{ maxWidth: "800px" }}>
          <h2 className={`text-center mb-4 ${styles["BlogTitle"]}`}>
            {post.title}
          </h2>

          <div
            className="text-center mb-4"
            style={{ minHeight: "400px", objectFit: "cover" }}
          >
            <img
              src={imageUrl}
              alt={post.title}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>

          <BlogContent html={post.body} />
        </div>
      </Container>
    </>
  );
};

export default BlogPost;
