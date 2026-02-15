const Restaurant = require('../models/Restaurant');

const getAllRestaurants = async (req, res) => {
  try {
    const { lat, lng, radius, search } = req.query;

    let pipeline = [];
    const hasLocation = lat && lng;

    // 1. Geospatial Query (Must be first in pipeline)
    if (hasLocation) {
      const maxDistanceInMeters =
        (radius || process.env.MAX_SEARCH_RADIUS_KM || 10) * 1000;

      pipeline.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: 'distance',
          maxDistance: maxDistanceInMeters,
          query: { status: 'open' },
          spherical: true,
        },
      });

      // Verification: If geoNear might return 0 results due to radius, we could add a fallback logic,
      // but increasing the default radius on frontend is usually better.
      // For now, let's just make sure we sort them properly.
    } else {
      // If no location, just show open ones (fallback)
      pipeline.push({ $match: { status: 'open' } });
      pipeline.push({
        $addFields: {
          deliveryTimeRange: '25-35 min',
          calculatedDeliveryTime: 30,
        },
      });
    }

    // 2. Text Search (Optional)
    if (search) {
      const searchMode = req.query.searchMode || 'restaurant';
      if (searchMode === 'food') {
        pipeline.push({
          $match: {
            'menu.name': { $regex: search, $options: 'i' },
          },
        });
      } else {
        pipeline.push({
          $match: {
            name: { $regex: search, $options: 'i' },
          },
        });
      }
    }

    // 3. Calculate delivery time (Only if location is available)
    if (hasLocation) {
      pipeline.push({
        $addFields: {
          calculatedDeliveryTime: {
            $let: {
              vars: {
                distanceKm: { $divide: ['$distance', 1000] },
                basePrepTime: 15,
                distanceTime: {
                  $multiply: [{ $divide: ['$distance', 1000] }, 2],
                }, // 2 min per km
                trafficBuffer: {
                  $add: [5, 5],
                }, // Fixed 10 min buffer for backend stability
              },
              in: {
                $add: ['$$basePrepTime', '$$distanceTime', '$$trafficBuffer'],
              },
            },
          },
        },
      });

      // Format delivery time as range
      pipeline.push({
        $addFields: {
          deliveryTimeRange: {
            $let: {
              vars: {
                baseTime: '$calculatedDeliveryTime',
                minTime: {
                  $max: [
                    15,
                    { $floor: { $multiply: ['$calculatedDeliveryTime', 0.9] } },
                  ],
                },
                maxTime: {
                  $ceil: { $multiply: ['$calculatedDeliveryTime', 1.1] },
                },
              },
              in: {
                $concat: [
                  { $toString: '$$minTime' },
                  '-',
                  { $toString: '$$maxTime' },
                  ' min',
                ],
              },
            },
          },
        },
      });

      // Sort by distance if location provided
      pipeline.push({
        $sort: {
          distance: 1,
          rating: -1,
          calculatedDeliveryTime: 1,
        },
      });
    } else {
      // Fallback fields if no location
      pipeline.push({
        $addFields: {
          deliveryTimeRange: '30-45 min', // Default
          distance: null,
        },
      });

      // Sort by rating if no location
      pipeline.push({
        $sort: {
          rating: -1,
        },
      });
    }

    // If using aggregation, we lose Mongoose virtuals unless we hydrate,
    // but for list view raw JSON is usually fine and faster.
    let restaurants = await Restaurant.aggregate(pipeline);

    // Fallback: If location-based search yields no results (user is far away), return all open restaurants
    if (restaurants.length === 0 && hasLocation) {
      console.log('No restaurants found near location. Using fallback.');
      restaurants = await Restaurant.aggregate([
        { $match: { status: 'open' } },
        {
          $addFields: {
            deliveryTimeRange: '30-45 min',
            calculatedDeliveryTime: 30,
            distance: null,
          },
        },
        { $sort: { rating: -1 } },
        { $limit: 50 },
      ]);
    }

    res.json(restaurants);
  } catch (error) {
    console.error('Error in getAllRestaurants:', error);
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const { q, mode } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const searchSet = new Set();
    const regex = new RegExp(q, 'i');

    if (mode === 'food') {
      // 1. Match Menu Item Names
      const menuResults = await Restaurant.aggregate([
        { $unwind: '$menu' },
        { $match: { 'menu.name': regex } },
        { $group: { _id: '$menu.name' } },
        { $limit: 10 },
      ]);
      menuResults.forEach((r) => searchSet.add(r._id));

      // 2. Match Categories (In food mode, categories like 'Biryani' or 'Pizza' are relevant)
      const catResults = await Restaurant.aggregate([
        { $unwind: '$menu' },
        { $match: { 'menu.category': regex } },
        { $group: { _id: '$menu.category' } },
        { $limit: 5 },
      ]);
      catResults.forEach((r) => searchSet.add(r._id));
    } else {
      // 1. Match Restaurant Names
      const resResults = await Restaurant.find({ name: regex })
        .select('name')
        .limit(10);
      resResults.forEach((r) => searchSet.add(r.name));

      // 2. Match Cuisines
      const cuisineResults = await Restaurant.find({ cuisine: regex })
        .select('cuisine')
        .limit(5);
      cuisineResults.forEach((r) => {
        r.cuisine.forEach((c) => {
          if (regex.test(c)) searchSet.add(c);
        });
      });
    }

    res.json(Array.from(searchSet).slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      ownerId: req.user.id,
    });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getSuggestions,
  createRestaurant,
};
