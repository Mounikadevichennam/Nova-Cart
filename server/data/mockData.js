// NOVA CART Seed & Expanded Dataset
// Represents 620 Partner Stores across Mumbai, Bengaluru & Delhi NCR + Expanded Real Product Catalog

export const mockCategories = [
  {
    id: "cat-1",
    name: "Atta, Rice & Dal",
    slug: "atta-rice-dal",
    icon_name: "Wheat",
    description: "Flours, premium rice varieties, pulses and lentils"
  },
  {
    id: "cat-2",
    name: "Dairy, Eggs & Bread",
    slug: "dairy-eggs-bread",
    icon_name: "Milk",
    description: "Fresh milk, butter, cheese, bread and eggs"
  },
  {
    id: "cat-3",
    name: "Fresh Fruits & Veggies",
    slug: "fruits-vegetables",
    icon_name: "Apple",
    description: "Farm fresh vegetables and seasonal fruits"
  },
  {
    id: "cat-4",
    name: "Oil, Ghee & Masalas",
    slug: "oil-ghee-masalas",
    icon_name: "Flame",
    description: "Cooking oils, pure ghee, spices and condiments"
  },
  {
    id: "cat-5",
    name: "Snacks & Beverages",
    slug: "snacks-beverages",
    icon_name: "Coffee",
    description: "Tea, coffee, biscuits, chips and refreshments"
  },
  {
    id: "cat-6",
    name: "Cleaning & Household",
    slug: "cleaning-household",
    icon_name: "Sparkles",
    description: "Detergents, surface cleaners and dishwashing liquids"
  },
  {
    id: "cat-7",
    name: "Personal Care & Hygiene",
    slug: "personal-care",
    icon_name: "Heart",
    description: "Soaps, shampoos, toothpaste and grooming essentials"
  },
  {
    id: "cat-8",
    name: "Packaged Foods & Noodles",
    slug: "packaged-foods",
    icon_name: "Package",
    description: "Instant noodles, pasta, sauces and breakfast cereals"
  }
];

// Seeded 620 Partner Store Network Representation across 3 Indian Cities
const generateStoreNetwork = () => {
  const primaryStores = [
    {
      id: "store-1",
      name: "Subhash Stores",
      area: "Andheri East",
      city: "Mumbai",
      owner_name: "Subhash Chandra",
      address: "Shop 14, Marol Naka, Andheri East, Mumbai 400059",
      phone: "+91 98201 44512",
      rating: 4.8,
      delivery_time_mins: 18,
      is_active: true,
      total_products: 248,
      available_products: 210,
      low_stock_products: 23,
      out_of_stock_products: 15
    },
    {
      id: "store-2",
      name: "Fresh Mart",
      area: "Koramangala",
      city: "Bengaluru",
      owner_name: "Kiran Kumar",
      address: "80 Feet Road, 4th Block, Koramangala, Bengaluru 560034",
      phone: "+91 98450 11223",
      rating: 4.7,
      delivery_time_mins: 22,
      is_active: true,
      total_products: 230,
      available_products: 195,
      low_stock_products: 21,
      out_of_stock_products: 14
    },
    {
      id: "store-3",
      name: "SuperBazaar",
      area: "Indiranagar",
      city: "Bengaluru",
      owner_name: "Anita Rao",
      address: "100 Feet Road, Indiranagar, Bengaluru 560038",
      phone: "+91 99002 33445",
      rating: 4.6,
      delivery_time_mins: 25,
      is_active: true,
      total_products: 215,
      available_products: 180,
      low_stock_products: 22,
      out_of_stock_products: 13
    },
    {
      id: "store-4",
      name: "Metro Provisions",
      area: "Connaught Place",
      city: "Delhi NCR",
      owner_name: "Rajeev Gupta",
      address: "Block B, Connaught Place, New Delhi 110001",
      phone: "+91 98110 55667",
      rating: 4.9,
      delivery_time_mins: 20,
      is_active: true,
      total_products: 260,
      available_products: 225,
      low_stock_products: 20,
      out_of_stock_products: 15
    },
    {
      id: "store-5",
      name: "Ganesh Supermarket",
      area: "Bandra West",
      city: "Mumbai",
      owner_name: "Ganesh Shetty",
      address: "Hill Road, Bandra West, Mumbai 400050",
      phone: "+91 98205 77889",
      rating: 4.5,
      delivery_time_mins: 19,
      is_active: true,
      total_products: 198,
      available_products: 170,
      low_stock_products: 18,
      out_of_stock_products: 10
    },
    {
      id: "store-6",
      name: "Nandi Kirana",
      area: "HSR Layout",
      city: "Bengaluru",
      owner_name: "Srinivas Nandi",
      address: "Sector 2, HSR Layout, Bengaluru 560102",
      phone: "+91 98455 33221",
      rating: 4.4,
      delivery_time_mins: 24,
      is_active: true,
      total_products: 185,
      available_products: 155,
      low_stock_products: 19,
      out_of_stock_products: 11
    },
    {
      id: "store-7",
      name: "Capital HyperMart",
      area: "Sector 18",
      city: "Delhi NCR",
      owner_name: "Vikas Sharma",
      address: "Sector 18 Market, Noida 201301",
      phone: "+91 98100 44332",
      rating: 4.7,
      delivery_time_mins: 21,
      is_active: true,
      total_products: 240,
      available_products: 205,
      low_stock_products: 23,
      out_of_stock_products: 12
    },
    {
      id: "store-8",
      name: "Apex Provisions",
      area: "DLF Phase 4",
      city: "Delhi NCR",
      owner_name: "Aman Agarwal",
      address: "DLF Phase 4, Gurgaon 122002",
      phone: "+91 98109 88776",
      rating: 4.3,
      delivery_time_mins: 26,
      is_active: false, // Inactive example store
      total_products: 160,
      available_products: 120,
      low_stock_products: 25,
      out_of_stock_products: 15
    }
  ];

  // Dynamically seed remaining up to 620 store summaries distributed across Mumbai (240), Bengaluru (210), Delhi NCR (170)
  const areasMumbai = ["Andheri East", "Bandra West", "Powai", "Dadar", "Thane West", "Navi Mumbai", "Malad West", "Borivali", "Goregaon", "Juhu", "Kurla", "Chembur"];
  const areasBengaluru = ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Jayanagar", "JP Nagar", "Marathahalli", "Electronic City", "Bellandur", "Malleshwaram"];
  const areasDelhi = ["Connaught Place", "Sector 18 Noida", "DLF Phase 4 Gurgaon", "South Ext", "Dwarka Sec 10", "Vasant Kunj", "Saket", "Lajpat Nagar", "Rohini Sec 7"];

  const storeNames = ["SuperMart", "Kirana Express", "Daily Needs", "Bazaar 365", "Fresh Choice", "City Provisions", "Town Mart", "Local Grocer", "Smart Choice", "Prime Supermarket"];

  const generatedList = [...primaryStores];

  let currentId = 9;
  const targetTotal = 620;

  // Mumbai target = 240
  for (let i = generatedList.filter(s => s.city === 'Mumbai').length; i < 240; i++) {
    const area = areasMumbai[i % areasMumbai.length];
    const name = `${storeNames[i % storeNames.length]} — ${area}`;
    generatedList.push({
      id: `store-${currentId++}`,
      name,
      area,
      city: "Mumbai",
      owner_name: `Owner ${i + 1}`,
      address: `Shop ${i + 10}, ${area}, Mumbai`,
      phone: `+91 98200 ${10000 + i}`,
      rating: +(4.1 + (i % 9) * 0.1).toFixed(1),
      delivery_time_mins: 15 + (i % 12),
      is_active: i % 19 !== 0,
      total_products: 180 + (i % 80),
      available_products: 150 + (i % 60),
      low_stock_products: 12 + (i % 15),
      out_of_stock_products: 8 + (i % 10)
    });
  }

  // Bengaluru target = 210
  for (let i = generatedList.filter(s => s.city === 'Bengaluru').length; i < 210; i++) {
    const area = areasBengaluru[i % areasBengaluru.length];
    const name = `${storeNames[i % storeNames.length]} — ${area}`;
    generatedList.push({
      id: `store-${currentId++}`,
      name,
      area,
      city: "Bengaluru",
      owner_name: `Owner ${i + 1}`,
      address: `Shop ${i + 10}, ${area}, Bengaluru`,
      phone: `+91 98450 ${10000 + i}`,
      rating: +(4.2 + (i % 8) * 0.1).toFixed(1),
      delivery_time_mins: 18 + (i % 10),
      is_active: i % 23 !== 0,
      total_products: 175 + (i % 85),
      available_products: 145 + (i % 65),
      low_stock_products: 10 + (i % 14),
      out_of_stock_products: 6 + (i % 12)
    });
  }

  // Delhi NCR target = 170
  for (let i = generatedList.filter(s => s.city === 'Delhi NCR').length; i < 170; i++) {
    const area = areasDelhi[i % areasDelhi.length];
    const name = `${storeNames[i % storeNames.length]} — ${area}`;
    generatedList.push({
      id: `store-${currentId++}`,
      name,
      area,
      city: "Delhi NCR",
      owner_name: `Owner ${i + 1}`,
      address: `Block ${i + 1}, ${area}, Delhi NCR`,
      phone: `+91 98110 ${10000 + i}`,
      rating: +(4.3 + (i % 7) * 0.1).toFixed(1),
      delivery_time_mins: 17 + (i % 11),
      is_active: i % 17 !== 0,
      total_products: 190 + (i % 70),
      available_products: 160 + (i % 50),
      low_stock_products: 15 + (i % 12),
      out_of_stock_products: 9 + (i % 9)
    });
  }

  return generatedList;
};

export const mockStores = generateStoreNetwork();

export const mockUsers = [
  {
    id: "user-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    role: "customer",
    city: "Mumbai",
    address: "Flat 402, Green Meadows, Marol, Andheri East, Mumbai 400059",
    store_id: null
  },
  {
    id: "user-2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 98765 88990",
    role: "customer",
    city: "Bengaluru",
    address: "12th Cross, 3rd Block, Koramangala, Bengaluru 560034",
    store_id: null
  },
  {
    id: "user-mgr-1",
    name: "Vikram Singh (Store Mgr)",
    email: "manager.subhash@novacart.in",
    phone: "+91 98200 99887",
    role: "store_manager",
    city: "Mumbai",
    address: "Subhash Stores, Andheri East",
    store_id: "store-1"
  },
  {
    id: "user-admin-1",
    name: "Aditya Verma (Network Admin)",
    email: "admin.network@novacart.in",
    phone: "+91 98100 11223",
    role: "admin",
    city: "Mumbai",
    address: "NOVA CART HQ, BKC, Mumbai",
    store_id: null
  }
];

// Expanded Realistic Product Catalog with Guaranteed High-Quality Unsplash Image URLs & Fallbacks
export const mockProducts = [
  // Category 1: Atta, Rice & Dal (cat-1)
  {
    id: "prod-1",
    name: "Aashirvaad Whole Wheat Atta",
    brand: "Aashirvaad",
    category_id: "cat-1",
    category_name: "Atta, Rice & Dal",
    description: "100% pure MP chakki fresh whole wheat flour, fiber-rich and soft rotis.",
    unit: "5 kg",
    price: 260.00,
    original_price: 295.00,
    discount_percent: 12,
    image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    tags: ["atta", "flour", "wheat", "chakki", "staple"],
    frequently_bought_with: ["prod-4", "prod-16", "prod-7"]
  },
  {
    id: "prod-2",
    name: "Fortune Chakki Fresh Atta",
    brand: "Fortune",
    category_id: "cat-1",
    category_name: "Atta, Rice & Dal",
    description: "Made from finest grain wheat, traditional stone ground for wholesome taste.",
    unit: "5 kg",
    price: 245.00,
    original_price: 280.00,
    discount_percent: 13,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    tags: ["atta", "flour", "wheat", "chakki", "staple"],
    frequently_bought_with: ["prod-4", "prod-15"]
  },
  {
    id: "prod-3",
    name: "Pillsbury Chakki Fresh Atta",
    brand: "Pillsbury",
    category_id: "cat-1",
    category_name: "Atta, Rice & Dal",
    description: "100% natural wheat grains, stays soft for up to 6 hours.",
    unit: "5 kg",
    price: 255.00,
    original_price: 290.00,
    discount_percent: 12,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    tags: ["atta", "flour", "wheat", "pillsbury"],
    frequently_bought_with: ["prod-4"]
  },
  {
    id: "prod-4",
    name: "Tata Salt Vacuum Evaporated",
    brand: "Tata",
    category_id: "cat-1",
    category_name: "Atta, Rice & Dal",
    description: "Iodized salt essential for daily health and cooking purity.",
    unit: "1 kg",
    price: 28.00,
    original_price: 30.00,
    discount_percent: 7,
    image_url: "https://images.unsplash.com/photo-1518110168401-f2847c210565?auto=format&fit=crop&w=600&q=80",
    tags: ["salt", "tata", "iodized", "cooking"],
    frequently_bought_with: ["prod-1", "prod-5", "prod-6"]
  },
  {
    id: "prod-5",
    name: "India Gate Sona Masoori Rice",
    brand: "India Gate",
    category_id: "cat-1",
    category_name: "Atta, Rice & Dal",
    description: "Lightweight aromatic rice grains, ideal for daily meals and dal rice.",
    unit: "5 kg",
    price: 380.00,
    original_price: 430.00,
    discount_percent: 11,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    tags: ["rice", "sona masoori", "india gate", "grains"],
    frequently_bought_with: ["prod-6", "prod-15"]
  },
  {
    id: "prod-6",
    name: "Tata Sampann Toor / Arhar Dal",
    brand: "Tata Sampann",
    category_id: "cat-1",
    category_name: "Atta, Rice & Dal",
    description: "Unpolished yellow split pigeon peas, high protein content.",
    unit: "1 kg",
    price: 165.00,
    original_price: 185.00,
    discount_percent: 11,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    tags: ["dal", "toor dal", "pulses", "protein"],
    frequently_bought_with: ["prod-5", "prod-4", "prod-16"]
  },
  {
    id: "prod-6b",
    name: "Fortune Premium Moong Dal",
    brand: "Fortune",
    category_id: "cat-1",
    category_name: "Atta, Rice & Dal",
    description: "Unpolished yellow moong dal, easy to digest and rich in iron.",
    unit: "1 kg",
    price: 145.00,
    original_price: 160.00,
    discount_percent: 9,
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    tags: ["dal", "moong dal", "fortune"],
    frequently_bought_with: ["prod-4", "prod-5"]
  },

  // Category 2: Dairy, Eggs & Bread (cat-2)
  {
    id: "prod-7",
    name: "Amul Taaza Toned Fresh Milk",
    brand: "Amul",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "Pasteurised toned milk with 3.0% fat, fresh morning batch.",
    unit: "1 L",
    price: 54.00,
    original_price: 56.00,
    discount_percent: 4,
    image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    tags: ["milk", "dairy", "amul", "taaza"],
    frequently_bought_with: ["prod-11", "prod-12", "prod-19"]
  },
  {
    id: "prod-8",
    name: "Amul Gold Full Cream Milk",
    brand: "Amul",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "Pasteurised full cream milk with 6.0% fat content for tea, coffee & sweets.",
    unit: "1 L",
    price: 66.00,
    original_price: 68.00,
    discount_percent: 3,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    tags: ["milk", "full cream", "amul gold", "dairy"],
    frequently_bought_with: ["prod-11", "prod-19"]
  },
  {
    id: "prod-9",
    name: "Nandini GoodLife Toned Milk",
    brand: "Nandini",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "UHT treated long life toned milk pouch, rich in natural vitamins.",
    unit: "1 L",
    price: 52.00,
    original_price: 55.00,
    discount_percent: 5,
    image_url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    tags: ["milk", "nandini", "toned milk", "uht"],
    frequently_bought_with: ["prod-11", "prod-12"]
  },
  {
    id: "prod-10",
    name: "Mother Dairy Toned Milk",
    brand: "Mother Dairy",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "Homogenized pasteurised toned milk, fortified with Vitamin A & D.",
    unit: "1 L",
    price: 53.00,
    original_price: 56.00,
    discount_percent: 5,
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    tags: ["milk", "mother dairy", "toned milk"],
    frequently_bought_with: ["prod-11", "prod-12"]
  },
  {
    id: "prod-11",
    name: "Britannia Brown Bread 100% Whole Wheat",
    brand: "Britannia",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "Soft healthy whole wheat loaf packed with dietary fiber.",
    unit: "400 g",
    price: 50.00,
    original_price: 55.00,
    discount_percent: 9,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    tags: ["bread", "brown bread", "whole wheat", "breakfast"],
    frequently_bought_with: ["prod-7", "prod-12", "prod-13"]
  },
  {
    id: "prod-12",
    name: "Amul Pasteurised Salted Butter",
    brand: "Amul",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "Delicious iconic yellow butter pasteurised with pure milk cream.",
    unit: "100 g",
    price: 58.00,
    original_price: 60.00,
    discount_percent: 3,
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
    tags: ["butter", "amul", "dairy", "spread"],
    frequently_bought_with: ["prod-11", "prod-7"]
  },
  {
    id: "prod-13",
    name: "Farm Fresh White Eggs",
    brand: "Local Farm",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "Protein-packed clean white eggs sourced daily from certified farms.",
    unit: "6 pcs",
    price: 48.00,
    original_price: 54.00,
    discount_percent: 11,
    image_url: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80",
    tags: ["eggs", "farm fresh", "protein", "breakfast"],
    frequently_bought_with: ["prod-11", "prod-7"]
  },
  {
    id: "prod-13b",
    name: "Amul Malai Paneer Block",
    brand: "Amul",
    category_id: "cat-2",
    category_name: "Dairy, Eggs & Bread",
    description: "Rich and creamy fresh cottage cheese block for curries and snacks.",
    unit: "200 g",
    price: 92.00,
    original_price: 98.00,
    discount_percent: 6,
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
    tags: ["paneer", "cottage cheese", "amul"],
    frequently_bought_with: ["prod-14", "prod-14a"]
  },

  // Category 3: Fresh Fruits & Veggies (cat-3)
  {
    id: "prod-14",
    name: "Fresh Hybrid Tomato",
    brand: "Farm Fresh",
    category_id: "cat-3",
    category_name: "Fresh Fruits & Veggies",
    description: "Firm, red juicy tomatoes harvested fresh every morning.",
    unit: "1 kg",
    price: 36.00,
    original_price: 45.00,
    discount_percent: 20,
    image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    tags: ["tomato", "veggies", "fresh", "organic"],
    frequently_bought_with: ["prod-14a", "prod-14b"]
  },
  {
    id: "prod-14a",
    name: "Fresh Red Onion",
    brand: "Farm Fresh",
    category_id: "cat-3",
    category_name: "Fresh Fruits & Veggies",
    description: "Crisp red onions essential for Indian gravies and salads.",
    unit: "1 kg",
    price: 42.00,
    original_price: 50.00,
    discount_percent: 16,
    image_url: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80",
    tags: ["onion", "veggies", "staple"],
    frequently_bought_with: ["prod-14", "prod-14b"]
  },
  {
    id: "prod-14b",
    name: "Fresh New Crop Potato",
    brand: "Farm Fresh",
    category_id: "cat-3",
    category_name: "Fresh Fruits & Veggies",
    description: "Clean skin medium sized potatoes ideal for boiling and frying.",
    unit: "1 kg",
    price: 30.00,
    original_price: 35.00,
    discount_percent: 14,
    image_url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    tags: ["potato", "veggies", "staple"],
    frequently_bought_with: ["prod-14", "prod-14a"]
  },
  {
    id: "prod-14c",
    name: "Fresh Robusta Banana",
    brand: "Farm Fresh",
    category_id: "cat-3",
    category_name: "Fresh Fruits & Veggies",
    description: "Naturally ripened sweet Robusta bananas, energy booster.",
    unit: "1 kg (approx 6 pcs)",
    price: 55.00,
    original_price: 65.00,
    discount_percent: 15,
    image_url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    tags: ["banana", "fruits", "banana"],
    frequently_bought_with: ["prod-7", "prod-11"]
  },

  // Category 4: Oil, Ghee & Masalas (cat-4)
  {
    id: "prod-15",
    name: "Fortune Sunlite Sunflower Oil",
    brand: "Fortune",
    category_id: "cat-4",
    category_name: "Oil, Ghee & Masalas",
    description: "Refined sunflower oil enriched with Vitamin A & D for healthy cooking.",
    unit: "1 L",
    price: 152.00,
    original_price: 175.00,
    discount_percent: 13,
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    tags: ["oil", "sunflower oil", "fortune", "cooking"],
    frequently_bought_with: ["prod-1", "prod-4", "prod-6"]
  },
  {
    id: "prod-16",
    name: "Saffola Gold Edible Cooking Oil",
    brand: "Saffola",
    category_id: "cat-4",
    category_name: "Oil, Ghee & Masalas",
    description: "Blended rice bran and sunflower oil with dual-seed technology for heart health.",
    unit: "1 L",
    price: 168.00,
    original_price: 190.00,
    discount_percent: 12,
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    tags: ["oil", "saffola", "cooking oil", "healthy"],
    frequently_bought_with: ["prod-1", "prod-6"]
  },
  {
    id: "prod-17",
    name: "Gemini Refined Sunflower Oil",
    brand: "Gemini",
    category_id: "cat-4",
    category_name: "Oil, Ghee & Masalas",
    description: "Light sunflower oil containing Nutri-V compute for everyday frying.",
    unit: "1 L",
    price: 148.00,
    original_price: 168.00,
    discount_percent: 12,
    image_url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    tags: ["oil", "gemini", "sunflower oil"],
    frequently_bought_with: ["prod-1"]
  },
  {
    id: "prod-18",
    name: "Amul Pure Cow Ghee",
    brand: "Amul",
    category_id: "cat-4",
    category_name: "Oil, Ghee & Masalas",
    description: "Aromatic granular texture pure cow ghee in tin packaging.",
    unit: "500 ml",
    price: 315.00,
    original_price: 340.00,
    discount_percent: 7,
    image_url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",
    tags: ["ghee", "amul", "cow ghee", "pure"],
    frequently_bought_with: ["prod-1", "prod-5"]
  },

  // Category 5: Snacks & Beverages (cat-5)
  {
    id: "prod-19",
    name: "Brooke Bond Red Label Tea",
    brand: "Brooke Bond",
    category_id: "cat-5",
    category_name: "Snacks & Beverages",
    description: "High quality black tea leaves providing strong taste and warm aroma.",
    unit: "500 g",
    price: 260.00,
    original_price: 290.00,
    discount_percent: 10,
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    tags: ["tea", "chai", "red label", "beverage"],
    frequently_bought_with: ["prod-7", "prod-20", "prod-8"]
  },
  {
    id: "prod-20",
    name: "Parle-G Gold Glucose Biscuits",
    brand: "Parle",
    category_id: "cat-5",
    category_name: "Snacks & Beverages",
    description: "The classic tea-time crunch biscuit packed with wheat and milk goodness.",
    unit: "1 kg",
    price: 110.00,
    original_price: 125.00,
    discount_percent: 12,
    image_url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    tags: ["biscuits", "parle-g", "tea snack"],
    frequently_bought_with: ["prod-19", "prod-7"]
  },

  // Category 6: Cleaning & Household (cat-6)
  {
    id: "prod-21",
    name: "Surf Excel Easy Wash Detergent Powder",
    brand: "Surf Excel",
    category_id: "cat-6",
    category_name: "Cleaning & Household",
    description: "Removes tough stains like oil, curry and ink in 1 stroke wash.",
    unit: "1 kg",
    price: 140.00,
    original_price: 155.00,
    discount_percent: 10,
    image_url: "https://images.unsplash.com/photo-1585832770485-e68a5fc88240?auto=format&fit=crop&w=600&q=80",
    tags: ["detergent", "washing", "surf excel", "laundry"],
    frequently_bought_with: ["prod-22"]
  },
  {
    id: "prod-22",
    name: "Vim Dishwash Gel Lemon",
    brand: "Vim",
    category_id: "cat-6",
    category_name: "Cleaning & Household",
    description: "Concentrated liquid gel with power of 100 lemons for grease-free utensils.",
    unit: "750 ml",
    price: 175.00,
    original_price: 195.00,
    discount_percent: 10,
    image_url: "https://images.unsplash.com/photo-1585832770485-e68a5fc88240?auto=format&fit=crop&w=600&q=80",
    tags: ["dishwash", "vim", "lemon gel", "cleaning"],
    frequently_bought_with: ["prod-21"]
  },

  // Category 7: Personal Care & Hygiene (cat-7)
  {
    id: "prod-23",
    name: "Dettol Original Germ Protection Soap",
    brand: "Dettol",
    category_id: "cat-7",
    category_name: "Personal Care & Hygiene",
    description: "Trusted germ protection soap with classic pine fragrance.",
    unit: "125 g (Pack of 4)",
    price: 180.00,
    original_price: 200.00,
    discount_percent: 10,
    image_url: "https://images.unsplash.com/photo-1607006482602-76ca97ac9378?auto=format&fit=crop&w=600&q=80",
    tags: ["soap", "dettol", "germ protection", "hygiene"],
    frequently_bought_with: ["prod-24"]
  },
  {
    id: "prod-24",
    name: "Colgate Strong Teeth Toothpaste",
    brand: "Colgate",
    category_id: "cat-7",
    category_name: "Personal Care & Hygiene",
    description: "Amino Shakti formula that adds natural calcium for 2x stronger teeth.",
    unit: "500 g",
    price: 215.00,
    original_price: 240.00,
    discount_percent: 10,
    image_url: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=600&q=80",
    tags: ["toothpaste", "colgate", "oral care"],
    frequently_bought_with: ["prod-23"]
  },

  // Category 8: Packaged Foods & Noodles (cat-8)
  {
    id: "prod-25",
    name: "Maggi 2-Minute Masala Instant Noodles",
    brand: "Nestle Maggi",
    category_id: "cat-8",
    category_name: "Packaged Foods & Noodles",
    description: "India's favorite instant noodles infused with roasted spices.",
    unit: "420 g (Pack of 6)",
    price: 88.00,
    original_price: 96.00,
    discount_percent: 8,
    image_url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    tags: ["maggi", "noodles", "instant food", "snack"],
    frequently_bought_with: ["prod-7", "prod-19"]
  }
];

// Seeded Store Inventory mapped per store (Subhash Stores as primary demo)
export const mockInventory = [
  // Out of Stock Items (for demonstrating Section 7: Out-of-Stock Intelligence)
  { id: "inv-1", store_id: "store-1", product_id: "prod-1", stock_qty: 0, min_stock_threshold: 5, is_available: false, last_updated: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "inv-8", store_id: "store-1", product_id: "prod-8", stock_qty: 0, min_stock_threshold: 10, is_available: false, last_updated: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: "inv-15", store_id: "store-1", product_id: "prod-15", stock_qty: 0, min_stock_threshold: 6, is_available: false, last_updated: new Date(Date.now() - 3600000 * 5).toISOString() },

  // Low Stock Items (for demonstrating Smart Restock Suggestions)
  { id: "inv-4", store_id: "store-1", product_id: "prod-4", stock_qty: 3, min_stock_threshold: 10, is_available: true, last_updated: new Date(Date.now() - 3600000 * 1).toISOString() },
  { id: "inv-11", store_id: "store-1", product_id: "prod-11", stock_qty: 2, min_stock_threshold: 8, is_available: true, last_updated: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: "inv-14", store_id: "store-1", product_id: "prod-14", stock_qty: 4, min_stock_threshold: 15, is_available: true, last_updated: new Date(Date.now() - 3600000 * 2).toISOString() },

  // In Stock Items for Store 1
  { id: "inv-2", store_id: "store-1", product_id: "prod-2", stock_qty: 18, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-3", store_id: "store-1", product_id: "prod-3", stock_qty: 14, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-5", store_id: "store-1", product_id: "prod-5", stock_qty: 25, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-6", store_id: "store-1", product_id: "prod-6", stock_qty: 20, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-6b", store_id: "store-1", product_id: "prod-6b", stock_qty: 16, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-7", store_id: "store-1", product_id: "prod-7", stock_qty: 32, min_stock_threshold: 10, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-9", store_id: "store-1", product_id: "prod-9", stock_qty: 15, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-10", store_id: "store-1", product_id: "prod-10", stock_qty: 22, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-12", store_id: "store-1", product_id: "prod-12", stock_qty: 12, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-13", store_id: "store-1", product_id: "prod-13", stock_qty: 16, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-13b", store_id: "store-1", product_id: "prod-13b", stock_qty: 14, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-14a", store_id: "store-1", product_id: "prod-14a", stock_qty: 28, min_stock_threshold: 10, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-14b", store_id: "store-1", product_id: "prod-14b", stock_qty: 35, min_stock_threshold: 10, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-14c", store_id: "store-1", product_id: "prod-14c", stock_qty: 22, min_stock_threshold: 10, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-16", store_id: "store-1", product_id: "prod-16", stock_qty: 16, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-17", store_id: "store-1", product_id: "prod-17", stock_qty: 19, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-18", store_id: "store-1", product_id: "prod-18", stock_qty: 11, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-19", store_id: "store-1", product_id: "prod-19", stock_qty: 24, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-20", store_id: "store-1", product_id: "prod-20", stock_qty: 30, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-21", store_id: "store-1", product_id: "prod-21", stock_qty: 15, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-22", store_id: "store-1", product_id: "prod-22", stock_qty: 18, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-23", store_id: "store-1", product_id: "prod-23", stock_qty: 20, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-24", store_id: "store-1", product_id: "prod-24", stock_qty: 25, min_stock_threshold: 5, is_available: true, last_updated: new Date().toISOString() },
  { id: "inv-25", store_id: "store-1", product_id: "prod-25", stock_qty: 35, min_stock_threshold: 10, is_available: true, last_updated: new Date().toISOString() }
];

export const mockOrders = [
  {
    id: "ord-1",
    order_number: "ORD-9842",
    user_id: "user-1",
    user_name: "Rahul Sharma",
    store_id: "store-1",
    store_name: "Subhash Stores — Andheri East",
    subtotal: 445.00,
    delivery_fee: 29.00,
    total_amount: 474.00,
    status: "delayed",
    delay_minutes: 15,
    delay_reason: "Store batch dispatch queue delay during peak hour",
    delivery_address: "Flat 402, Green Meadows, Marol, Andheri East, Mumbai 400059",
    payment_method: "UPI (Google Pay)",
    created_at: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    items: [
      { id: "item-1", product_id: "prod-2", product_name: "Fortune Chakki Fresh Atta 5kg", price: 245.00, quantity: 1, item_total: 245.00 },
      { id: "item-2", product_id: "prod-6", product_name: "Tata Sampann Toor Dal 1kg", price: 165.00, quantity: 1, item_total: 165.00 },
      { id: "item-3", product_id: "prod-4", product_name: "Tata Salt 1kg", price: 28.00, quantity: 1, item_total: 28.00 }
    ]
  },
  {
    id: "ord-2",
    order_number: "ORD-9841",
    user_id: "user-1",
    user_name: "Rahul Sharma",
    store_id: "store-1",
    store_name: "Subhash Stores — Andheri East",
    subtotal: 364.00,
    delivery_fee: 29.00,
    total_amount: 393.00,
    status: "out_for_delivery",
    delay_minutes: 0,
    delay_reason: null,
    delivery_address: "Flat 402, Green Meadows, Marol, Andheri East, Mumbai 400059",
    payment_method: "UPI (PhonePe)",
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    items: [
      { id: "item-4", product_id: "prod-7", product_name: "Amul Taaza Toned Milk 1L", price: 54.00, quantity: 2, item_total: 108.00 },
      { id: "item-5", product_id: "prod-19", product_name: "Brooke Bond Red Label Tea 500g", price: 260.00, quantity: 1, item_total: 260.00 }
    ]
  },
  {
    id: "ord-3",
    order_number: "ORD-9839",
    user_id: "user-1",
    user_name: "Rahul Sharma",
    store_id: "store-1",
    store_name: "Subhash Stores — Andheri East",
    subtotal: 520.00,
    delivery_fee: 0.00,
    total_amount: 520.00,
    status: "delivered",
    delay_minutes: 0,
    delay_reason: null,
    delivery_address: "Flat 402, Green Meadows, Marol, Andheri East, Mumbai 400059",
    payment_method: "Credit Card",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { id: "item-6", product_id: "prod-16", product_name: "Saffola Gold Cooking Oil 1L", price: 168.00, quantity: 1, item_total: 168.00 },
      { id: "item-7", product_id: "prod-5", product_name: "India Gate Sona Masoori Rice 5kg", price: 380.00, quantity: 1, item_total: 380.00 }
    ]
  }
];

export const mockSupportTickets = [
  {
    id: "tkt-1",
    ticket_number: "TKT-1082",
    order_id: "ord-1",
    order_number: "ORD-9842",
    user_id: "user-1",
    user_name: "Rahul Sharma",
    category: "Delayed delivery",
    subject: "Delivery running 15 minutes late",
    description: "The order status shows running 15 mins late. Need delivery update.",
    status: "open",
    priority: "medium",
    resolution_notes: null,
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: "tkt-2",
    ticket_number: "TKT-1079",
    order_id: "ord-3",
    order_number: "ORD-9839",
    user_id: "user-1",
    user_name: "Rahul Sharma",
    category: "Product unavailable",
    subject: "Aashirvaad Atta was OOS, selected Fortune Atta alternative",
    description: "Wanted to check if price difference refund was credited.",
    status: "resolved",
    priority: "low",
    resolution_notes: "Difference of ₹15 refunded to customer UPI wallet.",
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];
