"use client";

import { useEffect, useRef } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { select } from "d3-selection";
import type { Relationship } from "@/lib/types";

interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
  ticker?: string;
  isCatalyst: boolean;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  strength: string;
  relId: string;
}

const EDGE_STYLES: Record<string, { stroke: string; dasharray: string }> = {
  direct: { stroke: "#4F46E5", dasharray: "none" },
  indirect: { stroke: "#A5B4FC", dasharray: "6,3" },
  speculative: { stroke: "#D4D4D4", dasharray: "4,4" },
};

export function NetworkGraph({
  catalystName,
  relationships,
  onNodeClick,
}: {
  catalystName: string;
  relationships: Relationship[];
  onNodeClick?: (relId: string) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = svg.clientWidth;
    const height = 320;

    const nodes: GraphNode[] = [
      { id: "catalyst", label: catalystName, isCatalyst: true },
    ];
    const links: GraphLink[] = [];

    for (const rel of relationships) {
      const nodeId = rel.relatedCompany.id;
      if (!nodes.find((n) => n.id === nodeId)) {
        nodes.push({
          id: nodeId,
          label: rel.relatedCompany.name,
          ticker: rel.relatedCompany.ticker,
          isCatalyst: false,
        });
      }
      links.push({
        source: "catalyst",
        target: nodeId,
        strength: rel.relationshipStrength,
        relId: rel.id,
      });
    }

    const sel = select(svg);
    sel.selectAll("*").remove();
    sel.attr("viewBox", `0 0 ${width} ${height}`);

    const g = sel.append("g");

    const link = g
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => EDGE_STYLES[d.strength]?.stroke ?? "#D4D4D4")
      .attr(
        "stroke-dasharray",
        (d) => EDGE_STYLES[d.strength]?.dasharray ?? "none"
      )
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.7);

    const node = g
      .selectAll<SVGGElement, GraphNode>("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", (d) => (d.isCatalyst ? "default" : "pointer"));

    node
      .append("circle")
      .attr("r", (d) => (d.isCatalyst ? 20 : 12))
      .attr("fill", (d) => (d.isCatalyst ? "#4F46E5" : "#EEF2FF"))
      .attr("stroke", (d) => (d.isCatalyst ? "#4338CA" : "#A5B4FC"))
      .attr("stroke-width", 1.5);

    node
      .append("text")
      .text((d) => (d.isCatalyst ? d.label : (d.ticker ?? d.label)))
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.isCatalyst ? 36 : 24))
      .attr("font-size", (d) => (d.isCatalyst ? 12 : 10))
      .attr("fill", "#525252")
      .attr("font-family", "var(--font-geist-sans), system-ui, sans-serif");

    node.on("mouseenter", function (_event, d) {
      if (d.isCatalyst) return;
      select(this)
        .select("circle")
        .attr("stroke", "#4F46E5")
        .attr("stroke-width", 2.5);
      link.attr("opacity", (l) =>
        (l.target as GraphNode).id === d.id ||
        (l.source as GraphNode).id === d.id
          ? 1
          : 0.2
      );
    });

    node.on("mouseleave", function (_event, d) {
      if (d.isCatalyst) return;
      select(this)
        .select("circle")
        .attr("stroke", "#A5B4FC")
        .attr("stroke-width", 1.5);
      link.attr("opacity", 0.7);
    });

    node.on("click", (_event, d) => {
      if (d.isCatalyst) return;
      const rel = links.find((l) => (l.target as GraphNode).id === d.id);
      if (rel && onNodeClick) onNodeClick(rel.relId);
    });

    const sim = forceSimulation(nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", forceManyBody().strength(-200))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide(30));

    sim.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x ?? 0)
        .attr("y1", (d) => (d.source as GraphNode).y ?? 0)
        .attr("x2", (d) => (d.target as GraphNode).x ?? 0)
        .attr("y2", (d) => (d.target as GraphNode).y ?? 0);

      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      sim.stop();
    };
  }, [catalystName, relationships, onNodeClick]);

  return (
    <div className="hidden sm:block">
      <svg
        ref={svgRef}
        className="w-full rounded border border-[--border] bg-[--background]"
        style={{ height: 320 }}
        role="img"
        aria-label={`Network graph showing ${catalystName} and its public-market counterparties`}
      />
    </div>
  );
}
