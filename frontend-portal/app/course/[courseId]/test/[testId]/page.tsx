"use client";

import NavBar from "@/components/navbar";
import TestPageContent from "./components/content/content";
import "./test.scss";
import withAuth from "@/components/auth";

const TestPage: React.FC<{}> = () => {
  return (
    <div className="test-page">
      <NavBar />
      <TestPageContent />
    </div>
  );
};

const TestPageWithAuth = withAuth(TestPage);

export default TestPageWithAuth;
