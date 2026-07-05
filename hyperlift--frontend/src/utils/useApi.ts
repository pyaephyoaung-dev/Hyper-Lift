import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiCall();
      const data = response?.data ?? response;
      setState({ data, loading: false, error: null });
      return data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Something went wrong';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

export default useApi;
