export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const stepsToc = (steps) => steps.map((s) => ({ id: slugify(s.title), label: s.title }));
