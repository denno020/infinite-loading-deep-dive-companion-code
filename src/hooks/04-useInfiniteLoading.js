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
  const initialPage = useRef(Number(new URLSearchParams(window.location.search).get('page')) || 1);
  const initialPageLoaded = useRef(false);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(() => initialPage.current !== 1);
  const lowestPageLoaded = useRef(initialPage.current);
  const highestPageLoaded = useRef(initialPage.current);

  const loadItems = async (page, itemCombineMethod) => {
    const data = await getItems({ page });
    setHasNext(data.totalPages > page);
    setHasPrevious(page > 1);
    setItems(prevItems => {
      return itemCombineMethod === 'prepend' ?
        [...data.items, ...prevItems] :
        [...prevItems, ...data.items]
    });
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
    // rootMargin: '500px',
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