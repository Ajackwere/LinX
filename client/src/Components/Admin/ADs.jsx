import React, { useContext, useState } from "react";
import "../../Styles/Account/ads.css";
import DataTable from "../Reusables/Table";
import { useNavigate } from "react-router";
import { CONT } from "../../context/AppContext";

function ADs() {
  const [filterBy, setFilterBy] = useState("company");
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedData, setCheckedData] = useState([]);
  const navTo = useNavigate(null);
  const vl = useContext(CONT);
  const data = [
    {
      company: "AD company",
      from: "20/4/2024",
      to: "2/5/2024",
      budget: "30,000",
      clicks: "50",
    },
  ];
  const sfsf = {
    first_name: "frist",
    second_name: "second",
    email: "authoremail@gmail.com",
    blogs: 28,
    total_likes: 1200,
  };
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
                { title: "New AD", path: "/admin/ADs/new_ad" },
              ]);
              navTo("new_ad");
            }}
          >
            <span className="material-symbols-outlined">add</span>
          </div>
        </div>
        <div style={{ position: "relative", height: "55vh", overflow: "auto" }}>
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

export default ADs;
