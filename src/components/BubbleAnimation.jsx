import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/system";

const BubbleContainer = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
});

const Bubble = styled("div")(({ size, color }) => ({
  position: "absolute",
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: "50%",
  background: `radial-gradient(circle at 33% 33%, 
    rgba(255,255,255,0.3), 
    ${color} 40%, 
    rgba(255,255,255,0) 60%)`,
  boxShadow: `inset 0 0 20px rgba(255, 255, 255, 0.5), 
    inset 0 0 20px ${color}, 
    0 0 10px rgba(255, 255, 255, 0.1)`,
  border: "1px solid rgba(255, 255, 255, 0.2)",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "5%",
    left: "10%",
    width: "30%",
    height: "30%",
    borderRadius: "50%",
    background:
        "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8), rgba(255,255,255,0.2) 100%)",
  },
}));

const BubbleAnimation = () => {
  const [bubbles, setBubbles] = useState([]);

  const getRandomColor = () => {
    const colors = [
      "rgba(255, 0, 0, 0.1)", // Красный
      "rgba(0, 255, 0, 0.1)", // Зеленый
      "rgba(0, 0, 255, 0.1)", // Синий
      "rgba(255, 255, 0, 0.1)", // Желтый
      "rgba(255, 0, 255, 0.1)", // Пурпурный
      "rgba(0, 255, 255, 0.1)", // Голубой
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createBubble = useCallback(() => {
    const size = Math.random() * 20 + 10;
    return {
      id: Math.random(),
      size,
      left: Math.random() * 100,
      top: 100 + size,
      speed: Math.random() * 0.3 + 0.1,
      lifespan: Math.random() * 5000 + 4000,
      color: getRandomColor(),
    };
  }, []);

  const animateBubbles = useCallback(() => {
    setBubbles((prevBubbles) =>
        prevBubbles
            .map((bubble) => ({
              ...bubble,
              top: bubble.top - bubble.speed,
              lifespan: bubble.lifespan - 16,
            }))
            .filter((bubble) => bubble.lifespan > 0 && bubble.top + bubble.size > 0)
    );
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() < 0.2) {
        // 20% шанс создания нового пузыря
        setBubbles((prevBubbles) => [...prevBubbles, createBubble()]);
      }
    }, 400);

    const animationId = setInterval(animateBubbles, 16);

    return () => {
      clearInterval(intervalId);
      clearInterval(animationId);
    };
  }, [createBubble, animateBubbles]);

  return (
      <BubbleContainer>
        {bubbles.map((bubble) => (
            <Bubble
                key={bubble.id}
                size={bubble.size}
                color={bubble.color}
                style={{
                  left: `${bubble.left}%`,
                  top: `${bubble.top}px`,
                  opacity: bubble.lifespan / 9000,
                }}
            />
        ))}
      </BubbleContainer>
  );
};

export default BubbleAnimation;
