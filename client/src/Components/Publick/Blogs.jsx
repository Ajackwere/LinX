import React, { useContext, useEffect, useRef, useState } from "react";
import { CONT } from "../../context/AppContext";
import { baseUrl } from "../../../baseUrl";
import { useMutation, useQuery } from "react-query";
import "../../Styles/publick/blogs.css";
import axios from "axios";
import Loader from "../Loader";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

function Blogs({ rr = window.location.search }) {
  const vl = useContext(CONT);
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id");
  const urlQuery = searchParams.get("q");
  const { query } = useParams();

  const blogs = useQuery(
    `blogs_${id ? id : urlQuery ? urlQuery : "blogs"}`,
    async () => {
      const response = await axios.get(
        `${baseUrl}${
          id
            ? "/blogs/posts_by_category/?category_id=" + id
            : urlQuery
            ? "/search/?q=" + urlQuery
            : "/blogs/"
        }`
      );
      return response.data;
    }
  );

  const Comment = ({ commentData }) => {
    const { username, profile, content, likes } = commentData;
    const [likeCount, setLikeCount] = useState(likes);
    return (
      <div className="bc-comment">
        <div className="bc-c-head">
          <div className="bc-c-h-profile">
            <img src={profile} alt="" onError={vl.errorProfileImg} />
          </div>
          <span>{username}</span>
        </div>
        <div className="bc-c-body">
          {content}
          <div className="bc-like">
            <div className="bc-like-up">
              <span
                className="material-symbols-outlined"
                style={{ cursor: "pointer" }}
                onClick={() => setLikeCount((prev) => prev + 1)}
              >
                thumb_up
              </span>{" "}
              <span className="bc-l-count">{likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      <div className="blog-card" key={id}>
        <Link
          className="bc-title"
          to={`/view/blog?id=${id}`}
          style={{ fontSize: "1.3rem", color: "black" }}
        >
          {title}
        </Link>
        <div
          className="blog-content"
          ref={blogContentRef}
          style={isExpanded ? { maxHeight: "none" } : null}
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
            {
              /* showReadMore &&  */ <div
                className="bc-read-more"
                onClick={() => {
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? "read less" : "read more"}
              </div>
            }
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
    <div className="blogs-cnt" style={{ minHeight: "70vh" }}>
      {blogs.data ? (
        blogs.data.length > 0 ? (
          blogs.data.map((blog) => (
            <Blog blogData={blog} key={blog.id + blog.title} />
          ))
        ) : urlQuery ? (
          <div className="blog-card">
            <span className="bc-title">
              We couldn't find any results for <br />"{urlQuery}"
            </span>{" "}
          </div>
        ) : (
          <div className="blog-card">
            <h1>No results found</h1>{" "}
          </div>
        )
      ) : (
        Array(5)
          .fill(2)
          .map((_, index) => (
            <div
              className="blog-card"
              style={{ border: "solid 1px #9a9898" }}
              key={index}
            >
              <span className="load-title skeleton"></span>
              <div className="blog-content">
                {[...Array(4)].map((_, index) => (
                  <p className="load-p skeleton" key={index}></p>
                ))}
              </div>
              <div className="bc-footer" style={{ padding: "0.3rem" }}>
                <div className="bc-footer-actions">
                  <div className="bc-like-load">
                    {[...Array(3)].map((_, index) => (
                      <div className="skeleton" key={index}></div>
                    ))}
                  </div>
                  <div className="bc-comment"></div>
                  <div className="bc-read-more-load skeleton"></div>
                </div>
                <div>
                  <span title="Save" className="material-symbols-outlined">
                    bookmark
                  </span>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default Blogs;
