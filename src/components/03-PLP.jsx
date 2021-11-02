import React from "react";

import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/03-useInfiniteLoading';

const PLP = () => {
  const { items, hasNext, hasPrevious, loadNext, loadPrevious } = useInfiniteLoading({ getItems });
  
  React.useEffect(() => {
    document.title = '03 PLP'
  }, [])

  if (items.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <React.Fragment>
      {hasPrevious && 
        <button onClick={() => loadPrevious()}>Load Previous</button>
      }
      <ul className="products">
        {items.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
            />
          </li>
        ))}
      </ul>
      {hasNext && (
        <button className="btn--load-more" type="button" onClick={() => loadNext()}>Load Next</button>
      )}
    </React.Fragment>
  );
};

export default PLP;
