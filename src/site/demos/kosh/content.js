/*
 * Kosh, a money app for freelancers in India. The whole page is described here as
 * data; Kosh.jsx only knows how to draw each kind of block, in this order.
 */

export const BRAND = {
    name: 'Kosh',
    nav: [
        ['Product', 'features'],
        ['How it works', 'how'],
        ['Pricing', 'pricing'],
        ['Questions', 'faq'],
    ],
};

export const PAGE = [
    {
        type: 'hero',
        eyebrow: 'For freelancers and small studios',
        title: 'Invoices, GST and tax money, sorted in one place',
        text: 'Send an invoice in a minute, get paid in rupees or dollars, and let Kosh put the tax aside before you spend it.',
        primary: 'Start free',
        secondary: 'See how it works',
        note: 'Free for your first 5 invoices every month. No card needed.',
    },
    {
        type: 'chips',
        label: 'Made for people who bill by the project',
        items: ['Designers', 'Developers', 'Writers', 'Photographers', 'Consultants', 'Video editors', 'Translators', 'Architects'],
    },
    {
        type: 'bento',
        id: 'features',
        title: 'Everything between "send invoice" and "money in the bank"',
        cells: [
            { kind: 'invoice', title: 'Invoices in under a minute', text: 'Pick a client, add lines, send. Kosh remembers rates and payment terms.' },
            { kind: 'gst', title: 'GST worked out for you', text: 'CGST and SGST, or IGST for other states. Filed totals ready each month.' },
            { kind: 'fx', title: 'Paid from abroad', text: 'Clients pay in dollars or euros. You see the rupee amount before they do.' },
            { kind: 'pot', title: 'A pot for tax', text: 'Choose a share of every payment to set aside. March stops being scary.' },
            { kind: 'remind', title: 'Reminders that sound like you', text: 'Polite nudges on day 3, 7 and 14. You can edit every word.' },
            { kind: 'payout', title: 'Payouts when you want them', text: 'Daily, weekly or when you ask. Straight to any Indian bank account.' },
        ],
    },
    {
        type: 'stack',
        id: 'how',
        title: 'Set up in an afternoon',
        steps: [
            { n: '1', title: 'Add your business', text: 'PAN, GSTIN if you have one, and the bank account for payouts. Kosh checks them while you wait.', meta: '10 minutes' },
            { n: '2', title: 'Bring your clients', text: 'Import from a spreadsheet or your old invoices. Rates, addresses and terms come with them.', meta: '15 minutes' },
            { n: '3', title: 'Send the first invoice', text: 'Your client gets a clear page with UPI, card and bank transfer. You get a ping when they pay.', meta: '1 minute' },
        ],
    },
    {
        type: 'pricing',
        id: 'pricing',
        title: 'Simple prices, in rupees',
        plans: [
            { name: 'Free', month: 0, year: 0, text: 'For trying it out', features: ['5 invoices a month', 'GST invoices', 'UPI and bank transfer'] },
            { name: 'Solo', month: 399, year: 3990, text: 'For one person, full time', features: ['Unlimited invoices', 'Payments from abroad', 'Tax pot and reminders', 'Monthly GST summary'], best: true },
            { name: 'Studio', month: 999, year: 9990, text: 'For teams up to 10', features: ['Everything in Solo', 'Team members and roles', 'Approvals before sending', 'Priority support'] },
        ],
    },
    {
        type: 'faq',
        id: 'faq',
        title: 'Questions',
        items: [
            ['Is my money held by Kosh?', 'No. Payments go through an RBI-licensed payment aggregator and are settled to your own bank account. Kosh never holds your balance.'],
            ['Do I need a GSTIN?', 'No. If you are below the threshold, Kosh makes plain invoices. When you register, add your GSTIN and the next invoice is a tax invoice.'],
            ['What does a payment from abroad cost?', '2.9% on card payments and 1% on bank transfers, shown to you before the client pays. No charge for UPI.'],
            ['Can my accountant see my books?', 'Yes. Invite them as a viewer. They can download every invoice and the monthly GST summary, and cannot send anything.'],
            ['Can I leave whenever I want?', 'Yes. Export everything as CSV and PDF in one click and cancel from settings. No call, no form.'],
        ],
    },
    {
        type: 'cta',
        title: 'Send your next invoice from Kosh',
        text: 'Five free invoices every month, for as long as you like.',
        action: 'Start free',
    },
];

// Numbers the hero dashboard "loads".
export const DASH = {
    balance: 284650,
    owed: 96000,
    pot: 42700,
    months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    income: [118, 142, 96, 168, 151, 196],
    invoices: [
        ['#1042', 'Tandoor Studio', 48000, 'Paid'],
        ['#1041', 'Northwind Labs', 1200, 'Due', 'USD'],
        ['#1040', 'Mira Ceramics', 22500, 'Paid'],
        ['#1039', 'Slow Coffee Co.', 18000, 'Overdue'],
    ],
};
