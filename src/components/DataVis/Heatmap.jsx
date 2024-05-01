import React, { useState, useEffect, useRef } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { SketchPicker } from "react-color";
import "./Heatmap.css";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // Corrected icon name
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function DataHeatmap({ data, name, units, heatmap_color }) {
  const heatmapRef = useRef(null); // Create a ref for the heatmap container
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const scrollSpeedRef = useRef(10);
  const [showArrows, setShowArrows] = useState(false);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      current.scrollBy({
        left:
          direction === "left"
            ? -scrollSpeedRef.current
            : scrollSpeedRef.current,
        behavior: "smooth",
      });
    }
  };

  const checkOverflow = () => {
    const el = scrollRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setShowArrows(hasOverflow);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkOverflow);
    checkOverflow(); // Initial check for any overflow
    return () => window;
    window.removeEventListener("resize", checkOverflow);
  });

  // This effect will ensure that overflow is checked whenever the data changes
  useEffect(() => {
    checkOverflow();
  }, [data, heatmap_color]);

  const startScrolling = (direction) => {
    stopScrolling(); // Prevent multiple intervals if user spams the button
    handleScroll(direction); // Initial scroll
    scrollIntervalRef.current = setInterval(() => {
      scrollSpeedRef.current *= 1.05; // Increase speed by 5% each iteration
      handleScroll(direction);
    }, 100); // Adjust time to control acceleration rate
  };

  const stopScrolling = () => {
    clearInterval(scrollIntervalRef.current);
    scrollIntervalRef.current = null;
    scrollSpeedRef.current = 50; // Reset speed
  };
  data = Object.entries(data).map(([date, value]) => ({ date, value }));

  var minValue = data?.length ? data[0].value : 0;
  var maxValue = data?.length ? data[0].value : 0;
  if (data && data.length > 1) {
    minValue = data.reduce(
      (min, item) => (item.value < min ? item.value : min),
      minValue
    );
    maxValue = data.reduce(
      (max, item) => (item.value > max ? item.value : max),
      maxValue
    );
  }

  const classForValue = (value) => {
    if (!value) {
      return "color-empty";
    }
    value = value.count;
    const steps = 14;
    const stepSize = Math.abs(maxValue - minValue) / steps;

    const opacityLevel = Math.min(
      Math.floor((value - minValue) / stepSize) + 1,
      steps
    );
    return `opacity-level-${opacityLevel} color-scale-custom`;
  };

  // Apply the color directly to the heatmap container
  useEffect(() => {
    if (heatmapRef.current) {
      heatmapRef.current.style.setProperty("--heatmap-color", heatmap_color);
    }
  }, [heatmap_color]);

  return (
    <div>
      <h2>{name}</h2>

      <Box
        ref={scrollRef}
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        <div
          ref={heatmapRef}
          style={{
            position: "relative",
            width: "100%",
            minWidth: "800px",
          }}
        >
          <CalendarHeatmap
            startDate={shiftDate(new Date(), -365)}
            endDate={new Date()}
            classForValue={classForValue}
            values={data.map((entry) => ({
              date: entry.date,
              count: entry.value,
            }))}
            tooltipDataAttrs={(value) => ({
              "data-tip": `${value.date} has value: ${value.count} ${units}`,
            })}
            showWeekdayLabels={false}
          />
        </div>
      </Box>
      {showArrows && (
        <>
          <IconButton
            onMouseDown={() => startScrolling("left")}
            onMouseUp={stopScrolling}
            onMouseLeave={stopScrolling}
            onTouchEnd={stopScrolling}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton
            onMouseDown={() => startScrolling("right")}
            onMouseUp={stopScrolling}
            onMouseLeave={stopScrolling}
            onTouchEnd={stopScrolling}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}
    </div>
  );
}

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

export default DataHeatmap;
