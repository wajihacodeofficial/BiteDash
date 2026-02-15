const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

const AREAS = [
  { name: 'Clifton', lat: 24.81, lng: 67.03 },
  { name: 'DHA Phase 6', lat: 24.8, lng: 67.06 },
  { name: 'Gulshan-e-Iqbal', lat: 24.92, lng: 67.09 },
  { name: 'North Nazimabad', lat: 24.94, lng: 67.04 },
  { name: 'Saddar', lat: 24.86, lng: 67.01 },
  { name: 'PECHS', lat: 24.87, lng: 67.05 },
  { name: 'Bahadurabad', lat: 24.88, lng: 67.07 },
  { name: 'Defence View', lat: 24.85, lng: 67.08 },
  { name: 'Korangi', lat: 24.83, lng: 67.12 },
  { name: 'Malir Cantt', lat: 24.94, lng: 67.2 },
];

const RESTAURANTS_DATA = [
  { name: 'Kababjees', cuisine: ['BBQ', 'Desi'], img: '1555939594-58d7cb561ad1' },
  { name: 'Kolachi', cuisine: ['Desi', 'BBQ'], img: '1517248135467-4c7edcad34c4' },
  { name: 'The Pancake Hall', cuisine: ['Desserts'], img: '1567620905732-2d1ec7bb7445' },
  { name: 'Burger Lab', cuisine: ['Burgers'], img: '1568901346375-23c9450c58cd' },
  { name: 'Pizza Hut', cuisine: ['Pizza'], img: '1513104894114-bd75d644632b' },
];

const seedDB = async () => {
  console.log('Seeding Production DB...');
  await Restaurant.deleteMany({});
  await User.deleteMany({});

  const users = [
    { name: 'Karachi Admin', email: 'admin@bitedash.com', password: 'qwerty123456', role: 'admin' },
    { name: 'Wajiha', email: 'wajihacodeofficial@gmail.com', password: 'Wajiha1514', role: 'customer' },
  ];

  for (const u of users) {
    await User.create(u);
  }

  const admin = await User.findOne({ email: 'admin@bitedash.com' });
  const restaurants = [];

  for (let i = 0; i < RESTAURANTS_DATA.length; i++) {
    const area = AREAS[i % AREAS.length];
    const res = RESTAURANTS_DATA[i];

    restaurants.push({
      ownerId: admin._id,
      name: res.name,
      cuisine: res.cuisine,
      rating: 4.5,
      numRatings: 100,
      deliveryTime: 30,
      image: `https://images.unsplash.com/photo-${res.img}`,
      status: 'open',
      location: {
        type: 'Point',
        coordinates: [area.lng, area.lat],
        address: `${area.name}, Karachi`,
      },
      menu: [],
    });
  }

  await Restaurant.insertMany(restaurants);
  console.log('Successfully seeded!');
};

module.exports = seedDB;
