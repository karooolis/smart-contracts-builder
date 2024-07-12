import React from "react";
import _ from "lodash";

import { Navigation } from "./Navigation";
import { ConverterForm } from "./ConverterForm";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navigation />

      <div className="mx-auto max-w-lg py-8">
        <ConverterForm />
      </div>
    </div>
  );
}
