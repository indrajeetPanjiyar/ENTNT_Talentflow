import { useState, useCallback } from 'react';

// Uses MSW for API simulation and IndexedDB for storage
export const useSimulatedApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const simulateRequest = useCallback(async (action) => {
    setLoading(true);
    setError(null);

    try {
      const result = await action();
      setLoading(false);
      return { success: true, data: result };
    } catch (e) {
      console.error("API request error:", e);
      const errorMessage = e.message || "An unexpected error occurred during the API request.";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  return { simulateRequest, loading, error };
};