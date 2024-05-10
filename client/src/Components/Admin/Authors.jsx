import React, { useContext, useState } from "react";
import DataTable from "../Reusables/Table";
import { useNavigate } from "react-router";
import "../../Styles/Account/post.css";
import { CONT } from "../../context/AppContext";
import { useQuery } from "react-query";
import axios from "axios";
import { baseUrl } from "../../../baseUrl";

function Posts() {
  const [filterBy, setFilterBy] = useState("first_name");
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
  const authors = useQuery("totaAuthors", async () => {
    const response = await axios.get(baseUrl + "/list-of-authors/");
    return response.data;
  });
  console.log(authors.data);

  return (
    <section>
      <br />
      <div className="data-table-cnt acc-crd">
        <div className="data-table-head">
          <div className="table-menu-left">
            <div className="table-data-count">{authors.data?.length}</div>

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
                <option value="first_name">First name</option>
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
        <div style={{ position: "relative", height: "55vh", overflow: "auto" }}>
          <div className="f-finance-table-cnt">
            <DataTable
              data={Array.isArray(authors.data) && authors.data}
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
