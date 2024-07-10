"use client";

import React from "react";
import _ from "lodash";

import { ConnectButton } from "@/components/ConnectButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import { SimulatorForm } from "./SimulatorForm";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <nav className="px-4 py-3">
        <div className="mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚧</div>
            <div className="text-md hidden font-semibold xl:inline-block">
              smart contracts builder
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <Jobs /> */}
            <ConnectButton />
            <ModeToggle />
          </div>
        </div>
      </nav>

      <Separator />

      <div className="mx-auto max-w-lg py-8">
        <SimulatorForm />
      </div>
    </div>
  );
}
