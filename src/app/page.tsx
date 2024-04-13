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

import { ERC20_Initial } from "../templates/ERC20_Initial.js";
import { getTemplate } from "@/utils/templates";

import {
  formSchema,
  formSchemaDefaultValues,
} from "@/components/ContractOptionsForm/constants";

import { ContractOptionsForm } from "@/components/ContractOptionsForm/ContractOptionsForm";

export default function Home() {
  const [code, setCode] = React.useState(ERC20_Initial);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formSchemaDefaultValues,
  });

  const contract = form.watch("contract");
  const library = form.watch("library");
  const featuresValues = form.watch("features");
  const mintable = featuresValues.includes("mint");
  const burnable = featuresValues.includes("burn");
  const pausable = featuresValues.includes("pause");
  const accessControl = form.watch("accessControl");
  const upgradeability = form.watch("upgradeability");
  const name = form.watch("name");

  // set access control ON if mintable, burnable or pausable
  React.useEffect(() => {
    // if (
    //   accessControl == "none" &&
    //   (mintable || burnable || pausable || upgradeability == "uups")
    // ) {
    //   form.setValue("accessControl", "ownable");
    // }
  }, [accessControl, burnable, form, mintable, pausable, upgradeability]);

  const [size, setSize] = React.useState(20);
  useLayoutEffect(() => {
    const desiredInitialSizePx = 290;
    const initialSizePct = (desiredInitialSizePx / window.innerWidth) * 100;
    setSize(initialSizePct);

    // TODO: handle values during resizes as well
    // const observer = new ResizeObserver((entries) => {});
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="px-4 py-3">
        <div className="mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🚧</div>
            <div className="hidden lg:inline-block text-md font-semibold">
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
          <CodeDisplay name={name} value={code} contractType={contract} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
