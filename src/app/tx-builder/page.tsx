import React from "react";
import _ from "lodash";

import { SimulatorForm } from "./SimulatorForm";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navigation />

      <div className="mx-auto max-w-lg py-8">
        <SimulatorForm />
      </div>
    </div>
  );
}
