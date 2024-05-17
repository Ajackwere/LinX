import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { baseUrl } from "../../baseUrl";
import { useQuery } from "react-query";
import axios from "axios";

function StateCheker() {
  const [maintaining, setMaintaining] = useState(false);

  const isMaintaining = useQuery(
    "maintaining",
    async () => {
      const response = await axios.get(baseUrl);
      return response.data;
    },
    {
      refetchInterval: 300000, // Refetch data every 10 seconds (in milliseconds)
      refetchIntervalInBackground: true, // Allow refetching even when the component is not visible
    }
  );
  const navTo = useNavigate(null);
  useEffect(() => {
    if (isMaintaining.data?.message === "Site under maintenance") {
      setMaintaining(true);
    }
  }, [isMaintaining]);

  if (maintaining) {
    navTo("/maintainance");
  }

  const fetchFolders = async () => {
    console.log("rfbdv");
    try {
      const response = await axios.get(`${baseUrl}`);
      console.log(response.data);
    } catch (error) {
      setMaintaining(true);
      console.log("Error fetching data:", error.data);
    }
  };
  fetchFolders();

  return <Outlet />;
}

export default StateCheker;
