/* Hinoki, a twelve-seat omakase counter in Bandra, Mumbai. Content only. */

export const img = {
    hero: 'photo-1617196034796-73dfa7b1fd56',
    knife: 'photo-1551218808-94e220e084d2',
    platter: 'photo-1611143669185-af224c5e3252',
    nigiri: 'photo-1579584425555-c3ce17fd4351',
    boat: 'photo-1553621042-f6e147245754',
    bar: 'photo-1514933651103-005eec06c04b',
    whisky: 'photo-1470337458703-46ad1756a187',
    table: 'photo-1414235077428-338989a2e8c0',
};

export const STORY =
    'Twelve seats around one hinoki wood counter. Chef Kenji Arai cuts every piece in front of you and serves it the moment it is ready, so nothing waits on a plate. Fish comes from Toyosu market in Tokyo twice a week and from boats on the Konkan coast every morning.';

// Tonight's courses, in the order they are served.
export const COURSES = [
    { n: '01', name: 'Sakizuke', note: 'Chawanmushi with crab and yuzu', id: img.platter },
    { n: '02', name: 'Otsukuri', note: 'Three cuts of the morning catch', id: img.boat },
    { n: '03', name: 'Nigiri, first set', note: 'Kingfish, sea bream, aged tuna', id: img.nigiri },
    { n: '04', name: 'Yakimono', note: 'Black cod, miso, binchotan', id: img.table },
    { n: '05', name: 'Nigiri, second set', note: 'Otoro, scallop, sea urchin', id: img.hero },
    { n: '06', name: 'Kashi', note: 'Hojicha ice cream, warm mochi', id: img.whisky },
];

export const SEATINGS = [
    { time: '6:30 pm', left: [3, 0, 5, 2, 7, 1, 4] },
    { time: '9:00 pm', left: [6, 2, 0, 4, 1, 8, 3] },
];

export const NAV = [
    ['The counter', 'story'],
    ['Tonight', 'courses'],
    ['The chef', 'chef'],
    ['Reserve', 'reserve'],
    ['Visit', 'visit'],
];
