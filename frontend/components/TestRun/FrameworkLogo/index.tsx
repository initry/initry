"use client";
import React from "react";
import Image from "next/image";

interface Props {
  framework: string;
}

export const FrameworkLogo = ({ framework }: Props) => {
  const func = () => {
    if (framework.includes("pytest")) {
      return "pytest";
    }
  };
  return (
    <Image
      src={`/frameworks/${func()}.svg`}
      alt={framework}
      width="48"
      height="48"
    />
  );
};
