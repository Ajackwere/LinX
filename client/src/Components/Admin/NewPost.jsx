import React, { useContext, useEffect, useState } from "react";
import "../../Styles/Account/newpost.css";
import TextEditor from "../Reusables/TextEditor";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { baseUrl } from "../../../baseUrl";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import Loader from "../Loader";
import Cookies from "js-cookie";
import { debounce, transform } from "lodash";
import { CONT } from "../../context/AppContext";

function NewPost() {
  const vl = useContext(CONT);
  const navTo = useNavigate(null);
  const categories = useQuery("categories", async () => {
    const response = await axios.get(`${baseUrl}/categories/`);
    return response.data;
  });

  const [postData, setPostData] = useState({
    category: "1",
    tags: [],
  });

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
        localStorage.removeItem("draft");
        navTo("/admin/posts");
      },
      onError: (error) => {
        toast(`Failed to post blog, ${error.response.data?.detail}`);
      },
    }
  );
  const handleTagClick = (tagId) => {
    setPostData((prev) => {
      if (prev.tags.includes(tagId)) {
        return { ...prev, tags: prev.tags.filter((n) => n !== tagId) };
      } else {
        return { ...prev, tags: [...prev.tags, tagId] };
      }
    });
  };

  const save = debounce(() => {
    localStorage.setItem("draft", JSON.stringify(postData));
  }, 500);

  useEffect(() => {
    const draft = localStorage.getItem("draft");
    if (draft) {
      setPostData(JSON.parse(draft));
      console.log(JSON.parse(draft));
      toast("You have unposted draft");
    }
  }, []);

  console.log(postData);

  useEffect(() => {
    if (
      postData.content &&
      postData.content !== "<p>Type something here...</p>"
    ) {
      save();
    }
  }, [postData]);
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
          if (postData.tags.length > 0 && postData.metadata) {
            const formData = new FormData(e.target);
            postBlog.mutate({
              ...postData,
              title: formData.get("title"),
              category: formData.get("category"),
              session_id: vl.userData?.session_id,
            });
          } else {
            toast("Tag or metadata is required!");
          }
        }}
      >
        <section className="newpost-head">
          <input
            type="text"
            className="np-title"
            name="title"
            value={postData.title}
            onInput={(e) =>
              setPostData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Title"
            required
          />
          <div className="np-meta-data">
            Meta data
            <textarea
              name="metadata"
              cols="30"
              rows="10"
              onChange={(e) =>
                setPostData((prev) => ({ ...prev, metadata: e.target.value }))
              }
            ></textarea>
          </div>
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
            initialText={postData.content || "<p>Type something here...</p>"}
          />
        </section>
      </form>
    </div>
  );
}

export default NewPost;
