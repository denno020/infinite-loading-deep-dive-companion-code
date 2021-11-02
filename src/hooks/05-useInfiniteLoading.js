import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom'
import useInView from 'react-cool-inview';

/**
 * Basic infinite loading hook with routing
 */
export const useInfiniteLoading = (props) => {
  const { getItems } = props;
  const history = useHistory();
  const [items, setItems] = useState([]);
  const nextItems = useRef([]);
  const allPagesLoaded = useRef(false);
  const initialPage = useRef(Number(new URLSearchParams(window.location.search).get('page')) || 1);
  const initialPageLoaded = useRef(false);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(() => initialPage.current !== 1);
  const lowestPageLoaded = useRef(initialPage.current);
  const highestPageLoaded = useRef(initialPage.current);
  const isInFlight = useRef(false);
  const triggerNext = useRef(false);

  const loadItems = async (page, itemCombineMethod) => {
    let items;
    if (itemCombineMethod === 'prepend' || !nextItems.current.length) {
      isInFlight.current = true;
      const data = await getItems({ page });
      isInFlight.current = false;
      items = data.items;
      setHasPrevious(lowestPageLoaded.current > 1);

      // Handle loading the last page directly
      if (itemCombineMethod === 'append' && data.totalPages <= page) {
        setHasNext(false);
        allPagesLoaded.current = true;
      }
    } else {
      items = nextItems.current;
    }

    setItems(prevItems => {
      return itemCombineMethod === 'prepend' ?
        [...items, ...prevItems] :
        [...prevItems, ...items]
    });

    if (itemCombineMethod === 'prepend') return;

    nextItems.current = [];

    if (!allPagesLoaded.current) {
      isInFlight.current = true;
      const data = await getItems({ page: page + 1 })
      isInFlight.current = false;
      allPagesLoaded.current = data.totalPages <= page + 1;
      nextItems.current = data.items;

      if (triggerNext.current) {
        triggerNext.current = false;
        loadNext();
      }
    } else {
      setHasNext(false);
    }
  };

  const loadNext = () => {
    const nextPage = highestPageLoaded.current + 1;
    history.replace(`?page=${nextPage}`);
    loadItems(nextPage, 'append');
    highestPageLoaded.current = nextPage;
  }

  const loadPrevious = () => {
    const nextPage = lowestPageLoaded.current - 1;
    if (nextPage < 1) return;
    history.replace(`?page=${nextPage}`);
    loadItems(nextPage, 'prepend');
    lowestPageLoaded.current = nextPage;
  }

  const { observe } = useInView({
    rootMargin: '500px',
    onEnter: () => {
      loadNext();
    },
  });

  useEffect(() => {
    if (initialPageLoaded.current) {
      return;
    }

    loadItems(initialPage.current, 'append');
    initialPageLoaded.current = true;
  }, [loadItems, items])

  return {
    items,
    hasNext,
    hasPrevious,
    loadNext,
    loadPrevious,
    loadMoreRef: observe
  };
}

export default useInfiniteLoading;