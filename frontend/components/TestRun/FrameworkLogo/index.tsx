"use client";
import React from "react";
import Image from "next/image";

interface Props {
  framework: string;
}

export const FrameworkLogo = ({ framework }: Props) => {
  return (
    <Image
      src={`/frameworks/${framework}.svg`}
      alt={framework}
      width="48"
      height="48"
    />
  );
};
