import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom'

/**
 * Basic infinite loading hook with routing
 */
export const useInfiniteLoading = (props) => {
  const { getItems } = props;
  const [items, setItems] = useState([]);
  const pageToLoad = useRef(Number(new URLSearchParams(window.location.search).get('page')) || 1); // <----
  const initialPageLoaded = useRef(false);
  const [hasMore, setHasMore] = useState(true);
  const history = useHistory();

  const loadItems = async () => {
    const data = await getItems({
      page: pageToLoad.current
    });
    history.replace(`?page=${pageToLoad.current}`); // <----
    pageToLoad.current = pageToLoad.current + 1;

    setHasMore(data.totalPages > pageToLoad.current);
    setItems(prevItems => [...prevItems, ...data.items]);
  };

  useEffect(() => {
    // If we already have items, then likely that were hydrated from stored memory, so we don't need to send initial load request
    if (initialPageLoaded.current || items.length > 0) {
      return;
    }

    loadItems();
    initialPageLoaded.current = true;
  }, [loadItems, items])

  return {
    items,
    hasMore,
    loadItems
  };
}

export default useInfiniteLoading;