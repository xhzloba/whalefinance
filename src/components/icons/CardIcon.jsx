import React from "react";

const CardIcon = ({ width = 36, height = 36 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#region.scaffold::common/::22)">
        <mask
          id="region.scaffold::common/::18"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="4"
          y="8"
          width="28"
          height="20"
        >
          <rect
            x="4"
            y="8"
            width="28"
            height="20"
            rx="4"
            fill="url(#region.scaffold::common/::19)"
          ></rect>
        </mask>
        <g mask="url(#region.scaffold::common/::18)">
          <rect
            x="4"
            y="8"
            width="28"
            height="20"
            fill="url(#region.scaffold::common/::20)"
          ></rect>
          <path
            d="M5.99994 4H32.5C33.8807 4 34.9218 5.12409 34.5407 6.45118C33.5508 9.89834 30.7359 15.5 23.9999 15.5C15.9279 15.5 13.4868 19.1199 13.0692 25.9989C12.9855 27.3771 11.8806 28.5 10.4999 28.5H5.99994C4.61923 28.5 3.49994 27.3807 3.49994 26V6.5C3.49994 5.11929 4.61923 4 5.99994 4Z"
            fill="url(#region.scaffold::common/::21)"
          ></path>
          <circle
            opacity="0.8"
            cx="9.5"
            cy="13.5"
            r="2.5"
            fill="#84FFC4"
          ></circle>
          <rect
            x="19"
            y="20"
            width="10"
            height="5"
            rx="2.5"
            fill="#08A652"
          ></rect>
        </g>
      </g>
      <defs>
        <radialGradient
          id="region.scaffold::common/::19"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-1.5 31) rotate(-36.9776) scale(53.2001 50.3244)"
        >
          <stop stopColor="#21A038"></stop>
          <stop offset="0.470426" stopColor="#00D900"></stop>
          <stop offset="0.728264" stopColor="#A0E720"></stop>
          <stop offset="0.923693" stopColor="#FAED00"></stop>
        </radialGradient>
        <radialGradient
          id="region.scaffold::common/::20"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(-2.5 3.5) rotate(35.3803) scale(42.3143 40.027)"
        >
          <stop stopColor="#A0E720"></stop>
          <stop offset="0.65123" stopColor="#42BF0F"></stop>
          <stop offset="0.95601" stopColor="#01E1FF"></stop>
        </radialGradient>
        <linearGradient
          id="region.scaffold::common/::21"
          x1="27.5"
          y1="9"
          x2="9.49999"
          y2="29"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01E1FF" stopOpacity="0.75"></stop>
          <stop
            offset="0.308164"
            stopColor="#31E2A2"
            stopOpacity="0.90115"
          ></stop>
          <stop offset="0.756711" stopColor="#31CC52"></stop>
          <stop offset="1" stopColor="#2ACE6C"></stop>
        </linearGradient>
        <clipPath id="region.scaffold::common/::22">
          <rect width="36" height="36" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>
  );
};

export default CardIcon;
