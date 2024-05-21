import React, { useContext, useEffect, useState } from "react";
import "../../Styles/Account/newpost.css";
import TextEditor from "../Reusables/TextEditor";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { baseUrl } from "../../../baseUrl";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import Loader from "../Loader";
import { CONT } from "../../context/AppContext";
import { debounce, transform } from "lodash";

function EditPost() {
  const vl = useContext(CONT);
  const { id } = useParams();
  const navTo = useNavigate(null);
  const categories = useQuery("categories", async () => {
    const response = await axios.get(`${baseUrl}/categories/`);
    return response.data;
  });
  const [textEditorInit, setTextEditorInit] = useState(
    "Type something here..."
  );

  const [postData, setPostData] = useState({
    category: 1,
    content: null,
    tags: [],
  });

  useEffect(() => {
    const edit = localStorage.getItem("edit");
    if (edit) {
      setPostData(JSON.parse(edit));
      setTextEditorInit(JSON.parse(edit).content);
      toast("You have unpublished edit");
    }
  }, []);

  const tags = useQuery("tags", async () => {
    const response = await axios.get(`${baseUrl}/tags/`);
    return response.data;
  });

  const blog = useQuery(`blog_${id}`, async () => {
    const response = await axios.get(`${baseUrl}/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${vl?.token}`,
      },
    });
    return response.data;
  });

  useEffect(() => {
    console.log(blog.data && !localStorage.getItem("edit"));
    if (blog.data && !localStorage.getItem("edit")) {
      const { content, title, metadata, tags } = blog.data;
      setPostData({
        content,
        title,
        metadata,
        tags,
      });
      setTextEditorInit(content);
    }
  }, [blog.data]);

  const postBlog = useMutation(
    async (data) => {
      const response = await axios.put(`${baseUrl}/blogs/${id}`, data, {
        headers: {
          Authorization: `Session ${vl.userData?.session_id}`,
        },
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.removeItem("edit");
        navTo("/admin/posts");
      },
      onError: (error) => {
        toast(`Failed to update blog, ${error.response.data?.detail}`);
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
    localStorage.setItem("edit", JSON.stringify(postData));
  }, 500);

  useEffect(() => {
    if (postData.content && postData.content !== blog.data?.content) {
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
              maxLength={150}
              value={postData.metadata}
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
          <button
            type="submit"
            style={
              postData.content && postData.content === blog.data?.content
                ? { opacity: "0.4", pointerEvents: "none" }
                : null
            }
          >
            Update
          </button>
        </section>
        <section>
          <TextEditor
            onChange={(data) =>
              setPostData((prev) => ({ ...prev, content: data }))
            }
            initialText={textEditorInit}
          />
        </section>
      </form>
    </div>
  );
}

export default EditPost;
