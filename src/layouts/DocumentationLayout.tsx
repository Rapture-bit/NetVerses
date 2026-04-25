import React from "react";
import { Outlet } from "react-router-dom";

export default function DocumentationLayout() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: "<!--__USER__-->" }} />
      <div className="documentation-layout">
        <Outlet />
      </div>
    </>
  );
}
