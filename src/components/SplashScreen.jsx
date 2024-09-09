import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import logoImage from "../assets/favicon-180x180.png";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const SplashContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #002f4e 0%, #004d7a 50%, #008793 100%)",
  color: "white",
  overflow: "hidden",
  position: "relative",
}));

const LogoContainer = styled(Box)({
  position: "relative",
  marginBottom: 20,
  zIndex: 2,
});

const Logo = styled("img")({
  width: 192,
  height: 192,
  animation: `${float} 3s ease-in-out infinite`,
  position: "relative",
  filter: "drop-shadow(2px 4px 6px black)",
});

const AnimatedTypography = styled(Typography)`
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.5s;
  opacity: 0;
  animation-fill-mode: forwards;
  z-index: 2;
`;

const ProgressContainer = styled(Box)({
  width: "60%",
  maxWidth: 300,
  marginTop: 30,
  animation: `${fadeIn} 1s ease-out`,
  animationDelay: "1s",
  opacity: 0,
  animationFillMode: "forwards",
  zIndex: 2,
});

const BubbleCanvas = styled("canvas")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 1,
});

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const logoRect = logoRef.current.getBoundingClientRect();
    const logoCenter = {
      x: logoRect.left + logoRect.width / 2,
      y: logoRect.top + logoRect.height / 2,
    };

    const bubbles = Array(14)
      .fill()
      .map(() => ({
        x: logoCenter.x + (Math.random() - 0.5) * logoRect.width * 1.5,
        y: logoCenter.y + (Math.random() - 0.5) * logoRect.height * 1.5,
        radius: Math.random() * 10 + 5,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.05 + 0.02,
      }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((bubble) => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity})`;
        ctx.fill();

        bubble.y -= bubble.speed;

        if (bubble.y + bubble.radius < logoCenter.y - logoRect.height) {
          bubble.y = logoCenter.y + logoRect.height / 2 + Math.random() * 50;
          bubble.x =
            logoCenter.x + (Math.random() - 0.5) * logoRect.width * 1.5;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 1500);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [onFinish]);

  return (
    <SplashContainer>
      <BubbleCanvas ref={canvasRef} />
      <LogoContainer ref={logoRef}>
        <Logo src={logoImage} alt="Whale Finance Logo" />
      </LogoContainer>

      <AnimatedTypography variant="h4" gutterBottom>
        Whale Finance
      </AnimatedTypography>
      <AnimatedTypography variant="subtitle1" gutterBottom>
        Управляйте финансами с легкостью
      </AnimatedTypography>
      <ProgressContainer>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
              backgroundColor: "white",
            },
          }}
        />
      </ProgressContainer>
    </SplashContainer>
  );
};

export default SplashScreen;
