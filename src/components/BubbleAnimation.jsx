import React from "react";
import { styled, keyframes } from "@mui/system";

const bubbleAnimation = keyframes`
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
`;

const Bubble = styled("div")(({ size, left, duration, delay }) => ({
  position: "absolute",
  bottom: `-${size}px`,
  left: `${left}%`,
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.1)",
  animation: `${bubbleAnimation} ${duration}s infinite linear`,
  animationDelay: `${delay}s`,
}));

const BubbleAnimation = ({ count = 30 }) => {
  const generateBubbles = () => {
    const bubbles = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 40 + 5; // Размер от 5px до 25px
      const left = Math.random() * 100; // Позиция по горизонтали
      const duration = Math.random() * 10 + 5; // Длительность анимации от 5 до 15 секунд
      const delay = Math.random() * 5; // Задержка до 5 секунд

      bubbles.push(
        <Bubble
          key={i}
          size={size}
          left={left}
          duration={duration}
          delay={delay}
        />
      );
    }
    return bubbles;
  };

  return <>{generateBubbles()}</>;
};

export default BubbleAnimation;
