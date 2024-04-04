import React, { useContext, useReducer, useRef } from "react";
import { CONT } from "../../context/AppContext";

function Blogs() {
  const vl = useContext(CONT);
  const blogCOntentRef = useRef(null);
  return (
    <div className="blogs-cnt">
      <div className="blog-card">
        <div className="bc-head">
          <div className="bc-profile">
            <img src="" alt="" onError={vl.errorProfileImg} />
          </div>
          <div className="bc-auth-info">
            <span className="bc-a-name">Stoic</span>
            <span className="bc-follow">follow</span>
            <div className="bc-date">21/3/2024</div>
          </div>
        </div>
        <div className="blog-content" ref={blogCOntentRef}>
          <h1>this blog</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            necessitatibus enim animi rem nostrum expedita amet, quo iste, hic
            magnam a omnis dignissimos voluptatem facilis error fugiat harum
            optio sed?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            necessitatibus enim animi rem nostrum expedita amet, quo iste, hic
            magnam a omnis dignissimos voluptatem facilis error fugiat harum
            optio sed?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            necessitatibus enim animi rem nostrum expedita amet, quo iste, hic
            magnam a omnis dignissimos voluptatem facilis error fugiat harum
            optio sed?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            necessitatibus enim animi rem nostrum expedita amet, quo iste, hic
            magnam a omnis dignissimos voluptatem facilis error fugiat harum
            optio sed?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            necessitatibus enim animi rem nostrum expedita amet, quo iste, hic
            magnam a omnis dignissimos voluptatem facilis error fugiat harum
            optio sed?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            necessitatibus enim animi rem nostrum expedita amet, quo iste, hic
            magnam a omnis dignissimos voluptatem facilis error fugiat harum
            optio sed?
          </p>
        </div>
        <div className="bc-footer">
          <div className="bc-like">
            <div className="bc-like-up">
              <span
                className="material-symbols-outlined"
                style={{ cursor: "pointer" }}
              >
                thumb_up
              </span>{" "}
              <span className="bc-l-count">24</span>
            </div>
            <span
              className="material-symbols-outlined"
              style={{ cursor: "pointer" }}
            >
              thumb_down
            </span>
          </div>
          <div className="bc-comment" style={{ cursor: "pointer" }}>
            <span className="material-symbols-outlined">chat_bubble</span>
            <span>8</span>
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
      </div>
    </div>
  );
}

export default Blogs;
