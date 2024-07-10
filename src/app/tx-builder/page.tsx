import React from "react";
import _ from "lodash";

import { Navigation } from "./Navigation";
import { SimulatorForm } from "./SimulatorForm";

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
