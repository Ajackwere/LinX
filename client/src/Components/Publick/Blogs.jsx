import React, { useContext, useReducer, useRef, useState } from "react";
import { CONT } from "../../context/AppContext";
import { baseUrl } from "../../../baseUrl";
import { useQuery } from "react-query";
import axios from "axios";

function Blogs() {
  const vl = useContext(CONT);
  const blogCOntentRef = useRef(null);
  /*   const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "first blog",
      blog_content:
        "<h1>this blog</h1><p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore necessitatibus enim animi rem nostrum expedita amet, quo iste, hic magnam a omnis dignissimos voluptatem facilis error fugiat harum  optio sed?</p> <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore  necessitatibus enim animi rem nostrum expedita amet, quo iste, hic magnam a omnis dignissimos voluptatem facilis error fugiat harum </p>",
      comments: [
        {
          id: 1,
          username: "commentor name",
          profile: "",
          liked: false,
          dis_liked: false,
          likes: 24,
          comment:
            "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis sunt a amet, labore velit est iusto maxime. Temporibus minus, in numquam non ex facere, esse eius, repellendus rem dolores fuga!",
        },
      ],
      likes: 24,
      liked: false,
      dis_liked: false,
      saved: false,
    },
  ]); */

  const blogs = useQuery("blogs", async () => {
    const response = await axios.get(`${baseUrl}/blogs`, {
      headers: {
        Authorization: `Bearer ${vl.token}`,
      },
    });
    return response.data;
  });

  const Comment = ({ commentData }) => {
    const { username, profile, comment, liked, dis_liked, likes } = commentData;
    const [isLiked, setIsLiked] = useState({ liked, dis_liked });
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
          {comment}
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
          </div>
        </div>
      </div>
    );
  };

  const Blog = ({ blogData }) => {
    const { title, blog_content, id, liked, dis_liked, likes } = blogData;
    const [comments, setComments] = useState(blogData.comments);
    const [isLiked, setIsLiked] = useState({ liked, dis_liked });
    const [commenting, setCommenting] = useState({ open: false, comment: "" });
    const [liekCount, setLikeCount] = useState(likes);
    const [saved, setSaved] = useState(blogData.saved);
    return (
      <div className="blog-card">
        <span className="bc-title">{title}</span>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog_content }}
        ></div>
        <div className="bc-footer">
          <div className="bc-footer-actions">
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
            </div>
            <div
              className="bc-comment"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setCommenting((prev) => ({ ...prev, open: !commenting.open }))
              }
            >
              <span className="material-symbols-outlined">chat_bubble</span>
              <span>{comments.length}</span>
            </div>
            <div
              className="bc-read-more"
              onClick={() => {
                const isRef = blogCOntentRef.current;
                if (isRef && isRef.scrollWidth > isRef.clientWidth) {
                  isRef.style.maxHeight = "100%";
                }
              }}
            >
              read more
            </div>
          </div>
          <div className={saved ? "bc-liked" : ""}>
            <span
              title="Save"
              className="material-symbols-outlined"
              style={{ cursor: "pointer", fontSize: "1.5rem" }}
              onClick={() => setSaved((prev) => !prev)}
            >
              bookmark
            </span>
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
              {comments.map((comment) => (
                <Comment
                  commentData={comment}
                  key={comment.username + comment.id}
                />
              ))}
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
                <div className="bc-footer">
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
