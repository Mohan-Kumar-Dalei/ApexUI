// All demo data for Chowk. Photos come from Unsplash.
const P = {
  curry: "1585937421612-70a008356fbe",
  butterChicken: "1565557623262-b51c2513a641",
  thali: "1546833999-b9f581a1996d",
  pizzaSlice: "1513104890138-7c749659a591",
  burger: "1568901346375-23c9450c58cd",
  steakPlates: "1504674900247-0877df9cc836",
  skewers: "1555939594-58d7cb561ad1",
  saladBowl: "1540189549336-e6e99c3679fe",
  pulaoBowl: "1563379091339-03b21ab4a4f8",
  samosa: "1601050690597-df0568f70950",
  idliLeaf: "1589301760014-d929f3979dbc",
  idliVada: "1630383249896-424e482df921",
  pav: "1606491956689-2ea866880c84",
  sizzler: "1567188040759-fb8a883dc6d8",
  donuts: "1551024601-bec78aea704b",
  tandoori: "1617692855027-33b14f061079",
  dumpling: "1496116218417-1a781b1c416c",
  ramen: "1569718212165-3a8278d5f624",
  friedRice: "1512058564366-18510be2db19",
  friedChicken: "1626082927389-6cd097cdc6ec",
  kebab: "1599487488170-d11ec9c172f0",
  paneer: "1588166524941-3bf61a9c41db",
  room: "1517248135467-4c7edcad34c4",
  table: "1414235077428-338989a2e8c0",
  biryani: "1631515243349-e0cb75fb8d3a",
  chaat: "1610192244261-3f33de3f55e4",
  chilliChicken: "1645177628172-a94c1f96e6db",
  handi: "1606471191009-63994c53433b",
  pizza: "1574071318508-1cdbab80d002",
  burger2: "1571091718767-18b5b1457add",
  fries: "1576107232684-1279f390859f",
  burgers: "1550547660-d9450f859349",
  chocoJar: "1563805042-7684c019e1cb",
  creamCups: "1488477181946-6428a0291777",
  greekSalad: "1505253716362-afaea1d3d1af",
  manchurian: "1529042410759-befb1204b468",
  momos: "1534422298391-e4f8c172dddb",
  chickenBurger: "1606755962773-d324e0a13086",
  roll: "1601050690117-94f5f6fa8bd7",
  spices: "1626777552726-4a6b54c97e46",
  noodles: "1596797038530-2c107229654b",
  dosa: "1668236543090-82eba5ee5976",
  bananaLeaf: "1625398407796-82650a8c135f",
  parfait: "1505576399279-565b52d4ac71",
  frenchToast: "1484723091739-30a097e8f929",
};

export const photo = (key, w = 600) =>
  P[key] ? `https://images.unsplash.com/photo-${P[key]}?w=${w}&q=70&auto=format&fit=crop` : null;

export const cuisinesRow = [
  { name: "Biryani", img: "biryani" },
  { name: "Dosa", img: "dosa" },
  { name: "Pizza", img: "pizzaSlice" },
  { name: "Burger", img: "burger" },
  { name: "Momos", img: "momos" },
  { name: "Rolls", img: "roll" },
  { name: "North Indian", img: "curry" },
  { name: "Chinese", img: "chilliChicken" },
  { name: "Chaat", img: "chaat" },
  { name: "Desserts", img: "donuts" },
  { name: "Healthy", img: "saladBowl" },
  { name: "Kebabs", img: "skewers" },
];

export const coupons = [
  { code: "CHOWK60", title: "60% off up to ₹120", note: "On your first three orders", min: 199, type: "pct", value: 60, cap: 120 },
  { code: "FEAST100", title: "Flat ₹100 off", note: "On orders above ₹599", min: 599, type: "flat", value: 100 },
  { code: "FREEDEL", title: "Free delivery", note: "On orders above ₹299", min: 299, type: "delivery" },
  { code: "LATENIGHT", title: "20% off after 11 pm", note: "Up to ₹80, every night", min: 249, type: "pct", value: 20, cap: 80 },
];

export const addresses = [
  { id: "home", label: "Home", line: "Flat 302, Lakeview Apartments, 12th Main Road, Indiranagar, Bengaluru 560038" },
  { id: "work", label: "Work", line: "4th floor, Prestige Tech Park, Outer Ring Road, Marathahalli, Bengaluru 560103" },
];

export const areas = ["Indiranagar, Bengaluru", "Koramangala, Bengaluru", "HSR Layout, Bengaluru", "Jayanagar, Bengaluru", "Whitefield, Bengaluru"];

let uid = 0;
const d = (name, price, veg, img, desc, extra = {}) => ({ id: `d${++uid}`, name, price, veg, img, desc, ...extra });

export const restaurants = [
  {
    id: "meghnas-biryani-house",
    name: "Meghna's Biryani House",
    cuisines: ["Biryani", "Hyderabadi", "Kebabs"],
    area: "Indiranagar",
    rating: 4.5, ratings: "12k+", time: 28, costForTwo: 500, distance: 1.8,
    img: "biryani", offer: "50% off up to ₹100", tags: ["Biryani", "Kebabs"],
    menu: [
      { category: "Biryani", items: [
        d("Hyderabadi chicken dum biryani", 329, false, "biryani", "Long grain basmati layered with marinated chicken, sealed and cooked on dum for two hours. Comes with salan and raita.", { best: true, rating: 4.6 }),
        d("Mutton dum biryani", 449, false, "pulaoBowl", "Tender goat on the bone, saffron rice, fried onions and mint.", { best: true, rating: 4.5 }),
        d("Egg biryani", 259, false, "friedRice", "Two boiled eggs tossed in masala, folded into spiced rice."),
        d("Veg dum biryani", 249, true, "pulaoBowl", "Beans, carrot, potato and paneer, cooked with whole spices and kewra water."),
      ]},
      { category: "Starters", items: [
        d("Chicken 65", 279, false, "chilliChicken", "Deep fried chicken with curry leaves, red chilli and a squeeze of lime.", { rating: 4.4 }),
        d("Seekh kebab", 319, false, "kebab", "Minced mutton, ginger and green chilli on skewers over charcoal."),
        d("Paneer tikka", 289, true, "sizzler", "Paneer cubes in hung curd marinade, roasted with peppers and onion."),
      ]},
      { category: "Sides and desserts", items: [
        d("Mirchi ka salan", 89, true, "curry", "Long green chillies in a peanut, sesame and tamarind gravy."),
        d("Burani raita", 59, true, null, "Thick curd with roasted garlic and a pinch of chilli."),
        d("Double ka meetha", 129, true, "creamCups", "Bread pudding with rabdi, cardamom and dry fruit."),
      ]},
    ],
  },
  {
    id: "udupi-ananda-bhavan",
    name: "Udupi Ananda Bhavan",
    cuisines: ["South Indian", "Dosa", "Filter coffee"],
    area: "Jayanagar",
    rating: 4.6, ratings: "20k+", time: 22, costForTwo: 250, distance: 1.1, veg: true,
    img: "dosa", offer: "Flat ₹50 off above ₹249", tags: ["Dosa"],
    menu: [
      { category: "Dosa", items: [
        d("Masala dosa", 129, true, "dosa", "Crisp rice and lentil crepe with potato palya, coconut chutney and sambar.", { best: true, rating: 4.7 }),
        d("Ghee roast dosa", 159, true, "dosa", "Paper thin, roasted in a generous spoon of ghee."),
        d("Set dosa", 109, true, null, "Three soft, spongy dosas with sagu and chutney."),
      ]},
      { category: "Idli and vada", items: [
        d("Idli vada", 89, true, "idliVada", "Two idlis and one medu vada with sambar and two chutneys.", { best: true, rating: 4.6 }),
        d("Rava idli", 99, true, "idliLeaf", "Semolina idli with cashew, curry leaves and a ghee drizzle."),
      ]},
      { category: "Meals and drinks", items: [
        d("South Indian meals", 199, true, "bananaLeaf", "Rice, sambar, rasam, two palyas, curd, pickle and payasa on a banana leaf."),
        d("Filter coffee", 49, true, null, "Chicory blend, boiled milk, served in a steel davara."),
        d("Kesari bath", 69, true, null, "Semolina halwa with saffron, ghee and pineapple."),
      ]},
    ],
  },
  {
    id: "kolkata-kathi-co",
    name: "Kolkata Kathi Co.",
    cuisines: ["Rolls", "Street food", "Bengali"],
    area: "Koramangala",
    rating: 4.3, ratings: "8k+", time: 25, costForTwo: 350, distance: 2.4,
    img: "roll", offer: "Buy 1 get 1 on rolls", tags: ["Rolls"],
    menu: [
      { category: "Rolls", items: [
        d("Chicken kathi roll", 189, false, "roll", "Charcoal grilled chicken tikka, onion and green chutney in an egg paratha.", { best: true, rating: 4.5 }),
        d("Paneer kathi roll", 169, true, "roll", "Paneer tikka with pickled onion and mint mayo."),
        d("Double egg roll", 129, false, null, "The Park Street classic. Two eggs, onion, chilli and a dash of lime."),
        d("Mutton seekh roll", 229, false, "kebab", "Mutton seekh kebab with sliced onion and lachha paratha."),
      ]},
      { category: "Snacks", items: [
        d("Samosa chaat", 99, true, "samosa", "Crushed samosas with chole, curd, tamarind and sev."),
        d("Fish fry", 249, false, "friedChicken", "Bhetki fillet in a breadcrumb crust, with kasundi mustard."),
      ]},
    ],
  },
  {
    id: "forno-napoli",
    name: "Forno Napoli Pizzeria",
    cuisines: ["Pizza", "Italian", "Pasta"],
    area: "Indiranagar",
    rating: 4.4, ratings: "5k+", time: 32, costForTwo: 700, distance: 2.0,
    img: "pizza", offer: "20% off up to ₹150", tags: ["Pizza"],
    menu: [
      { category: "Wood fired pizza", items: [
        d("Margherita", 349, true, "pizza", "San Marzano tomato, fior di latte and basil. Baked at 450 degrees for ninety seconds.", { best: true, rating: 4.6 }),
        d("Pepperoni", 499, false, "pizzaSlice", "Spicy pork pepperoni, mozzarella and chilli honey.", { best: true }),
        d("Funghi e tartufo", 459, true, "pizzaSlice", "Mushrooms, truffle cream and parmesan."),
      ]},
      { category: "Sides", items: [
        d("Garlic bread with cheese", 199, true, null, "Sourdough, roasted garlic butter and mozzarella."),
        d("Tiramisu jar", 229, true, "chocoJar", "Espresso soaked ladyfingers and mascarpone."),
      ]},
    ],
  },
  {
    id: "smash-and-bun",
    name: "Smash & Bun",
    cuisines: ["Burgers", "American", "Fried chicken"],
    area: "HSR Layout",
    rating: 4.2, ratings: "9k+", time: 24, costForTwo: 450, distance: 3.1,
    img: "burgers", offer: "Free fries above ₹399", tags: ["Burger"],
    menu: [
      { category: "Burgers", items: [
        d("Classic smash burger", 249, false, "burger2", "Two thin smashed chicken patties, American cheese, pickles and house sauce.", { best: true, rating: 4.4 }),
        d("Double cheese smash", 329, false, "burger", "Four slices of cheese. That is the whole idea."),
        d("Crispy chicken burger", 229, false, "chickenBurger", "Buttermilk fried thigh, slaw and spicy mayo."),
        d("Crunchy aloo tikki burger", 149, true, null, "Spiced potato patty, lettuce, tomato and mint mayo."),
      ]},
      { category: "Sides and shakes", items: [
        d("Peri peri fries", 129, true, "fries", "Skin on fries tossed in peri peri salt."),
        d("Fried chicken, 4 pieces", 349, false, "friedChicken", "Brined for twelve hours, double fried."),
        d("Chocolate shake", 179, true, "chocoJar", "Dark chocolate, vanilla ice cream, whipped cream."),
      ]},
    ],
  },
  {
    id: "punjab-da-dhaba",
    name: "Punjab Da Dhaba",
    cuisines: ["North Indian", "Punjabi", "Tandoor"],
    area: "Koramangala",
    rating: 4.3, ratings: "15k+", time: 30, costForTwo: 600, distance: 2.7,
    img: "butterChicken", offer: "Flat ₹125 off above ₹499", tags: ["North Indian"],
    menu: [
      { category: "Mains", items: [
        d("Butter chicken", 349, false, "butterChicken", "Tandoori chicken in a tomato, butter and fenugreek gravy.", { best: true, rating: 4.6 }),
        d("Dal makhani", 249, true, "curry", "Black lentils simmered overnight with butter and cream.", { best: true }),
        d("Paneer butter masala", 289, true, "paneer", "Soft paneer in a mildly sweet makhani gravy."),
        d("Punjabi thali", 329, true, "thali", "Dal, two sabzi, paneer, rice, two rotis, salad and kheer."),
      ]},
      { category: "Tandoor and breads", items: [
        d("Tandoori chicken, half", 299, false, "tandoori", "Bone in chicken, smoky and charred, with onion rings."),
        d("Amritsari kulcha", 99, true, null, "Stuffed with spiced potato, baked in the tandoor, brushed with butter."),
        d("Butter naan", 59, true, null, "Soft and blistered."),
      ]},
    ],
  },
  {
    id: "wok-street",
    name: "Wok Street",
    cuisines: ["Chinese", "Indo-Chinese", "Asian"],
    area: "Indiranagar",
    rating: 4.1, ratings: "6k+", time: 27, costForTwo: 400, distance: 1.5,
    img: "noodles", offer: "40% off up to ₹80", tags: ["Chinese"],
    menu: [
      { category: "Noodles and rice", items: [
        d("Veg hakka noodles", 189, true, "noodles", "Wok tossed with cabbage, carrot, spring onion and soy.", { best: true, rating: 4.3 }),
        d("Chicken fried rice", 219, false, "friedRice", "Egg, chicken, spring onion and white pepper."),
      ]},
      { category: "Starters", items: [
        d("Chilli chicken, dry", 259, false, "chilliChicken", "Crisp chicken with green chilli, capsicum and dark soy.", { best: true }),
        d("Veg manchurian", 199, true, "manchurian", "Vegetable balls in a garlic, ginger and soy gravy."),
        d("Chicken dimsum", 229, false, "momos", "Six steamed dumplings with chilli oil."),
      ]},
    ],
  },
  {
    id: "tibet-momo-point",
    name: "Tibet Momo Point",
    cuisines: ["Momos", "Tibetan", "Thukpa"],
    area: "HSR Layout",
    rating: 4.5, ratings: "4k+", time: 20, costForTwo: 300, distance: 1.2,
    img: "momos", offer: "Flat ₹40 off above ₹199", tags: ["Momos"],
    menu: [
      { category: "Momos", items: [
        d("Steamed veg momos", 129, true, "momos", "Cabbage, carrot and onion in thin wrappers, with red chilli chutney.", { best: true, rating: 4.6 }),
        d("Chicken momos", 159, false, "dumpling", "Juicy minced chicken with ginger and coriander.", { best: true }),
        d("Pan fried momos", 169, false, "momos", "Steamed, then crisped in a pan."),
      ]},
      { category: "Soups", items: [
        d("Chicken thukpa", 189, false, "ramen", "Hand pulled noodles in a light chicken broth with greens."),
        d("Veg thukpa", 159, true, "ramen", "Vegetable broth, noodles, bok choy."),
      ]},
    ],
  },
  {
    id: "bombay-chaat-corner",
    name: "Bombay Chaat Corner",
    cuisines: ["Chaat", "Street food", "Snacks"],
    area: "Jayanagar",
    rating: 4.4, ratings: "7k+", time: 18, costForTwo: 200, distance: 0.9, veg: true,
    img: "chaat", offer: "20% off on all orders", tags: ["Chaat"],
    menu: [
      { category: "Chaat", items: [
        d("Papdi chaat", 99, true, "chaat", "Crisp papdi, potato, curd, two chutneys and sev.", { best: true, rating: 4.5 }),
        d("Samosa, 2 pieces", 59, true, "samosa", "Potato and pea filling, with green chutney and fried chillies.", { best: true }),
        d("Dahi puri", 89, true, null, "Six puris with sweet curd and tamarind."),
      ]},
      { category: "Pav", items: [
        d("Pav bhaji", 139, true, "pav", "Butter loaded bhaji with two toasted pavs, onion and lemon."),
        d("Vada pav", 49, true, "pav", "Batata vada, dry garlic chutney, soft pav."),
      ]},
    ],
  },
  {
    id: "green-bowl-kitchen",
    name: "Green Bowl Kitchen",
    cuisines: ["Healthy", "Salads", "Bowls"],
    area: "Koramangala",
    rating: 4.2, ratings: "3k+", time: 26, costForTwo: 550, distance: 2.9,
    img: "saladBowl", offer: "15% off on bowls", tags: ["Healthy"],
    menu: [
      { category: "Bowls", items: [
        d("Quinoa power bowl", 299, true, "saladBowl", "Quinoa, chickpeas, roasted pumpkin, greens and tahini.", { best: true, rating: 4.4 }),
        d("Grilled chicken bowl", 349, false, "steakPlates", "Herb chicken, brown rice, beans and salsa verde."),
        d("Greek salad", 249, true, "greekSalad", "Cucumber, tomato, olives, feta and oregano."),
      ]},
      { category: "Breakfast", items: [
        d("Fruit and yoghurt parfait", 179, true, "parfait", "Greek yoghurt, granola and seasonal fruit."),
        d("Protein pancakes", 229, true, "frenchToast", "Oat and banana pancakes with berries."),
      ]},
    ],
  },
  {
    id: "sugar-and-spoon",
    name: "Sugar & Spoon",
    cuisines: ["Desserts", "Bakery", "Ice cream"],
    area: "Indiranagar",
    rating: 4.7, ratings: "6k+", time: 21, costForTwo: 300, distance: 1.4, veg: true,
    img: "donuts", offer: "Free cookie above ₹349", tags: ["Desserts"],
    menu: [
      { category: "Desserts", items: [
        d("Strawberry cream cups", 199, true, "creamCups", "Mascarpone cream, fresh Mahabaleshwar strawberries.", { best: true, rating: 4.8 }),
        d("Death by chocolate jar", 229, true, "chocoJar", "Brownie, chocolate mousse, ganache and more brownie.", { best: true }),
        d("Glazed donut box of 4", 299, true, "donuts", "Chocolate, sprinkles, cinnamon sugar and salted caramel."),
        d("Gulab jamun, 2 pieces", 79, true, null, "Warm, soaked in cardamom syrup."),
      ]},
      { category: "Brunch", items: [
        d("Brioche French toast", 249, true, "frenchToast", "Caramelised banana and maple."),
      ]},
    ],
  },
  {
    id: "banana-leaf-andhra",
    name: "Banana Leaf Andhra Meals",
    cuisines: ["Andhra", "South Indian", "Meals"],
    area: "Whitefield",
    rating: 4.4, ratings: "10k+", time: 34, costForTwo: 450, distance: 3.6,
    img: "bananaLeaf", offer: "50% off up to ₹90", tags: ["North Indian", "Dosa"],
    menu: [
      { category: "Meals", items: [
        d("Andhra veg meals", 229, true, "bananaLeaf", "Rice, pappu, two curries, rasam, sambar, gongura pickle, curd.", { best: true, rating: 4.5 }),
        d("Chicken curry meals", 299, false, "handi", "Meals with a spicy Guntur chicken curry."),
      ]},
      { category: "Curries and rice", items: [
        d("Gongura mutton", 389, false, "curry", "Mutton cooked down with sour sorrel leaves."),
        d("Pulihora", 149, true, "friedRice", "Tamarind rice with peanuts and curry leaves."),
        d("Curd rice", 119, true, null, "Cool, tempered with mustard seeds and green chilli."),
      ]},
    ],
  },
  {
    id: "tandoor-nights",
    name: "Tandoor Nights",
    cuisines: ["Kebabs", "Mughlai", "Tandoor"],
    area: "HSR Layout",
    rating: 4.3, ratings: "5k+", time: 31, costForTwo: 650, distance: 2.6,
    img: "skewers", offer: "Flat ₹100 off above ₹549", tags: ["Kebabs"],
    menu: [
      { category: "Kebabs", items: [
        d("Chicken tikka", 319, false, "skewers", "Boneless chicken, hung curd, kashmiri chilli and mustard oil.", { best: true, rating: 4.5 }),
        d("Mutton seekh kebab", 369, false, "kebab", "Hand minced, charcoal grilled."),
        d("Tandoori chicken, full", 529, false, "tandoori", "Whole chicken, eight pieces, with mint chutney."),
        d("Malai paneer tikka", 299, true, "sizzler", "Cream, cheese and cardamom marinade."),
      ]},
      { category: "Breads", items: [
        d("Garlic naan", 69, true, null, "Topped with chopped garlic and coriander."),
      ]},
    ],
  },
];

export const findRestaurant = (id) => restaurants.find((r) => r.id === id);

export const allDishes = restaurants.flatMap((r) =>
  r.menu.flatMap((c) => c.items.map((i) => ({ ...i, restaurantId: r.id, restaurantName: r.name })))
);
