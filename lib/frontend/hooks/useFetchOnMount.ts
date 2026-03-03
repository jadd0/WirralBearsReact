import { useEffect } from "react";
import { useAsync } from "./useAsync";

export function useFetchOnMount<TResult>(fn: () => Promise<TResult>) {
  const { data, loading, error, run, setData } = useAsync(fn);

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: run, setData } as const;
}
