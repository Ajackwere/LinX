import React, { useContext, useState } from "react";
import DataTable from "../Reusables/Table";
import { useNavigate } from "react-router";
import "../../Styles/Account/post.css";
import { CONT } from "../../context/AppContext";
import { useQuery } from "react-query";
import axios from "axios";
import { baseUrl } from "../../../baseUrl";

function Posts() {
  const [filterBy, setFilterBy] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedData, setCheckedData] = useState([]);
  const navTo = useNavigate(null);
  const vl = useContext(CONT);
  const data = [
    {
      title: "First post",
      body: "",
      author: "Author",
      create_date: "23/4/2024",
      likes: "40",
      dislikes: "4",
    },
  ];
  const blogs = useQuery("blogs", async () => {
    const response = await axios.get(`${baseUrl}/blogs`, {
      headers: {
        Authorization: `Bearer ${vl?.token}`,
      },
    });
    return response.data;
  });
  return (
    <section>
      <br />
      <div className="data-table-cnt acc-crd">
        <div className="data-table-head">
          <div className="table-menu-left">
            <div className="table-data-count">{data.length}</div>

            <div className="table-search-m">
              <span className="material-symbols-outlined">search</span>{" "}
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                name=""
                id=""
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="title">Title</option>
              </select>
            </div>
          </div>
          <div
            className="add-btn"
            onClick={() => {
              vl.setPath((prev) => [
                ...prev,
                { title: "New post", path: "/admin/dashboard/new_post" },
              ]);
              navTo("new_post");
            }}
          >
            <span className="material-symbols-outlined">add</span>
          </div>
        </div>
        <div style={{ position: "relative", height: "55vh" }}>
          <div className="f-finance-table-cnt">
            <DataTable
              data={blogs.data?.map((post) => ({
                title: post?.title,
                author: post?.author?.username,
                publish_date: vl.formatTime(post?.publish_date),
                tags: post?.tags?.map((tag) => tag.name),
              }))}
              filterQuery={searchQuery}
              filterBy={filterBy}
              checker={true}
              checkerState={setCheckedData}
              doubleClick={(id) =>
                navTo(`/account/admin-panel/members/${member_id}`)
              }
              doubleClickData="id"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Posts;
