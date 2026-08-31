import { useEffect, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T>(fetchFunction: () => Promise<T>) => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const executeFetch = async () => {
      try {
        const data = await fetchFunction();

        setState({
          data,
          loading: false,
          error: null,
        });
      } catch {
        setState({
          data: null,
          loading: false,
          error: "No se pudo obtener la información",
        });
      }
    };

    executeFetch();
  }, [fetchFunction]);

  return state;
};