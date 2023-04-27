import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone/esm/vis-network.js";
import { DataSet } from "vis-data";
import { Button } from "@mui/material";

export default function NetworkGraph({
  edgeData,
  nodeData,
  currentWikiPage,
  setCurrentWikiPage,
  nodeIndex,
  networkCreated,
  updateNetwork,
  createNetwork,
}) {
  const containerRef = useRef(null);

  const [center, setCenter] = useState(false);

  useEffect(() => {
    console.log(edgeData);
    console.log(nodeData);
    // create an array with nodes
    var nodes = new DataSet(nodeData.current);

    // create an array with edges
    var edges = new DataSet(edgeData.current);
    nodes.update(nodeData);
    edges.update(edgeData);

    const container = containerRef.current;
    const options = {
      width: "100%",
      height: "450px",
    };
    const network = new Network(container, { nodes, edges }, options);
    network.moveTo({ position: { x: 0, y: 0 }, scale: 1 });
    network.on("click", (params) => {
      var clickedNodeId = params.nodes[0];
      var clickedNode = nodes.get(clickedNodeId);

      if (!clickedNode) return;

      setCurrentWikiPage(clickedNode.label);
      nodeIndex.current = clickedNode.id;
    });
    return () => {
      network.destroy();
    };
  }, [
    edgeData,
    nodeData,
    currentWikiPage,
    setCurrentWikiPage,
    nodeIndex,
    center,
  ]);

  return (
    <div style={{ marginTop: "1%" }}>
      <Button
        id="saveNetwork"
        variant="contained"
        color="primary"
        onClick={networkCreated ? updateNetwork : createNetwork}
        size="small"
        sx={{ marginRight: "1%" }}
      >
        Save Network
      </Button>
      <Button
        id="centerNetwork"
        variant="contained"
        color="primary"
        onClick={() => setCenter(!center)}
        size="small"
      >
        Center
      </Button>
      <div ref={containerRef} />
    </div>
  );
}
