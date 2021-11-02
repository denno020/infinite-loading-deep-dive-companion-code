import React from "react";

import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/01b-useInfiniteLoading';

const PLP = () => {
  const { items, hasMore, loadItems } = useInfiniteLoading({ getItems });
  
  React.useEffect(() => {
    document.title = '01b PLP'
  }, [])

  return (
    <React.Fragment>
      
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
      
      {hasMore && (
        <button className="btn--load-more" type="button" onClick={() => loadItems()}>Load Next</button>
      )}
    </React.Fragment>
  );
};

export default PLP;
