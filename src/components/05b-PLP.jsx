import React from "react";

import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/05b-useInfiniteLoading';

const PLP = () => {
  const { items, hasNext, hasPrevious, loadNext, loadPrevious, loadMoreRef } = useInfiniteLoading({ getItems });
  
  React.useEffect(() => {
    document.title = '05b PLP'
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
        <button className="btn--load" onClick={() => loadPrevious()}>Load Previous</button>
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
        <button ref={loadMoreRef} className="btn--load" type="button" onClick={() => loadNext()}>Load Next</button>
      )}
    </React.Fragment>
  );
};

export default PLP;
