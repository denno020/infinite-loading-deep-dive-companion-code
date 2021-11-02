import { useEffect, useRef, useState } from 'react';

/**
 * Simple infinite loading hook
 */
export const useInfiniteLoading = (props) => {
  const { getItems } = props;
  const [items, setItems] = useState([]);
  const pageToLoad = useRef(1);
  const initialPageLoaded = useRef(false);
  const [hasMore, setHasMore] = useState(true);

  const loadItems = async () => {
    const data = await getItems({
      page: pageToLoad.current
    });
    pageToLoad.current = pageToLoad.current + 1

    setHasMore(data.totalPages > pageToLoad.current);
    setItems(prevItems => [...prevItems, ...data.items]);
  };

  useEffect(() => {
    if (initialPageLoaded.current) {
      return;
    }

    loadItems();
    initialPageLoaded.current = true;
  }, [loadItems])

  return {
    items,
    hasMore,
    loadItems
  };
}

export default useInfiniteLoading;