import { useBlockNumber } from "wagmi";

export function LiveBlock() {
  const blockNumber = useBlockNumber({
    watch: true,
  });

  if (!blockNumber.data) return null;

  return (
    <div
      className="absolute bottom-5 left-3 z-10 flex items-center justify-between text-xs font-extrabold"
      style={{
        color: "rgb(64, 182, 107)",
      }}
    >
      <span
        className="mr-2 inline-block h-[8px] w-[8px] rounded-full"
        style={{
          background: "rgb(64, 182, 107)",
        }}
      />
      <span className="opacity-70" style={{ fontSize: "11px" }}>
        {blockNumber.data.toString()}
      </span>
    </div>
  );
}
export default LiveBlock;
