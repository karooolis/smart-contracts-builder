import React from "react";
import _ from "lodash";

import { ConverterForm } from "./ConverterForm";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navigation />

      <div className="mx-auto py-8">
        <ConverterForm />
      </div>
    </div>
  );
}
