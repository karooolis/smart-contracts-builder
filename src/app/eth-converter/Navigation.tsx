"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { ModeToggle } from "@/components/ModeToggle";

export function Navigation() {
  return (
    <nav className="px-4 py-3">
      <div className="mx-auto flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚧</div>
          <div className="text-md hidden font-semibold xl:inline-block">
            smart contracts builder
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
