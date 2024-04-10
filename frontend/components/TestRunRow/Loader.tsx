import React from "react";
import "./loader.css";
import { TestRun, Test } from "@/client";

type TestRunOrTest = TestRun | Test;

interface LoaderProps<T extends TestRunOrTest> {
  item: T;
}

export const Loader = <T extends TestRunOrTest>(props: LoaderProps<T>) => {
  const { item } = props;
  if (item && "failed" in item && (item.failed as number) > 0) {
    return <span className="loader_with_fail"></span>;
  }
  if (item && "status" in item && item.status === "FAILED") {
    return <span className="loader_with_fail"></span>;
  }
  return <span className="loader_ok"></span>;
};
