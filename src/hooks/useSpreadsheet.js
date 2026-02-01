import { useCallback } from "react";
import { parseFile } from "../utils/parseFile";
import { useChart } from "../context/ChartContext";

export function useSpreadsheet() {
  const { dispatch } = useChart();

  const loadFile = useCallback(
    async (file) => {
      const result = await parseFile(file);
      dispatch({ type: "SET_FILE_DATA", payload: result });
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR_DATA" });
  }, [dispatch]);

  return { loadFile, clear };
}
