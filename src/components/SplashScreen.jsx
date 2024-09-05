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

const waveAnimation = keyframes`
  0% { transform: translateX(0) translateZ(0) scaleY(1); }
  50% { transform: translateX(-25%) translateZ(0) scaleY(0.55); }
  100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
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

const WaveEffect = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "200%",
  height: "150px",
  overflow: "hidden",
  zIndex: 1,
  "& > svg": {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    animation: `${waveAnimation} 10s linear infinite`,
    filter: "drop-shadow(0 -10px 20px rgba(0, 87, 168, 0.7))",
    "&:nth-of-type(2)": {
      animationDelay: "-5s",
      opacity: 0.7,
    },
  },
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
      <WaveEffect>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="rgba(255, 255, 255, 0.5)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="rgba(255, 255, 255, 0.3)"
            d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </WaveEffect>
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
