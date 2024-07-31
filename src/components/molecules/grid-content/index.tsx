import Square from "@atoms/square";
import { useMinedSonarStore } from "@store/gridStore.ts";

export default function GridContent() {
  const { grid, clickHandler, flagArea } = useMinedSonarStore();

  return (
    <div className="flex w-max mx-auto h-max rounded-lg overflow-hidden border border-stone-200">
      {grid?.map((row, idxRow) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: No data to avoid use index
        <div key={`col-${idxRow}`}>
          {row.map((data) => (
            <span key={data.id}>
              <Square data={data} flagArea={flagArea} checkArea={clickHandler} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
