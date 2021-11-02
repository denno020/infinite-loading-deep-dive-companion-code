import React from "react";

import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/04-useInfiniteLoading'; // No changes required here

const PLP = () => {
  const { items, hasNext, hasPrevious, loadNext, loadPrevious, loadMoreRef } = useInfiniteLoading({ getItems });
  
  React.useEffect(() => {
    document.title = '04b PLP'
  }, [])

  const placeholderProducts = React.useMemo(() => {
    return Array.from(new Array(12)).map((ingored, index) => (
      <li key={index}> {/* <------ */}
        <ProductCard isSkeleton={true}/>
      </li>
    ));
  }, [])

  return (
    <React.Fragment>
      {hasPrevious && 
        <button onClick={() => loadPrevious()}>Load Previous</button>
      }

      <ul className="products">
        {items.length === 0 ? placeholderProducts : items.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
              />
            </li>
          ))}
      </ul>
      
      {hasNext && (
        <button ref={loadMoreRef} className="btn--load-more" type="button" onClick={() => loadNext()}>Load Next</button>
      )}
    </React.Fragment>
  );
};

export default PLP;
