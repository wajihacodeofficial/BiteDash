const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

dotenv.config();

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
  {
    name: 'Kababjees',
    cuisine: ['BBQ', 'Desi'],
    img: '1555939594-58d7cb561ad1',
  },
  {
    name: 'Kolachi',
    cuisine: ['Desi', 'BBQ'],
    img: '1517248135467-4c7edcad34c4',
  },
  {
    name: 'The Pancake Hall',
    cuisine: ['Desserts'],
    img: '1567620905732-2d1ec7bb7445',
  },
  {
    name: 'Bar.B.Q Tonight',
    cuisine: ['BBQ', 'Desi'],
    img: '1529193591184-b1d58069ecdd',
  },
  {
    name: 'Burger Lab',
    cuisine: ['Burgers'],
    img: '1568901346375-23c9450c58cd',
  },
  { name: 'Pizza Hut', cuisine: ['Pizza'], img: '1513104894114-bd75d644632b' },
  { name: 'Dominos', cuisine: ['Pizza'], img: '1604382354936-07c5d9983bd3' },
  {
    name: 'California Pizza',
    cuisine: ['Pizza'],
    img: '1571407970349-bc81e7e96d47',
  },
  {
    name: 'Ginsoy Extreme',
    cuisine: ['Chinese'],
    img: '1512058564366-18510be2db19',
  },
  {
    name: 'Chop Chop Wok',
    cuisine: ['Chinese'],
    img: '1541696490-8744a5db0228',
  },
  {
    name: 'Student Biryani',
    cuisine: ['Desi'],
    img: '1633945274405-b6c8069047b0',
  },
  {
    name: 'Javed Nihari',
    cuisine: ['Desi'],
    img: '1626074353765-517a681e40be',
  },
  {
    name: 'Waheed Kabab House',
    cuisine: ['BBQ'],
    img: '1601356616077-695728aa17ca',
  },
  { name: 'Tooso', cuisine: ['Fast Food'], img: '1604328698692-f76ea9498e76' },
  { name: "Xander's", cuisine: ['Italian'], img: '1551183053-bf91a1d81141' },
  {
    name: 'Espresso',
    cuisine: ['Beverages'],
    img: '1509042239860-f550ce710b93',
  },
  {
    name: "Butler's Chocolate Cafe",
    cuisine: ['Desserts'],
    img: '1541167760492-42129e92d770',
  },
  {
    name: "Lal's Patisserie",
    cuisine: ['Desserts'],
    img: '1488423152542-a9dc8fdccc70',
  },
  {
    name: 'Rosati Bistro',
    cuisine: ['Italian'],
    img: '1550966841-391adca06cf6',
  },
  { name: 'Cocochan', cuisine: ['Chinese'], img: '1525755662778-989d0cf2444b' },
  { name: 'Sakura', cuisine: ['Chinese'], img: '1553621042-f6e147245754' },
  { name: 'Fujiyama', cuisine: ['Chinese'], img: '1552611052-33e04de081de' },
  { name: 'The Deli', cuisine: ['Healthy'], img: '1556742044-3c52d6e88c62' },
  { name: 'Paramount', cuisine: ['Desi'], img: '1541544336-ef4efad17364' },
  { name: "Bundy's", cuisine: ['Burgers'], img: '1550547660-d9450f859349' },
  { name: 'Oh My Grill', cuisine: ['Burgers'], img: '1561758033-d89a9ad46330' },
  {
    name: 'The Sauce Burger Cafe',
    cuisine: ['Burgers'],
    img: '1571091718767-18b5b1457add',
  },
  {
    name: 'The Burger Shack',
    cuisine: ['Burgers'],
    img: '1512152272829-d31ae7983c1f',
  },
  { name: 'Stackers', cuisine: ['Burgers'], img: '1568901346375-23c9450c58cd' },
  {
    name: '2Guys1Grill',
    cuisine: ['Burgers'],
    img: '1586190848861-99246954a15a',
  },
  {
    name: 'Big Thick Burgerz',
    cuisine: ['Burgers'],
    img: '1550547660-d9450f859349',
  },
  {
    name: 'Kaybees',
    cuisine: ['Fast Food'],
    img: '1563729784404-f560bb5e6772',
  },
  { name: 'Hot n Spicy', cuisine: ['BBQ'], img: '1601356616077-695728aa17ca' },
  { name: 'Red Apple', cuisine: ['Beverages'], img: '1544145940-54ec90d7037b' },
  { name: 'Silver Spoon', cuisine: ['BBQ'], img: '1589187151000-830b07a51203' },
  { name: 'Afridi Inn', cuisine: ['BBQ'], img: '1560613204-747309993952' },
  {
    name: "Salt'n Pepper Village",
    cuisine: ['Desi'],
    img: '1562915309-8472506b3bc4',
  },
  {
    name: 'Zameer Ansari',
    cuisine: ['BBQ'],
    img: '1599487488170-eb11ec908511',
  },
  {
    name: 'Ghaffar Kabab House',
    cuisine: ['BBQ'],
    img: '1513530534521-003201a5ae7b',
  },
  {
    name: 'Meerut Kabab House',
    cuisine: ['BBQ'],
    img: '1548811824-70659aed7f83',
  },
  { name: 'Hanifia', cuisine: ['Fast Food'], img: '1559461670-f451f15d325a' },
  {
    name: 'Pioneer House',
    cuisine: ['Fast Food'],
    img: '1591142281134-8da903513337',
  },
  {
    name: 'Dunkin Donuts',
    cuisine: ['Desserts'],
    img: '1551024506-0bccd828d307',
  },
  {
    name: 'Cinnabon',
    cuisine: ['Desserts'],
    img: '1509365465328-3e41ba96cb07',
  },
  {
    name: 'Second Cup',
    cuisine: ['Beverages'],
    img: '1541167760492-42129e92d770',
  },
  {
    name: "Gloria Jean's",
    cuisine: ['Beverages'],
    img: '1513558161293-cdaf765ed2fd',
  },
  {
    name: 'Movenpick',
    cuisine: ['Desserts'],
    img: '1501443762402-c7d476f5a0ac',
  },
  {
    name: 'Pearl Continental',
    cuisine: ['Continental'],
    img: '1514362545857-3bc16c4c7d1b',
  },
  {
    name: 'Avari Towers',
    cuisine: ['Continental'],
    img: '1504674900247-0877df9cc836',
  },
  {
    name: 'Dreamworld Resort',
    cuisine: ['Continental'],
    img: '1555939594-58d7cb561ad1',
  },
];

const CUISINE_ITEMS = {
  BBQ: [
    { name: 'Beef Seekh Kabab', img: '1513530534521-003201a5ae7b' },
    { name: 'Chicken Malai Boti', img: '1529193591184-b1d58069ecdd' },
    { name: 'Mutton Chops', img: '1560613204-747309993952' },
    { name: 'Beef Bihari Kabab', img: '1544025162-d76690b6d029' },
    { name: 'Chicken Gola Kabab', img: '1599487488170-eb11ec908511' },
  ],
  Desi: [
    { name: 'Chicken Biryani', img: '1633945274405-b6c8069047b0' },
    { name: 'Special Nihari', img: '1626074353765-517a681e40be' },
    { name: 'Chicken Karahi', img: '1626074353765-517a681e40be' },
    { name: 'Daal Mash', img: '1617692855027-33b14f061079' },
    { name: 'Palak Paneer', img: '1601356616077-695728aa17ca' },
  ],
  Burgers: [
    { name: 'Zinger Burger', img: '1561758033-d89a9ad46330' },
    { name: 'Mushroom Swiss', img: '1586190848861-99246954a15a' },
    { name: 'Classic Beef', img: '1568901346375-23c9450c58cd' },
    { name: 'Jalapeno Burger', img: '1571091718767-18b5b1457add' },
    { name: 'Smashed Patty', img: '1550547660-d9450f859349' },
  ],
  Pizza: [
    { name: 'Tikka Pizza', img: '1513104894114-bd75d644632b' },
    { name: 'Fajita Pizza', img: '1604382354936-07c5d9983bd3' },
    { name: 'Deep Dish', img: '1571407970349-bc81e7e96d47' },
    { name: 'Margherita', img: '1565299624946-b28f40a0ae38' },
    { name: 'Pepperoni Feast', img: '1458642849426-cfb724f15ef7' },
  ],
  Chinese: [
    { name: 'Manchurian', img: '1512058564366-18510be2db19' },
    { name: 'Fried Rice', img: '1541696490-8744a5db0228' },
    { name: 'Chowmein', img: '1525755662778-989d0cf2444b' },
    { name: 'Beef Chili Dry', img: '1562707731-10d68f23472b' },
    { name: 'Wontons', img: '1552611052-33e04de081de' },
  ],
  Desserts: [
    { name: 'Chocolate Cake', img: '1551024506-0bccd828d307' },
    { name: 'Glazed Donuts', img: '1551024506-0bccd828d307' },
    { name: 'Swiss Rolls', img: '1488423152542-a9dc8fdccc70' },
    { name: 'Pancakes', img: '1567620905732-2d1ec7bb7445' },
    { name: 'Ice Cream Cup', img: '1501443762402-c7d476f5a0ac' },
  ],
  Beverages: [
    { name: 'Iced Coffee', img: '1509042239860-f550ce710b93' },
    { name: 'Mint Margarita', img: '1551024709-8f23befc6f87' },
    { name: 'Hot Tea', img: '1513558161293-cdaf765ed2fd' },
    { name: 'Cappuccino', img: '1541167760492-42129e92d770' },
    { name: 'Cold Drink', img: '1544145940-54ec90d7037b' },
  ],
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      'Connected to MongoDB for Ultimate Karachi Delivery Seeding...'
    );

    await Restaurant.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared DB. Creating users...');
    const users = [
      {
        name: 'Karachi Admin',
        email: 'admin@bitedash.com',
        password: 'qwerty123456',
        role: 'admin',
      },
      {
        name: 'Rider Karachi',
        email: 'rider@bitedash.com',
        password: 'qwerty123456',
        role: 'rider',
      },
      {
        name: 'Wajiha',
        email: 'wajihacodeofficial@gmail.com',
        password: 'Wajiha1514',
        role: 'customer',
      },
    ];

    for (const u of users) {
      await User.create(u);
    }
    const admin = await User.findOne({ email: 'admin@bitedash.com' });

    console.log('Generating 50 Unique Karachi Restaurants...');
    const restaurants = [];

    for (let i = 0; i < RESTAURANTS_DATA.length; i++) {
      const area = AREAS[i % AREAS.length];
      const res = RESTAURANTS_DATA[i];

      const jitterLat = (Math.random() - 0.5) * 0.012;
      const jitterLng = (Math.random() - 0.5) * 0.012;

      const menu = [];
      const primaryCuisine = res.cuisine[0];
      const menuPool =
        CUISINE_ITEMS[primaryCuisine] ||
        CUISINE_ITEMS['Fast Food'] ||
        CUISINE_ITEMS['Desi'];

      // Generate 25 items for each restaurant
      for (let j = 0; j < 25; j++) {
        const itemTemplate = menuPool[j % menuPool.length];
        menu.push({
          name: `${itemTemplate.name} ${j + 1 > menuPool.length ? `(Style ${Math.floor(j / menuPool.length) + 1})` : ''}`,
          price: Math.floor(Math.random() * 800) + 300,
          description: `A delicious selection of our finest ${itemTemplate.name.toLowerCase()}, made fresh daily.`,
          category: primaryCuisine,
          image: `https://images.unsplash.com/photo-${itemTemplate.img}`,
          isAvailable: true,
        });
      }

      restaurants.push({
        ownerId: admin._id,
        name: res.name,
        cuisine: res.cuisine,
        rating: (4.1 + Math.random() * 0.8).toFixed(1),
        numRatings: Math.floor(Math.random() * 3000) + 100,
        deliveryTime: Math.floor(Math.random() * 20) + 25,
        image: `https://images.unsplash.com/photo-${res.img}`,
        status: 'open',
        location: {
          type: 'Point',
          coordinates: [area.lng + jitterLng, area.lat + jitterLat],
          address: `${area.name}, Karachi`,
        },
        menu: menu,
      });
    }

    await Restaurant.insertMany(restaurants);
    console.log(
      '✓ Successfully seeded 50 unique restaurants with relevant item photos!'
    );
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
