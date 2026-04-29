import { useState, useEffect, useRef, useCallback } from 'react';

const CACHE_PREFIX = 'smarthire_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url) {
  return CACHE_PREFIX + url;
}

function getCached(url) {
  try {
    const key = getCacheKey(url);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > DEFAULT_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCached(url, data) {
  try {
    const key = getCacheKey(url);
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // Storage full — ignore
  }
}

export function useCachedFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const cacheKey = JSON.stringify(args);
      const cached = getCached(cacheKey);
      if (cached) {
        setData(cached);
        setLoading(false);
        return cached;
      }

      try {
        const result = await fetcher(...args);
        if (!controller.signal.aborted) {
          setData(result);
          setCached(cacheKey, result);
          return result;
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Request failed');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [fetcher]
  );

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return { data, loading, error, execute };
}

