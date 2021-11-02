import React from "react";
import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/06-useInfiniteLoading';

const PLP = () => {
  const { 
    items,
    hasNext,
    hasPrevious,
    loadNext,
    loadPrevious,
    loadMoreRef,
    loadingType,
    toggleAutomaticLoading
  } = useInfiniteLoading({ getItems, options: { loadingType: 'manual', preload: 'safe' } });

  React.useEffect(() => {
    document.title = '06 PLP'
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
      {hasPrevious && (
        <button className="btn--load" type="button" onClick={() => loadPrevious()}>Load Previous</button>
      )}
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
        <div style={{ textAlign: "center" }}>
          <button ref={loadMoreRef} className="btn--load" type="button" onClick={() => loadNext()}>Load Next</button>
          <label>
            <input type="checkbox" checked={loadingType === 'infinite'} onChange={toggleAutomaticLoading} />
            Automatic
          </label>
        </div>
      )}
    </React.Fragment>
  );
};

export default PLP;
