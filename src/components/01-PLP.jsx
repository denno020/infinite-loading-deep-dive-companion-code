import React from "react";
import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/01-useInfiniteLoading';

const PLP = () => {
  const { items, hasMore, loadItems } = useInfiniteLoading({ getItems });

  if (items.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <React.Fragment>
      <ul className="products">
        {items.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
            />
          </li>
        ))}
      </ul>
      {hasMore && (
        <button className="btn--load-more" type="button" onClick={() => loadItems()}>Load Next</button>
      )}
    </React.Fragment>
  );
};

export default PLP;
