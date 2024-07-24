"use client";

import NavBar from "@/components/navbar";
import React from "react";
import DashboardContent from "./components/content/content";
import "./dashboard.scss";
import withAuth from "@/components/auth";

const Dashboard: React.FC<{}> = () => {
  return (
    <div className="dashboard">
      <NavBar />
      <DashboardContent />
    </div>
  );
};

const DashboardWithAuth = withAuth(Dashboard);

export default DashboardWithAuth;
