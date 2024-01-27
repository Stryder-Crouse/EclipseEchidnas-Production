import React from "react";
import { ExampleComponentStryderNode } from "../../components/TestS/ExampleComponentStryderNode.tsx";
import { ExampleComponentStryderEdge } from "../../components/TestS/ExampleComponentStryderEdge.tsx";

//stryders test element
export default function Stryderstestroute() {
  return (
    <div className="w-100 h-100 d-flex flex-column overflow-auto">
      <h1>SUPMAN.</h1>
      <ExampleComponentStryderNode></ExampleComponentStryderNode>
      <ExampleComponentStryderEdge></ExampleComponentStryderEdge>
    </div>
  );
}
