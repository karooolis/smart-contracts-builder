"use client";

import React, { useLayoutEffect } from "react";
import _ from "lodash";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { ConnectButton } from "@/components/ConnectButton";
import { ModeToggle } from "@/components/ModeToggle";
import { Separator } from "@/components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import CodeDisplay from "@/components/CodeDisplay";
import { ContractSelect } from "@/components/ContractSelect";
import { LibrarySelect } from "@/components/LibrarySelect";
import { Jobs } from "@/components/Jobs";

import {
  formSchema,
  formSchemaDefaultValues,
} from "@/components/ContractOptionsForm/constants";

import { ContractOptionsForm } from "@/components/ContractOptionsForm/ContractOptionsForm";

export default function Home() {
  const [size, setSize] = React.useState(20);
  useLayoutEffect(() => {
    const desiredInitialSizePx = 290;
    const initialSizePct = (desiredInitialSizePx / window.innerWidth) * 100;
    setSize(initialSizePct);

    // TODO: handle values during resizes as well
    // const observer = new ResizeObserver((entries) => {});
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="px-4 py-3">
        <div className="mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚧</div>
            <div className="text-md hidden font-semibold xl:inline-block">
              smart contracts builder
            </div>
          </div>

          <div className="flex gap-4">
            <ContractSelect />
            <LibrarySelect />
          </div>

          <div className="flex items-center gap-4">
            <Jobs />
            <ConnectButton />
            <ModeToggle />
          </div>
        </div>
      </nav>

      <Separator />

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={size} minSize={size * 0.75}>
          <ContractOptionsForm />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <CodeDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
