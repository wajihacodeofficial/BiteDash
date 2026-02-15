import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Star,
  Clock,
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUpAZ,
  DollarSign,
} from 'lucide-react';
import { useRestaurants, calculateDeliveryTime } from '../hooks/useRestaurants';
import { useLocation } from '../context/LocationContext';
import { restaurantApi } from '../api';
import './RestaurantList.css';

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { location, loading: locationLoading, detectLocation } = useLocation();

  // State from URL or defaults
  const searchTerm = searchParams.get('search') || '';
  const searchMode = searchParams.get('mode') || 'restaurant';
  const activeCategory = searchParams.get('category') || 'All';
  const validSortOptions = [
    'recommended',
    'rating',
    'deliveryTime',
    'cost_low',
    'cost_high',
  ];
  const sortBy = validSortOptions.includes(searchParams.get('sort'))
    ? searchParams.get('sort')
    : 'recommended';

  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchTrigger = (term = localSearchTerm) => {
    updateSearchParam('search', term);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (localSearchTerm.trim().length >= 2) {
        try {
          const res = await restaurantApi.getSuggestions(
            localSearchTerm,
            searchMode
          );
          setSuggestions(res);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [localSearchTerm, searchMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use React Query for data fetching
  const {
    data: restaurants = [],
    isLoading,
    error,
  } = useRestaurants({
    lat: location?.latitude,
    lng: location?.longitude,
    radius: 50,
    search: searchTerm,
    mode: searchMode,
  });

  // Filter restaurants locally for things API might not catch (like simple category string matching if API is partial)
  // Also handle Sorting locally since API might not do it
  const processedRestaurants = restaurants
    .filter((res) => {
      // Filter by category
      if (activeCategory !== 'All' && activeCategory !== '') {
        if (Array.isArray(res.cuisine)) {
          if (
            !res.cuisine.some(
              (c) => c.toLowerCase() === activeCategory.toLowerCase()
            )
          )
            return false;
        } else if (
          res.cuisine &&
          res.cuisine.toLowerCase() !== activeCategory.toLowerCase()
        ) {
          return false;
        }
      }

      // Filter by search term (Local refinement - ensure it matches API logic)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = res.name.toLowerCase().includes(searchLower);
        const cuisineMatch = Array.isArray(res.cuisine)
          ? res.cuisine.some((c) => c.toLowerCase().includes(searchLower))
          : res.cuisine?.toLowerCase().includes(searchLower);

        // ADDED: Deep check in menu for local search consistency
        const menuMatch = res.menu?.some((it) =>
          it.name.toLowerCase().includes(searchLower)
        );

        if (!nameMatch && !cuisineMatch && !menuMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'deliveryTime':
          return (a.deliveryTime || 999) - (b.deliveryTime || 999);
        case 'cost_low':
          // Assuming price or 'averageCost' exists. Falling back to simple comparison if not.
          return (a.averageCost || 0) - (b.averageCost || 0);
        case 'cost_high':
          return (b.averageCost || 0) - (a.averageCost || 0);
        default: // recommended
          return 0;
      }
    });

  const updateSearchParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  if (locationLoading) {
    return (
      <div
        className="container"
        style={{ padding: '50px', textAlign: 'center' }}
      >
        Detecting location...
      </div>
    );
  }

  // If no location, prompt usage
  if (!location) {
    return (
      <div
        className="container empty-state"
        style={{ textAlign: 'center', marginTop: '50px' }}
      >
        <h2>Where are you?</h2>
        <p>Please allow location access to see restaurants near you.</p>
        <button className="btn-primary" onClick={detectLocation}>
          Use Current Location
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="restaurant-list container">
        <div className="list-toolbar">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              readOnly
            />
          </div>
        </div>
        <div className="restaurant-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="restaurant-card card loading-skeleton">
              <div className="card-image skeleton"></div>
              <div className="card-info">
                <div className="title-row">
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-rating"></div>
                </div>
                <div className="skeleton skeleton-cuisine"></div>
                <div className="card-footer">
                  <div className="skeleton skeleton-meta"></div>
                  <div className="skeleton skeleton-meta"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="restaurant-list container">
        <div className="error-state">
          <h2>⚠️ Error loading restaurants</h2>
          <p>
            We're having trouble loading restaurants. Please try again later.
          </p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-list container">
      <div className="list-toolbar">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            flex: 1,
          }}
        >
          <div className="search-mode-selector list-selector">
            <label
              className={`mode-option ${
                searchMode === 'restaurant' ? 'active' : ''
              }`}
            >
              <input
                type="radio"
                name="searchMode"
                value="restaurant"
                checked={searchMode === 'restaurant'}
                onChange={(e) => updateSearchParam('mode', e.target.value)}
              />
              <span>Restaurants</span>
            </label>
            <label
              className={`mode-option ${searchMode === 'food' ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="searchMode"
                value="food"
                checked={searchMode === 'food'}
                onChange={(e) => updateSearchParam('mode', e.target.value)}
              />
              <span>Food / Menu</span>
            </label>
          </div>

          <div className="search-box-wrapper" ref={suggestionRef}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder={
                  searchMode === 'food'
                    ? 'Search for dishes (e.g. Biryani, Pizza)...'
                    : 'Search for restaurant names...'
                }
                value={localSearchTerm}
                onChange={(e) => {
                  setLocalSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchTrigger()}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestion-dropdown card shadow-premium">
                  {suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => {
                        setLocalSearchTerm(s);
                        handleSearchTrigger(s);
                      }}
                    >
                      <Search size={14} className="icon" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="btn-search-list"
              onClick={() => handleSearchTrigger()}
            >
              Search
            </button>
          </div>
        </div>

        <div
          className="toolbar-actions"
          style={{
            display: 'flex',
            gap: '10px',
            alignSelf: 'flex-end',
            marginBottom: '4px',
          }}
        >
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => updateSearchParam('sort', e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '30px',
              border: '1px solid #ddd',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <option value="recommended">Best Match</option>
            <option value="rating">Top Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
          </select>
        </div>
      </div>

      <div className="list-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1>Best restaurants in Karachi</h1>
          <span className="count-badge">
            {processedRestaurants.length} Restaurants
          </span>
        </div>
        <div className="categories-chips">
          {[
            'All',
            'Desi',
            'Fast Food',
            'Chinese',
            'BBQ',
            'Pizza',
            'Italian',
            'Desserts',
            'Beverages',
          ].map((cat) => (
            <button
              key={cat}
              className={activeCategory === cat ? 'active' : ''}
              onClick={() => updateSearchParam('category', cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="restaurant-grid">
        {processedRestaurants.length > 0 ? (
          processedRestaurants.map((res) => {
            const isClosed = res.status === 'closed'; // Assuming status field
            return (
              <Link
                to={isClosed ? '#' : `/restaurant/${res._id}`}
                key={res._id}
                className={`restaurant-card card ${isClosed ? 'closed' : ''}`}
                style={
                  isClosed
                    ? {
                        opacity: 0.6,
                        cursor: 'not-allowed',
                        filter: 'grayscale(1)',
                      }
                    : {}
                }
                onClick={(e) => isClosed && e.preventDefault()}
              >
                <div className="card-image">
                  <img
                    src={`${res.image}${res.image.includes('?') ? '&' : '?'}auto=format&fit=crop&w=600&q=60`}
                    alt={res.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60';
                    }}
                  />
                  <div className="delivery-badge">
                    {res.deliveryTime
                      ? `${res.deliveryTime} min`
                      : calculateDeliveryTime(5)}
                  </div>
                  {isClosed && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      Closed
                    </div>
                  )}
                </div>
                <div className="card-info">
                  <div className="title-row">
                    <h3>{res.name}</h3>
                    <div className="rating-pill">
                      <Star size={12} fill="currentColor" />
                      <span>{res.rating || 4.5}</span>
                    </div>
                  </div>
                  <p className="cuisine-tags">
                    {Array.isArray(res.cuisine)
                      ? res.cuisine.join(' • ')
                      : res.cuisine}
                  </p>
                  <div className="card-footer">
                    <div className="meta-info">
                      <Clock size={14} />
                      <span>
                        {res.deliveryFee === 0
                          ? 'Free delivery'
                          : 'Delivery: Rs. ' + res.deliveryFee}
                      </span>
                    </div>
                    <div className="meta-info price-meta">
                      <MapPin size={14} />
                      <span>{res.location?.address || 'View Map'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="no-results">
            <img
              src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&q=80"
              alt="No results"
            />
            <h2>No restaurants found</h2>
            <p>Try searching for something else or clear filters.</p>
            <button
              className="btn-primary"
              onClick={() => {
                setSearchParams({});
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
