import React, { useContext, useEffect, useRef, useState } from "react";
import "../../Styles/publick/blogview.css";
import "../../Styles/publick/blogs.css";

import { useParams } from "react-router";
import { useMutation, useQuery } from "react-query";
import { baseUrl } from "../../../baseUrl";
import axios from "axios";
import Nav from "./Nav";
import Footer from "./Footer";
import { CONT } from "../../context/AppContext";
import { Helmet } from "react-helmet";
import Loader from "../Loader";

function BlogView() {
  const vl = useContext(CONT);
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const urlQuery = searchParams.get("q");

  const blog = useQuery(`blog_${id}`, async () => {
    const response = await axios.get(`${baseUrl}/blogs/${id}`);
    return response.data;
  });

  const Blog = ({ blogData }) => {
    const {
      title,
      content,
      id,
      likes,
      comments_count = 0,
      author_details,
      publish_date,
    } = blogData;
    const [comments, setComments] = useState(blogData.comments);
    const [commentCount, setCommentCount] = useState(comments_count);
    const [commenting, setCommenting] = useState({ open: false, comment: "" });
    const [saved, setSaved] = useState(blogData.saved);
    const [isExpanded, setIsExpanded] = useState(false);
    const blogContentRef = useRef(null);
    useEffect(() => {
      const handleResize = () => {
        setShowReadMore(checkOverflow());
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, [blogContentRef.current]);

    const checkOverflow = () => {
      if (blogContentRef.current) {
        const contentElement = blogContentRef.current;
        return contentElement.clientHeight < contentElement.scrollHeight;
      }
      return false;
    };

    const [showReadMore, setShowReadMore] = useState(checkOverflow());

    const getComments = useMutation(
      async () => {
        const response = await axios.get(`${baseUrl}/comments/?blog=${id}`);
        return response.data;
      },
      {
        onSuccess: (data) => {
          setComments(data);
        },
        onError: (error) => {
          console.error(`Error fetching comments, ${error}`);
        },
      }
    );

    const postComment = useMutation(
      async (data) => {
        const response = await axios.post(`${baseUrl}/comments/`, data);
        return response.data;
      },
      {
        onSuccess: (data) => {},
        onError: (error) => {
          console.error(`Error fetching comments, ${error}`);
          setComments((prev) => prev.pop());
          setCommentCount((prev) => prev - 1);
        },
      }
    );

    useEffect(() => {
      if (commenting.open) {
        getComments.mutate(id);
      }
    }, [commenting.open]);

    return (
      <div className="blog-card" style={{ maxWidth: "800px" }}>
        <span
          className="bc-title"
          to={`/view/blog?id=${id}`}
          style={{ fontSize: "1.3rem", color: "black" }}
        >
          {title}
        </span>
        <div
          className="blog-content"
          ref={blogContentRef}
          style={{ maxHeight: "none" }}
        >
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
          <div>
            <small style={{ display: "flex", gap: "0.5rem" }}>
              <div className="auth-profile">
                <img src={author_details?.profile_picture} alt="" />
              </div>
              <i>
                Published by {author_details?.first_name}{" "}
                {author_details?.last_name} <br /> on{" "}
                {vl.formatTime(publish_date)}
              </i>{" "}
            </small>
          </div>
        </div>

        <div className="bc-footer">
          <div className="bc-footer-actions">
            {/* <div
              className="bc-comment"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setCommenting((prev) => ({ ...prev, open: !commenting.open }))
              }
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              <span>{commentCount}</span>
            </div> */}
          </div>
        </div>
        <div className={saved ? "bc-liked" : ""}></div>
        {commenting.open && (
          <div className="bc-comment-s">
            <form
              className="bc-write-comment"
              onSubmit={(e) => {
                e.preventDefault();
                setComments((prev) => [
                  ...prev,
                  {
                    content: commenting.comment,
                    person: 1,
                    likes: 0,
                    dislikes: 0,
                    blog: id,
                  },
                ]);
                postComment.mutate({
                  content: commenting.comment,
                  person: 1,
                  blog: id,
                });
                setCommenting((prev) => ({ ...prev, comment: "" }));
                setCommentCount((prev) => prev + 1);
              }}
            >
              <div className="bc-c-profile">
                <img src="" alt="" onError={vl.errorProfileImg} />
              </div>
              <textarea
                name=""
                id=""
                cols="30"
                rows="3"
                required
                value={commenting.comment}
                placeholder="Add comment..."
                onChange={(e) =>
                  setCommenting((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
              ></textarea>
              <button>
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
            <div className="bc-comments" style={{ padding: "1rem" }}>
              {comments?.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    commentData={comment}
                    key={comment.username + comment.id}
                  />
                ))
              ) : (
                <div className="center-loader">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Helmet>
        {/* <title>{blog.data?.title}</title>{" "} */}
        {/* Redundant with useEffect, but optional to keep title in sync */}
        <meta name="description" content={blog.data?.description} />
        <meta property="og:url" content={`https://www.linx-ea.com`} />
        <meta property="og:title" content={blog.data?.title} />
        <meta property="og:description" content={blog.data?.metadata} />
        <meta property="og:image" content={blog.data?.image} />
        <meta property="og:type" content="article" />
        {/* Add additional OG meta tags as needed */}
      </Helmet>
      <Nav />
      {blog.data ? (
        <Blog blogData={blog.data} />
      ) : (
        Array(1)
          .fill(2)
          .map((_, index) => (
            <div
              className="blog-card"
              style={{ border: "solid 1px #9a9898", height: "70vh" }}
              key={index}
            >
              <span className="load-title skeleton"></span>
              <div className="blog-content">
                {[...Array(6)].map((_, index) => (
                  <p className="load-p skeleton" key={index}></p>
                ))}
              </div>
            </div>
          ))
      )}
      <Footer />
    </div>
  );
}

export default BlogView;
