// Sample catalogue for a fan-made concept store. Flavour names and pack art are Lay's (PepsiCo);
// weights, prices, notes and stock here are sample data, not official figures.

const S = { id: 's', label: '26 g', grams: 26, price: 10 };
const M = { id: 'm', label: '52 g', grams: 52, price: 20 };
const L = { id: 'l', label: '115 g', grams: 115, price: 50 };

export const PRODUCTS = [
    // colour: the pack; deep: dark shade for rings and sections; glow: light shade; ink: text on the colour
    { slug: 'classic', name: 'Classic', short: 'Classic', category: 'classic', colour: '#F6C21A', deep: '#C98E00', glow: '#FFE47E', ink: '#241600', text: 'dark', image: '/packs/classic.png', ingredient: 'potato', note: 'Potatoes, oil and salt. The one every other flavour gets measured against.', fact: 'Three ingredients', ingredients: 'Potatoes, vegetable oil, salt.', sizes: [S, M, L] },
    { slug: 'sour-cream-onion', name: 'Sour Cream & Onion', short: 'Sour Cream & Onion', category: 'creamy', colour: '#2C9A44', deep: '#156128', glow: '#8ADB8E', ink: '#FFFFFF', text: 'light', image: '/packs/sour-cream-onion.png', ingredient: 'onion', note: 'Cool sour cream, a little onion and chives. Soft on the tongue, gone in a minute.', fact: 'No heat', ingredients: 'Potatoes, vegetable oil, sour cream and onion seasoning (milk, onion, chives, salt).', sizes: [S, M, L] },
    { slug: 'barbecue', name: 'Barbecue', short: 'Barbecue', category: 'smoky', colour: '#5B2E1D', deep: '#2E140A', glow: '#C9703E', ink: '#FFFFFF', text: 'light', image: '/packs/barbecue.png', ingredient: 'smoke', note: 'Sweet, smoky and a little tangy, like the edge of a grill.', fact: 'Smoky and sweet', ingredients: 'Potatoes, vegetable oil, barbecue seasoning (sugar, paprika, onion, garlic, smoke flavour, salt).', sizes: [S, M, L] },
    { slug: 'salt-vinegar', name: 'Salt & Vinegar', short: 'Salt & Vinegar', category: 'tangy', colour: '#1F86D6', deep: '#0B4B86', glow: '#8BCBFF', ink: '#FFFFFF', text: 'light', image: '/packs/salt-vinegar.png', ingredient: 'vinegar', note: 'A sharp vinegar bite and a lot of salt. It makes your eyes water a little, on purpose.', fact: 'Sharp and salty', ingredients: 'Potatoes, vegetable oil, salt and vinegar seasoning (vinegar, salt, lactose).', sizes: [S, M, L] },
    { slug: 'flamin-hot', name: "Flamin' Hot", short: "Flamin' Hot", category: 'spicy', colour: '#D6182A', deep: '#7E0A14', glow: '#FF6A4E', ink: '#FFFFFF', text: 'light', image: '/packs/flamin-hot.png', ingredient: 'chilli', note: 'Red chilli heat that builds with every chip. Keep something cold close by.', fact: 'Hottest here', ingredients: 'Potatoes, vegetable oil, flamin hot seasoning (chilli, paprika, garlic, onion, citric acid, salt).', sizes: [S, M, L] },
    { slug: 'cheddar-sour-cream', name: 'Cheddar & Sour Cream', short: 'Cheddar & Sour Cream', category: 'cheesy', colour: '#EE5A1C', deep: '#9E300A', glow: '#FFAA6D', ink: '#FFFFFF', text: 'light', image: '/packs/cheddar-sour-cream.png', ingredient: 'cheese', note: 'Sharp cheddar and cool sour cream on a thin, crisp chip.', fact: 'Cheesy', ingredients: 'Potatoes, vegetable oil, cheddar and sour cream seasoning (cheese, milk, onion, salt).', sizes: [S, M, L] },
    { slug: 'all-dressed', name: 'All Dressed', short: 'All Dressed', category: 'tangy', colour: '#6A2C8F', deep: '#381452', glow: '#B88BE0', ink: '#FFFFFF', text: 'light', image: '/packs/all-dressed.png', ingredient: 'ketchup', note: 'A bit of everything: ketchup, vinegar, barbecue and onion in one bag.', fact: 'Everything at once', ingredients: 'Potatoes, vegetable oil, all dressed seasoning (tomato, vinegar, onion, paprika, sugar, salt).', sizes: [S, M, L] },
    { slug: 'sweet-southern-heat-bbq', name: 'Sweet Southern Heat Barbecue', short: 'Sweet Southern Heat Barbecue', category: 'smoky', colour: '#B21430', deep: '#640816', glow: '#F26A5C', ink: '#FFFFFF', text: 'light', image: '/packs/sweet-southern-heat-bbq.png', ingredient: 'pepper', note: 'Honey-sweet barbecue first, then a slow pepper heat that stays.', fact: 'Sweet then hot', ingredients: 'Potatoes, vegetable oil, barbecue seasoning (sugar, honey, chilli, paprika, smoke flavour, salt).', sizes: [M, L] },
    { slug: 'bacon-grilled-cheese', name: 'Bacon Grilled Cheese', short: 'Bacon Grilled Cheese', category: 'cheesy', colour: '#F2A22F', deep: '#A9640C', glow: '#FFD37E', ink: '#241600', text: 'dark', image: '/packs/bacon-grilled-cheese.png', ingredient: 'bacon', note: 'Toasted bread, melted cheese and a smoky bacon finish.', fact: 'Smoky and cheesy', ingredients: 'Potatoes, vegetable oil, bacon grilled cheese seasoning (cheese, butter, smoke flavour, salt).', sizes: [M, L] },
];

export const CATEGORIES = [
    { id: 'classic', label: 'Classic' },
    { id: 'creamy', label: 'Creamy' },
    { id: 'smoky', label: 'Smoky' },
    { id: 'tangy', label: 'Tangy' },
    { id: 'spicy', label: 'Spicy' },
    { id: 'cheesy', label: 'Cheesy' },
];

// The store sells single packs and the build-your-3-pack (PICK3 below). Kept for the pricing code.
export const BOXES = [];

export const COUPONS = { CRUNCH10: { pct: 10, cap: 100, label: '10% off, up to ₹100' } };
export const BOX_OFF = 10; // percent off every piece of a box bought whole
// Build your 3 pack: any three 52 g packs, picked by you, at 20% off. Every full set of three counts.
export const PICK3 = { id: 'pick3', size: 'm', count: 3, off: 20 };
export const FREE_SHIPPING_FROM = 299;
export const SHIPPING = 40;
export const MAX_QTY = 24;
