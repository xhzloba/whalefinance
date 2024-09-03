import React from "react";

const SafeIcon = ({ width = 36, height = 36, color = "rgb(14, 186, 177)" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 9C7 7.89543 7.89543 7 9 7H27C28.1046 7 29 7.89543 29 9V27C29 28.1046 28.1046 29 27 29V30C27 30.8284 26.3284 31.5 25.5 31.5C24.6716 31.5 24 30.8284 24 30V29H12V30C12 30.8284 11.3284 31.5 10.5 31.5C9.67157 31.5 9 30.8284 9 30L9 29C7.89543 29 7 28.1046 7 27V9Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15ZM13 18C13 15.2386 15.2386 13 18 13C20.7614 13 23 15.2386 23 18C23 20.7614 20.7614 23 18 23C15.2386 23 13 20.7614 13 18Z"
        fill="white"
      />
    </svg>
  );
};

export default SafeIcon;
