import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, Tooltip, Col, Row } from "antd";
import "antd/dist/reset.css";
import "tailwindcss/tailwind.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const cardRef = useRef(null);

  const personInfo = {
    name: "Nate",
    role: "Student",
    bio: "I study.",
  };

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-600 text-white"
      style={{ position: "absolute", top: "30%", left: "30%", width: "40%" }}
    >
      <Card
        ref={cardRef}
        title={personInfo.name}
        className="bg-gray-800 text-white border-none"
        extra={<Tooltip title={personInfo.role}>{personInfo.role}</Tooltip>}
      >
        <p>{personInfo.bio}</p>
      </Card>
    </div>
  );
};

export default About;
