import { useState, useMemo } from 'react';

export interface UseFilterSearchOptions<T> {
  items: T[];
  filterFn?: (item: T) => boolean;
  searchFields: (item: T) => (string | undefined)[];
}

export function useFilterSearch<T>({
  items,
  filterFn,
  searchFields,
}: UseFilterSearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return items.filter(item => {
      if (filterFn && !filterFn(item)) {
        return false;
      }
      if (!q) return true;

      const fields = searchFields(item);
      return fields.some(field => field?.toLowerCase().includes(q));
    });
  }, [items, filterFn, searchFields, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    count: filteredItems.length,
    totalCount: items.length,
  };
}
