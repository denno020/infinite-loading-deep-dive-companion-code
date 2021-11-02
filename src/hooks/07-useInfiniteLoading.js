/**
 * useInfiniteLoading
 *
 * @author Luke Denton <luke@iamlukedenton.com>
 * @license MIT
 */
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

const clientCanPreload = !['slow-2g', '2g'].includes(navigator.connection.effectiveType) && !navigator.connection.saveData;

/**
 * Handle infinite loading a list of items
 * @param {Object}   props
 * @param {Function} props.getItems
 * @param {Object}   props.options
 * @param {'manual'|'partial'|'infinite'} props.options.loadingType Indicate the method of infinite loading. 'manual' = user must trigger using button. 'partial' = there is a finite number of auto loads before user has to manually press button (set using 'partialInfiniteLimit'). 'infinite' = continue to auto load new pages for as long as there are new pages available
 * @param {'off'|'safe'|'always'} [props.options.preload] 'safe' = only preload when client can handle. Default 'off'
 * @param {number} [props.options.partialInfiniteLimit] Indicate the max number of times to auto load. Default -1, which means don't limit
 *
 * @returns {{loadPrevious: loadPrevious, loadNext: loadNext, hasPrevious: boolean, hasNext: boolean, items: *[], loadMoreRef: (element?: (HTMLElement | null)) => void}}
 */
export const useInfiniteLoading = (props) => {
  const { getItems, options = {} } = props;
  const { loadingType, preload = 'off', partialInfiniteLimit = -1 } = options;
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const nextItems = useRef([]);
  const allPagesLoaded = useRef(false);
  const initialPage = useRef(Number(new URLSearchParams(window.location.search).get('page')) || 1);
  const initialPageLoaded = useRef(false);
  const isInFlight = useRef(false);

  if (partialInfiniteLimit >= 0 && loadingType !== 'partial') {
    console.warn('Option "partialInfiniteLimit" provided by loading type not "partial". "partialInfiniteLimit" will be ignored');
  }

  if (loadingType === 'partial' && partialInfiniteLimit < 0) {
    throw new Error('When using loadingType "partial", must also provide a positive value for "partialInfiniteLimit"');
  }

  const canPreload = (() => {
    if (preload === 'always') {
      return true;
    }

    if (preload === 'safe' && clientCanPreload) {
      return true;
    }

    return false;
  })();

  const loadItems = async (page) => {
    let items;
    if (initialPage.current + 1 !== page || !nextItems.current.length || canPreload === false) {
      isInFlight.current = true;
      history.replace(`?page=${page}`);
      const data = await getItems({ page });
      initialPage.current = page;
      isInFlight.current = false;
      items = data.items;
      setTotalPages(data.totalPages);

      // Handle loading the last page directly
      if (data.totalPages <= page) {
        allPagesLoaded.current = true;
      }
    } else {
      items = nextItems.current;
    }

    setItems(items);

    if (canPreload === false) return;

    nextItems.current = [];

    if (!allPagesLoaded.current) {
      const data = await getItems({ page: page + 1 })
      allPagesLoaded.current = data.totalPages <= page + 1;
      nextItems.current = data.items;
    }
  };

  useEffect(() => {
    if (initialPageLoaded.current) {
      return;
    }

    loadItems(initialPage.current, 'append');
    initialPageLoaded.current = true;
  }, [loadItems])

  return {
    items,
    loadItems,
    totalPages
  };
}
