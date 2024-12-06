import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

import { fetchTableByRoomId } from "@/_services";
import { zenchefTable } from "@/_types";

const TableCanvas = ({ roomId }: { roomId: string }) => {
  const fetchCurrentTables = () => fetchTableByRoomId({ roomId });

  const { isLoading, data: tables } = useQuery("tables", fetchCurrentTables, {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    select: (data) => data.tables.sort((a: any, b: any) => a.name - b.name),
    keepPreviousData: true,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;

        setDimensions({
          width: clientWidth,
          height: clientHeight,
        });
      }
    };

    // Initial size measurement
    updateDimensions();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Clean up observer
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const drawTable = (ctx: CanvasRenderingContext2D, table: zenchefTable, x: number, y: number) => {
    const tableWidth = table.table_type?.width || 60;
    const tableHeight = table.table_type?.height || 60;

    // Set table styles
    ctx.fillStyle = table.is_bookable ? "#4CAF50" : "#9E9E9E";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    // Draw table based on shape
    if (table.table_type?.shape === "circle") {
      ctx.beginPath();
      ctx.ellipse(x + tableWidth / 2, y + tableHeight / 2, tableWidth / 2, tableHeight / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else {
      // Default to rectangle
      ctx.fillRect(x, y, tableWidth, tableHeight);
      ctx.strokeRect(x, y, tableWidth, tableHeight);
    }

    // Draw table number
    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${table.name} (${table.couvert})`, x + tableWidth / 2, y + tableHeight / 2);
  };

  useEffect(() => {
    if (!canvasRef.current || !tables || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Calculate grid layout
    const padding = 20;
    const cols = Math.ceil(Math.sqrt(tables.length));
    const cellWidth = (dimensions.width - padding * 2) / cols;
    const cellHeight = cellWidth;

    // Draw tables
    tables.forEach((table: zenchefTable, index: number) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      const x = padding + col * cellWidth + (cellWidth - (table.table_type?.width || 60)) / 2;
      const y = padding + row * cellHeight + (cellHeight - (table.table_type?.height || 60)) / 2;

      drawTable(ctx, table, x, y);
    });
  }, [tables, dimensions]);

  if (isLoading)
    return (
      <div className="flex h-full overflow-scroll pb-12 border-2 border-neutral-900">
        <p className="m-auto">Loading tables...</p>
      </div>
    );

  return (
    <div ref={containerRef} className="h-full overflow-scroll pb-12 border-2 border-neutral-900">
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>
    </div>
  );
};

export { TableCanvas };
