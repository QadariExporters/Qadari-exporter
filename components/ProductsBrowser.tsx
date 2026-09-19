'use client';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Product } from '@/data/products';
import { ProductCard } from './ProductCard';

export function ProductsBrowser({
  products,
}: {
  products: Product[];
  categories?: string[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = useMemo(() => 
    products.filter((product) => 
      `${product.name} ${product.category || ''} ${product.description || ''}`.toLowerCase().includes(search.toLowerCase())
    ), 
    [products, search]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch('');
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll back to top of product grid region
    const el = document.querySelector('.collection-browser');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="search-box" style={{ maxWidth: '320px', width: '100%' }}>
          <Search size={17} />
          <input 
            value={search} 
            onChange={(event) => handleSearchChange(event.target.value)} 
            placeholder="Search products..." 
            aria-label="Search products" 
          />
          {search && (
            <button onClick={() => handleSearchChange('')} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>
        {search && (
          <button className="clear-filter" onClick={handleClear}>Clear search</button>
        )}
      </div>

      <p className="result-count">
        {filtered.length} pieces <span>in view</span>
        {totalPages > 1 && <span className="ml-2 font-normal text-xs text-muted-foreground">(Page {currentPage} of {totalPages})</span>}
      </p>

      {paginatedProducts.length ? (
        <>
          <div className="product-grid">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-button pagination-nav" 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <ChevronLeft size={14} className="mr-1 inline-block" /> Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                  onClick={() => goToPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-button pagination-nav" 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                Next <ChevronRight size={14} className="ml-1 inline-block" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No pieces match that search.</p>
          <button className="button button-dark" onClick={handleClear}>
            View all pieces
          </button>
        </div>
      )}
    </>
  );
}
