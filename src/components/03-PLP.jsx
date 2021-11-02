import React from "react";

import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/03-useInfiniteLoading';

const PLP = () => {
  const { items, hasNext, hasPrevious, loadNext, loadPrevious } = useInfiniteLoading({ getItems });
  
  React.useEffect(() => {
    document.title = '03 PLP'
  }, [])

  return (
    <React.Fragment>
      {hasPrevious && 
        <button className="btn--load" onClick={() => loadPrevious()}>Load Previous</button>
      }
      
      {items.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <ul className="products">
        {items.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
            />
          </li>
        ))}
      </ul>
      )}
      
      {hasNext && (
        <button className="btn--load" type="button" onClick={() => loadNext()}>Load Next</button>
      )}
    </React.Fragment>
  );
};

export default PLP;
