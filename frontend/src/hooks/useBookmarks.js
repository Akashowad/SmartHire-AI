import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'smarthire_bookmarks';

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(loadBookmarks);

  useEffect(() => {
    saveBookmarks(bookmarks);
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (jobId) => bookmarks.some((b) => b.id === jobId),
    [bookmarks]
  );

  const toggleBookmark = useCallback((job) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === job.id);
      if (exists) {
        return prev.filter((b) => b.id !== job.id);
      }
      return [...prev, { ...job, bookmarkedAt: new Date().toISOString() }];
    });
  }, []);

  const removeBookmark = useCallback((jobId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== jobId));
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark };
}

