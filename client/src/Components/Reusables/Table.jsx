import React, { useContext, useState } from "react";
import { CONT } from "../../context/AppContext";

function DataTable({
  data,
  filterQuery = "",
  filterBy = null,
  checker = false,
  checkerState = null,
  openMenu = null,
  doubleClick = null,
  doubleClickData = "id",
}) {
  const [checkedData, setCheckedData] = useState([]);
  const [rowState, setRowState] = useState(
    Array(data?.length).fill({ checked: false, pined: false, menu: false })
  );

  const filteredData = filterBy
    ? data?.filter((row) =>
        row[filterBy]
          .toLocaleLowerCase()
          .includes(filterQuery.toLocaleLowerCase())
      )
    : data;
  const vl = useContext(CONT);
  if (data === undefined) {
    return (
      <>
        <br />
        <center>Loading...</center>
      </>
    );
  }
  if (data.length === 0) {
    return (
      <>
        <br />
        <center>No available data!</center>
      </>
    );
  }
  const headers = Object.keys(data[0]);
  if (checker === true && checkerState === null) {
    alert(
      "checkerState  is required when checker is true on the DataTable component!"
    );
  }
  const pined = (i) =>
    rowState[i]?.pined
      ? {
          position: "sticky",
          top: "4rem",
          zIndex: "5",
          backgroundColor: "var(--color3)",
          color: "white",
        }
      : { color: "" };

  return (
    <table>
      <thead>
        <tr>
          {checker && (
            <th>
              <input
                type="checkbox"
                checked={checkedData?.length === filteredData?.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    checkerState(filteredData);
                    setCheckedData(filteredData);
                    setRowState(
                      Array(data?.length).fill({ checked: true, pined: false })
                    );
                  } else {
                    checkerState([]);
                    setCheckedData([]);
                    setRowState(
                      Array(data?.length).fill({ checked: false, pined: false })
                    );
                  }
                }}
              />
            </th>
          )}
          {headers.map((header) => {
            if (header !== "id")
              return (
                <th key={header}>
                  {header.replace("_", " ").slice(0, 1).toUpperCase() +
                    header.replace("_", " ").slice(1)}
                </th>
              );
          })}
        </tr>
      </thead>
      <tbody>
        {filteredData.map((row, i) => (
          <tr
            key={row.id + "tr"}
            onContextMenu={(e) => {
              e.preventDefault();
              openMenu(row, e);
            }}
            onDoubleClick={() =>
              doubleClick !== null && doubleClick(row[doubleClickData])
            }
          >
            {checker && (
              <td style={pined(i)}>
                <span
                  className="material-symbols-outlined row-pin"
                  style={
                    rowState[i]?.pined
                      ? { display: "block", color: "white" }
                      : null
                  }
                  onClick={() =>
                    setRowState((prev) =>
                      prev.map((item, index) =>
                        index === i
                          ? {
                              checked: rowState[i]?.checked,
                              pined: !rowState[i]?.pined,
                            }
                          : item
                      )
                    )
                  }
                >
                  push_pin
                </span>
                <input
                  type="checkbox"
                  checked={rowState[i]?.checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkerState((prev) => [...prev, row]);
                      setCheckedData((prev) => [...prev, row]);
                      setRowState((prev) =>
                        prev.map((item, index) =>
                          index === i
                            ? { checked: true, pined: rowState[i].pined }
                            : item
                        )
                      );
                    } else {
                      checkerState((prev) =>
                        prev.filter((item) => item.id !== row.id)
                      );
                      setCheckedData((prev) =>
                        prev.filter((item) => item.id !== row.id)
                      );
                      setRowState((prev) =>
                        prev.map((item, index) =>
                          index === i
                            ? { checked: false, pined: rowState[i].pined }
                            : item
                        )
                      );
                    }
                  }}
                />
                {row?.status === "blocked" && (
                  <span className="material-symbols-outlined row-mamber-blocked">
                    block
                  </span>
                )}
              </td>
            )}
            {headers.map((header) => {
              if (header === "profile") {
                return (
                  <td key={header} style={pined(i)}>
                    <div className="td-profile">
                      <img src={row[header]} alt="profile" />
                    </div>
                  </td>
                );
              } else if (header === "logo") {
                return (
                  <td key={header} style={pined(i)}>
                    <div className="td-logo">
                      <img src={row[header]} alt="profile" />
                    </div>
                  </td>
                );
              } else if (header === "id") {
                return null;
              } else if (header === "date_of_birth") {
                return (
                  <td>
                    {row[header] !== "" ? vl.convertDate(row[header]) : "-"}
                  </td>
                );
              } else if (header === "date_paid" && row[header] === "") {
                return (
                  <td key={header} style={pined(i)}>
                    <div
                      className="saf-pay-btn"
                      onClick={() =>
                        vl.setMpesaPopOpen({ open: true, amount: row.amount })
                      }
                    >
                      pay
                    </div>
                  </td>
                );
              } else if (
                row[header] === "" ||
                row[header] === undefined ||
                row[header] === null
              ) {
                return (
                  <td key={header} style={pined(i)}>
                    -
                  </td>
                );
              } else if (row[header] === true || row[header] === false) {
                return (
                  <td key={header} style={pined(i)}>
                    {row[header] ? "Yes" : "No"}
                  </td>
                );
              } else {
                return (
                  <td key={header} style={pined(i)}>
                    {row[header]}
                  </td>
                );
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
