import React, { useContext, useState } from "react";
import "../../Styles/Account/ads.css";
import "../../Styles/Account/authors.css";
import DataTable from "../Reusables/Table";
import { useNavigate } from "react-router";
import { CONT } from "../../context/AppContext";

function Authors() {
  const [filterBy, setFilterBy] = useState("first_name");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedData, setCheckedData] = useState([]);
  const [addAuthor, setAddAuthor] = useState(false);
  const navTo = useNavigate(null);
  const vl = useContext(CONT);
  const data = [
    {
      first_name: "frist",
      second_name: "second",
      email: "authoremail@gmail.com",
      blogs: 28,
      total_likes: 1200,
    },
  ];

  return (
    <section>
      {addAuthor && (
        <div className="addAuthor-cnt">
          <form
            className="add-author"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <span
              className="material-symbols-outlined"
              onClick={() => setAddAuthor(false)}
            >
              close
            </span>
            <h1>Add author</h1>
            <input type="text" name="first_name" placeholder="Frist name" />
            <input type="text" name="second_name" placeholder="Second name" />
            <input type="email" name="email" placeholder="email" />
            <input type="text" name="password" placeholder="password" />
            <div className="add-author-footer">
              <button>Add</button>
            </div>
          </form>
        </div>
      )}
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
              setAddAuthor(true);
            }}
          >
            <span className="material-symbols-outlined">add</span>
          </div>
        </div>
        <div style={{ position: "relative", height: "55vh" }}>
          <div className="f-finance-table-cnt">
            <DataTable
              data={data}
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

export default Authors;
