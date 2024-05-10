import React, { useContext, useState } from "react";
import "../../Styles/Account/newpost.css";
import TextEditor from "../Reusables/TextEditor";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { baseUrl } from "../../../baseUrl";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import Loader from "../Loader";
import Cookies from "js-cookie";
import { CONT } from "../../context/AppContext";

function NewPost() {
  const vl = useContext(CONT);
  const navTo = useNavigate(null);
  const categories = useQuery("categories", async () => {
    const response = await axios.get(`${baseUrl}/categories/`);
    return response.data;
  });

  const [postData, setPostData] = useState({
    category: 1,
    tags: [],
  });
  /* ${Cookies.get("sessionid")} */
  const tags = useQuery("tags", async () => {
    const response = await axios.get(`${baseUrl}/tags/`);
    return response.data;
  });
  const postBlog = useMutation(
    async (data) => {
      const response = await axios.post(`${baseUrl}/blogs/`, data, {
        headers: {
          Authorization: `Session ${vl.userData?.session_id}`,
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        navTo("/admin/posts");
      },
      onError: (error) => {
        toast(`Failed to post blog, ${error.response.data?.detail}`);
      },
    }
  );
  console.log(`Session ${vl.userData?.session_id}`);
  const handleTagClick = (tagId) => {
    setPostData((prev) => {
      if (prev.tags.includes(tagId)) {
        return { ...prev, tags: prev.tags.filter((n) => n !== tagId) };
      } else {
        return { ...prev, tags: [...prev.tags, tagId] };
      }
    });
  };
  return (
    <div>
      <ToastContainer autoClose={5000} hideProgressBar theme={"light"} />
      {postBlog.isLoading && (
        <div className="np-loader">
          <Loader />
        </div>
      )}
      <form
        style={postBlog.isLoading ? { opacity: "0.3" } : null}
        onSubmit={(e) => {
          e.preventDefault();
          if (postData.tags.length > 0) {
            const formData = new FormData(e.target);
            postBlog.mutate({
              ...postData,
              title: formData.get("title"),
              category: formData.get("category"),
            });
          } else {
            toast("Tag is required!");
          }
        }}
      >
        <section className="newpost-head">
          <input
            type="text"
            className="np-title"
            name="title"
            placeholder="Title"
            required
          />
          <div className="np-tags">
            Tags
            <span className="material-symbols-outlined">expand_more</span>
            <ul>
              {Array.isArray(tags.data) &&
                tags.data.map((tag) => (
                  <li
                    key={tag.id + tag.name}
                    title={tag.name}
                    onClick={() => handleTagClick(tag.id)}
                  >
                    <input
                      type="checkbox"
                      checked={postData.tags.includes(tag.id)}
                      readOnly
                    />
                    <span>{tag.name}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="select-card">
            <span>Category</span>{" "}
            <select
              name="category"
              value={postData.category}
              onInput={(e) =>
                setPostData((prev) => ({ ...prev, category: e.target.value }))
              }
              id=""
            >
              {Array.isArray(categories.data) &&
                categories.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <button type="submit">POST</button>
        </section>
        <section>
          <TextEditor
            onChange={(data) =>
              setPostData((prev) => ({ ...prev, content: data }))
            }
          />
        </section>
      </form>
    </div>
  );
}

export default NewPost;
