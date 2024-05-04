import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { CONT } from "../../context/AppContext";
import { baseUrl } from "../../../baseUrl";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import Loader from "../Loader";

function Blogs() {
  const vl = useContext(CONT);
  const blogCOntentRef = useRef(null);

  const blogs = useQuery("blogs", async () => {
    const response = await axios.get(`${baseUrl}/blogs`, {
      headers: {
        Authorization: `Bearer ${vl.token}`,
      },
    });
    return response.data;
  });

  const Comment = ({ commentData }) => {
    const { username, profile, content, liked, dislikes, likes } = commentData;
    const [isLiked, setIsLiked] = useState({ liked, dislikes });
    const [commenting, setCommenting] = useState({ open: false, comment: "" });
    const [liekCount, setLikeCount] = useState(likes);
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
            <div
              className={isLiked.liked ? "bc-like-up bc-liked" : "bc-like-up"}
            >
              <span
                className="material-symbols-outlined"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  isLiked.liked
                    ? setLikeCount((prev) => prev - 1)
                    : setLikeCount((prev) => prev + 1),
                    setIsLiked({
                      dislikes: isLiked.dislikes
                        ? !isLiked.dislikes
                        : isLiked.dislikes,
                      liked: !isLiked.liked,
                    });
                }}
              >
                thumb_up
              </span>{" "}
              <span className="bc-l-count">{liekCount}</span>
            </div>
            <div className={isLiked.dislikes ? "bc-liked" : ""}>
              <span
                className="material-symbols-outlined"
                onClick={() => {
                  isLiked.liked ? setLikeCount((prev) => prev - 1) : null,
                    setIsLiked({
                      liked: isLiked.liked ? !isLiked.liked : isLiked.liked,
                      dislikes: !isLiked.dislikes,
                    });
                }}
                style={{ cursor: "pointer" }}
              >
                thumb_down
              </span>
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
      liked,
      dis_liked,
      likes,
      comments_count = 0,
    } = blogData;
    const [comments, setComments] = useState(blogData.comments);
    const [isLiked, setIsLiked] = useState({ liked, dis_liked });
    const [commenting, setCommenting] = useState({ open: false, comment: "" });
    const [liekCount, setLikeCount] = useState(likes);
    const [saved, setSaved] = useState(blogData.saved);
    const contentHeight = useRef(0);
    const checkOverflow = () => {
      if (blogCOntentRef.current) {
        const contentElement = blogCOntentRef.current;
        contentHeight.current = contentElement.scrollHeight;
        return contentElement.clientHeight < contentElement.scrollHeight;
      }
      return false; // Assume no overflow initially
    };
    const [showReadMore, setShowReadMore] = useState(checkOverflow());
    useEffect(() => {
      const handleResize = () => {
        setShowReadMore(checkOverflow());
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getComments = useMutation(
      async (isExpanded) => {
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

    useEffect(() => {
      if (commenting.open) {
        getComments.mutate(id);
      }
    }, [commenting]);

    return (
      <div className="blog-card" key={id}>
        <span className="bc-title">{title}</span>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <div className="bc-footer">
          <div className="bc-footer-actions">
            {/* <div className="bc-like">
              <div
                className={isLiked.liked ? "bc-like-up bc-liked" : "bc-like-up"}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    isLiked.liked
                      ? setLikeCount((prev) => prev - 1)
                      : setLikeCount((prev) => prev + 1),
                      setIsLiked({
                        dis_liked: isLiked.dis_liked
                          ? !isLiked.dis_liked
                          : isLiked.dis_liked,
                        liked: !isLiked.liked,
                      });
                  }}
                >
                  thumb_up
                </span>{" "}
                <span className="bc-l-count">{liekCount}</span>
              </div>
              <div className={isLiked.dis_liked ? "bc-liked" : ""}>
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    isLiked.liked ? setLikeCount((prev) => prev - 1) : null,
                      setIsLiked({
                        liked: isLiked.liked ? !isLiked.liked : isLiked.liked,
                        dis_liked: !isLiked.dis_liked,
                      });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  thumb_down
                </span>
              </div>
            </div> */}
            <div
              className="bc-comment"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setCommenting((prev) => ({ ...prev, open: !commenting.open }))
              }
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              <span>{comments_count}</span>
            </div>
            {showReadMore && ( // Only render button if content overflows
              <div className="bc-footer">
                {/* ... rest of the blog footer elements ... */}
                <div
                  className="bc-read-more"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "read less" : "read more"}
                </div>
                {/* ... rest of the blog footer elements ... */}
              </div>
            )}
          </div>
          <div className={saved ? "bc-liked" : ""}>
            {/* <span
              title="Save"
              className="material-symbols-outlined"
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
              onClick={() => setSaved((prev) => !prev)}
            >
              bookmark
            </span> */}
          </div>
        </div>
        {commenting.open && (
          <div className="bc-comment-s">
            <form
              className="bc-write-comment"
              onSubmit={(e) => {
                e.preventDefault();
                setComments((prev) => [
                  ...prev,
                  {
                    id: Math.random() / 100,
                    username: "commentor name",
                    liked: false,
                    dis_liked: false,
                    likes: 24,
                    profile: "",
                    comment: commenting.comment,
                  },
                ]);
                setCommenting((prev) => ({ ...prev, comment: "" }));
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
                onChange={(e) => {
                  setCommenting((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }));
                }}
              ></textarea>
              <button>
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
            <div className="bc-comments">
              {comments?.length > 0
                ? comments.map((comment) => (
                    <Comment
                      commentData={comment}
                      key={comment.username + comment.id}
                    />
                  ))
                : getComments.isLoading && (
                    <div className="center-loader">
                      <Loader />
                    </div>
                  )}
            </div>
          </div>
        )}{" "}
      </div>
    );
  };

  return (
    <div className="blogs-cnt">
      {blogs.data
        ? blogs.data.map((blog) => {
            return <Blog blogData={blog} key={blog.id + blog.title} />;
          })
        : Array(5)
            .fill(2)
            .map(() => (
              <div
                className="blog-card"
                style={{ border: "solid 1px #9a9898" }}
              >
                <span className="load-title skeleton"></span>
                <div className="blog-content">
                  <p className="load-p skeleton"></p>
                  <p className="load-p skeleton"></p>
                  <p className="load-p skeleton"></p>
                  <p className="load-p skeleton"></p>
                </div>
                <div className="bc-footer" style={{ padding: "0.3rem" }}>
                  <div className="bc-footer-actions">
                    <div className="bc-like-load">
                      <div className="skeleton"></div>
                      <div className="skeleton"></div>
                      <div className="skeleton"></div>
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
            ))}
    </div>
  );
}

export default Blogs;
