import React from "react";
import ProductCard from "./ProductCard";
import { getItems } from '../util/get-items';
import { useInfiniteLoading } from '../hooks/07-useInfiniteLoading';

const PLP = () => {
  const { 
    items,
    loadItems,
    totalPages
  } = useInfiniteLoading({ getItems, options: { loadingType: 'manual', preload: 'safe' } });

  React.useEffect(() => {
    document.title = '07 PLP'
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
      <ul className="products">
        {items.length === 0 ? placeholderProducts : items.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
              />
            </li>
          ))}
      </ul>
      <div style={{ textAlign: "center" }}>
        {Array.from(new Array(totalPages)).map((ignored, index) => (
          <button key={index} onClick={() => loadItems(index+1)}>{index+1}</button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default PLP;
