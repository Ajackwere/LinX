import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { baseUrl } from "../../baseUrl";
import { useQuery } from "react-query";

function StateCheker() {
  const navigate = useNavigate();
  const [maintain, setMaintain] = useState(false);

  /*   const isMaintaining = useQuery(
    "maintaining",
    async () => {
      const response = await fetch(baseUrl);
      if (!response.ok) {
        const errorData = await response.json();
        if (
          response.status === 503 &&
          errorData.message === "Site under maintenance"
        ) {
          setMaintain(true);
        }
        throw new Error(errorData.message || "Unknown error occurred");
      }
      return response.json();
    },
    {
      refetchInterval: 300000, // Refetch data every 300 seconds (5 minutes)
      refetchIntervalInBackground: true, // Allow refetching even when the component is not visible
    }
  ); */

  const tryi = async () => {
    const response = await fetch(baseUrl);
    console.log("Response code:", response.status); // Log the response code here

    if (!response.ok) {
      const errorData = await response.json();
      if (
        response.status === 503 &&
        errorData.message === "Site under maintenance"
      ) {
        setMaintain(true);
      }
      throw new Error(errorData.message || "Unknown error occurred");
    }
    return response.json();
  };

  useEffect(() => {
    if (maintain) {
      navigate("/404");
    }
  }, [maintain, navigate]);

  return <Outlet />;
}

export default StateCheker;
