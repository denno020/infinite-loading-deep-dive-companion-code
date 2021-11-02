import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom'

/**
 * Basic infinite loading hook with routing
 */
export const useInfiniteLoading = (props) => {
  const { getItems } = props;
  const [items, setItems] = useState([]);
  const pageToLoad = useRef(Number(new URLSearchParams(window.location.search).get('page')) || 1);
  const initialPageLoaded = useRef(false);
  const [hasNext, setHasNext] = useState(true); // <----
  const [hasPrevious, setHasPrevious] = useState(() => pageToLoad.current !== 1); // <----
  const history = useHistory();

  const loadItems = async (page, itemCombineMethod) => {
    const data = await getItems({ page });
    setHasNext(data.totalPages > page); // <----
    setHasPrevious(page > 1); // <----
    setItems(prevItems => {  // <----
      return itemCombineMethod === 'prepend' ?
        [...data.items, ...prevItems] :
        [...prevItems, ...data.items]
    });
  };

  const loadNext = () => {
    pageToLoad.current = Number(pageToLoad.current) + 1;
    history.replace(`?page=${pageToLoad.current}`);
    loadItems(pageToLoad.current, 'append');
  }

  const loadPrevious = () => {
    pageToLoad.current = Number(pageToLoad.current) - 1;
    history.replace(`?page=${pageToLoad.current}`);
    loadItems(pageToLoad.current, 'prepend');
  }

  useEffect(() => {
    if (initialPageLoaded.current) {
      return;
    }

    loadItems(pageToLoad.current, 'append');  // <----
    initialPageLoaded.current = true;
  }, [loadItems, items])

  return {
    items,
    hasNext,
    hasPrevious,
    loadNext,
    loadPrevious
  };
}

export default useInfiniteLoading;