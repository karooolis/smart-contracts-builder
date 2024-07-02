import { useBlockNumber } from "wagmi";

export function LiveBlock() {
  const blockNumber = useBlockNumber({
    watch: true,
  });

  if (!blockNumber.data) return null;

  return (
    <div className="inline-block mr-4">
      <div
        className="flex items-center justify-between text-xs font-extrabold text-green-600"
        // style={{
        //   color: "rgb(64, 182, 107)",
        // }}
      >
        <span
          className="mr-2 inline-block h-[8px] w-[8px] rounded-full animate-pulse"
          style={{
            background: "rgb(64, 182, 107)",
          }}
        />
        <span className="opacity-70" style={{ fontSize: "12px" }}>
          {blockNumber.data.toString()}
        </span>
      </div>
    </div>
  );
}
export default LiveBlock;
