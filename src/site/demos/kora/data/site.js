// All copy, prices and photos for the Kora site. Placeholder details are marked in the README.

export const photo = (id, w = 1600) =>`https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const PHOTO = {
  pour: "photo-1495474472287-4d71bcdd2085",
  farm: "photo-1447933601403-0c6688de566e",
  hills: "photo-1501339847302-ac426a4a7cbb",
  beanA: "photo-1514432324607-a09d9b4aefdd",
  beanB: "photo-1442512595331-e89e73853f31",
  beanC: "photo-1511920170033-f8396924c348",
  roast: "photo-1509042239860-f550ce710b93",
  cup: "photo-1559056199-641a0ac8b55e",
};

export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;

export const NAV_LINKS = [
  ["Estates", "estates"],
  ["Beans", "beans"],
  ["Bar", "bar"],
  ["Visit", "visit"],
];

export const HERO = {
  image: photo(PHOTO.pour, 1600),
  alt: "Coffee being poured in soft morning light",
  roast: {
    label: "This week's roast",
    name: "Coorg Honey",
    origin: "Coorg, Karnataka",
    notes: "Orange blossom, dark cherry, cacao",
    level: 1,
    anchor: "#beans",
  },
};

export const MARQUEE = ["Chikmagalur", "Coorg", "Roasted in Indiranagar", "Delivered across India", "A slow bar", "Single origin"];

export const ESTATES = [
  {
    id: "chikmagalur",
    name: "Chikmagalur",
    body: "Hill country with cool mornings and a long dry season. Coffee grows here under shade trees, and it is picked by hand when the cherries turn deep red.",
    link: "Beans from Chikmagalur",
    image: photo(PHOTO.farm),
    alt: "Coffee photograph from Chikmagalur",
  },
  {
    id: "coorg",
    name: "Coorg",
    body: "Misty, high and wet for much of the year. Coorg beans are often processed with honey or natural methods, which bring out sweetness and dried fruit.",
    link: "Beans from Coorg",
    image: photo(PHOTO.hills),
    alt: "Coffee photograph from Coorg",
  },
];

export const WEIGHTS = [
  { id: "250", label: "250 g" },
  { id: "1000", label: "1 kg" },
];

export const GRINDS = ["Whole bean", "Filter", "Espresso", "French press"];

// roast: index on the roast scale, 0 is light and 4 is dark.
export const ROAST_STEPS = ["Light", "Medium light", "Medium", "Medium dark", "Dark"];

export const BEANS = [
  {
    id: "hill-fog",
    name: "Hill Fog",
    origin: "Chikmagalur, Karnataka",
    notes: "Cacao, toasted almond, brown sugar",
    roast: 2,
    price250: 650,
    price1000: 2340,
    image: photo(PHOTO.beanA, 1400),
    alt: "Roasted coffee beans",
  },
  {
    id: "coorg-honey",
    name: "Coorg Honey",
    origin: "Coorg, Karnataka",
    notes: "Orange blossom, dark cherry, cacao",
    roast: 1,
    price250: 720,
    price1000: 2590,
    image: photo(PHOTO.beanB, 1400),
    alt: "Roasted coffee beans",
  },
  {
    id: "night-shift",
    name: "Night Shift",
    origin: "Chikmagalur and Coorg blend",
    notes: "Dark chocolate, caramel, a little smoke",
    roast: 3,
    price250: 580,
    price1000: 2090,
    image: photo(PHOTO.beanC, 1400),
    alt: "Roasted coffee beans",
  },
];

export const CHAPTERS = [
  {
    n: "01",
    title: "Picked by hand",
    body: "Only ripe red cherries come off the branch. Pickers return to the same bushes several times in a season, because the cherries ripen unevenly.",
    image: photo(PHOTO.farm, 1400),
    alt: "Coffee photograph from the estate",
  },
  {
    n: "02",
    title: "Processed on the estate",
    body: "Cherries are dried after pulping, or left whole for honey and natural lots. The method changes the sweetness and fruit in the cup, so it is printed on the bag.",
    image: photo(PHOTO.hills, 1400),
    alt: "Coffee photograph from the estate",
  },
  {
    n: "03",
    title: "Roasted in small batches",
    body: "We roast in Indiranagar in batches small enough to watch closely. Each batch is cooled the moment it leaves the drum, then rested before it is bagged.",
    image: photo(PHOTO.roast, 1400),
    alt: "Coffee roasting",
  },
  {
    n: "04",
    title: "Brewed one cup at a time",
    body: "At the bar, every cup is brewed to order and served as soon as it is ready. Slow brewing is the point, so we never batch it up in advance.",
    image: photo(PHOTO.cup, 1400),
    alt: "A cup of coffee on a table",
  },
];

export const MENU = [
  { name: "Filter coffee", price: 180, note: "Chikmagalur beans, poured from a steel tumbler. Milk or black." },
  { name: "Pour-over of the week", price: 340, note: "Ask the bar. It changes with each roast." },
  { name: "Espresso", price: 170, note: "Night Shift, pulled to order." },
  { name: "Cortado", price: 210, note: "Equal parts espresso and warm milk." },
  { name: "Cold brew", price: 260, note: "Steeped overnight, served over ice." },
  { name: "Toast", price: 230, note: "Sourdough, butter and honey." },
];

export const VISIT_PANELS = [
  { image: photo(PHOTO.cup, 1400), title: "The bar", description: "Counter seats and a few tables. The menu is short on purpose." },
  { image: photo(PHOTO.roast, 1400), title: "The roastery", description: "The roaster sits a few steps from the counter, in plain view." },
  { image: photo(PHOTO.beanC, 1400), title: "The beans", description: "Green coffee from two estates, stored until the day it is roasted." },
];

export const VISIT_DETAILS = {
  address: "Indiranagar, Bengaluru",
  hours: "Tuesday to Sunday, 8 am to 9 pm. Closed Mondays.",
  phone: "+91 80 0000 0000",
  email: "hello@kora-coffee.example",
  directions: "https://www.google.com/maps/search/?api=1&query=Indiranagar%2C+Bengaluru",
};

export const FAQS = [
  {
    q: "How fresh are the beans when they arrive?",
    a: "We roast in small batches and pack each bag after it has rested. The roast date is printed on every bag, so you can see exactly how old your coffee is.",
  },
  {
    q: "Do you deliver outside Bengaluru?",
    a: "Yes, across India. Delivery times depend on your pin code, and the estimated date is shown before you pay.",
  },
  {
    q: "Which grind should I choose?",
    a: "Whole bean keeps longest and suits a grinder at home. Filter fits a drip brewer or a pour-over, espresso needs a fine grind, and French press needs a coarse one. If you are unsure, choose filter.",
  },
  {
    q: "Can I walk into the bar without booking?",
    a: "Yes. For groups of six or more, message us first so we can keep a table.",
  },
  {
    q: "Do you ship beans outside India?",
    a: "Not yet. For now we deliver within India only.",
  },
];
