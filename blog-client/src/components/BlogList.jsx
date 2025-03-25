// src/components/BlogList.jsx
import React, { useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';
import api from '../api';
import { useNavigate } from 'react-router-dom';

import styles from './index.module.css';

const BlogContent = ({ html }) => {
    const clean = sanitizeHtml(html, {
        allowedTags: ['b', 'i', 'em', 'strong', 'p', 'a', 'ul', 'ol', 'li'],
        allowedAttributes: {
          a: ['href'],
        },
      });
    return(<><div dangerouslySetInnerHTML={{ __html: clean }} /></>)
  };

const BlogList = ({ mine = false }) => {
const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    try {
      const res = await api.get(`/blog`, {
        params: {
          page,
          limit : 3,
          mine,
        },
      });

      setBlogs(res.data.data.data);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const openPost = (_id) => {
    navigate(`/blog/${_id}`)
  }

  useEffect(() => {
    fetchBlogs();
  }, [page, mine]);

  return (
    <div className="container mt-4">
      <h2>{mine ? 'My Blog Posts' : 'All Blog Posts'}</h2>
      <div className="list-group">
        {blogs.map((post) => (
          <div key={post._id} className={`list-group-item ${styles['BlogPostList-EachBlock']}`} onClick={()=> {openPost(post._id)}}>
            <h5>{post.title}</h5>
            <BlogContent html={post.body.slice(0, 100)}/>
            <small className="text-muted">Posted on: {new Date(post.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>

      <div className="mt-3 d-flex justify-content-between">
        <button
          className="btn btn-outline-primary"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="btn btn-outline-primary"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;
