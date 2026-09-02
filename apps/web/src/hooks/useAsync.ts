import { useCallback, useEffect, useRef, useState } from "react";
import { toApiError } from "@/services/api/errors";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  const fetcherRef = useRef(fetcher);
  // eslint-disable-next-line react-hooks/refs
  fetcherRef.current = fetcher;

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await fetcherRef.current();
        if (active) setState({ data, loading: false, error: null });
      } catch (error: unknown) {
        if (active)
          setState({
            data: null,
            loading: false,
            error: toApiError(error).message,
          });
      }
    };
    void load();

    return () => {
      active = false;
    };
    // deps is a dynamic array; the fetcher is read from a ref to avoid stale closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { ...state, refetch };
};

export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async <T>(action: () => Promise<T>): Promise<T | undefined> => {
      setLoading(true);
      setError(null);
      try {
        return await action();
      } catch (err) {
        setError(toApiError(err).message);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { loading, error, run, clearError: () => setError(null) };
};
