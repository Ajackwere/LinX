import React from "react";
import "../../Styles/Account/dashboard.css";
import SimpleLineChart from "../Reusables/LineChart";
import SimpleBChart from "../Reusables/BarChart";

function DashBoard() {
  const topSectionCards = [
    {
      icon: "person",
      title: "Signed users",
      count: 500,
    },
    {
      icon: "groups",
      title: "Todays users",
      count: 100,
    },
    {
      icon: "post",
      title: "Posts",
      count: 173,
    },
    {
      icon: "assignment_ind",
      title: "Authors",
      count: 15,
    },
  ];

  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const trafficChartLabels = [
    "Jan",
    "Feb",
    "Mat",
    "Apri",
    "May",
    "June",
    "July",
    "Aug",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trafficChartData = [
    { data: pData, label: "Signed" },
    { data: uData, label: "Not signed" },
  ];

  const salesData = [{ data: pData, label: "Revenue", id: "pvId" }];

  return (
    <div>
      <section className="dash-top-sections">
        {topSectionCards.map((card) => (
          <div className="sts-card">
            <div>
              <div className="dst-title">{card.title}</div>
              <div className="dst-count">{card.count}</div>
            </div>
            <div className="dst-icon">
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
          </div>
        ))}
      </section>
      <section className="c-trends">
        <div className="traffic">
          <div className="traffic-head">
            <div className="select-card">
              <h1>Traffic history</h1>
              <select>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <h2>
              Active now <strong>56</strong>
            </h2>
          </div>
          <div className="traffic-chart-cnt">
            <SimpleLineChart
              data={trafficChartData}
              labels={trafficChartLabels}
            />
          </div>
        </div>
        <div className="ads-overview">
          <div className="ads-head">
            <h1>AD's activity</h1>
          </div>
          <div className="ads-overview-cnt">
            <ul className="ads-trakings">
              <li>
                <div className="adt-title">
                  <span className="material-symbols-outlined">ad</span> Total
                  Ad's
                </div>
                <div className="adt-count">37</div>
              </li>
              <li>
                <div className="adt-title">
                  <span className="material-symbols-outlined">ads_click</span>{" "}
                  Total Clicks
                </div>
                <div className="adt-count">37,000</div>
              </li>
              <li>
                <div className="adt-title">
                  <span className="material-symbols-outlined">payments</span>{" "}
                  Total Revenue
                </div>
                <div className="adt-count">37</div>
              </li>
            </ul>
            <div style={{ height: "300px", width: "100%" }}>
              <SimpleBChart data={salesData} labels={trafficChartLabels} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashBoard;
