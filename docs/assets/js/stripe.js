const STRIPE_PAYMENT_LINKS = {
    member_paid: 'https://buy.stripe.com/4gM28leW294M9FjbsR5os01',
    business:    'https://buy.stripe.com/4gM7sF5lsa8Q04J9kJ5os02',
    academic:    'https://buy.stripe.com/3cIbIVbJQep6dVz7cB5os03',
    donation:    'https://donate.stripe.com/9B6bIVaFMep68BfgNb5os04'
};

function triggerStripeCheckout(tier) {
    const targetUrl = STRIPE_PAYMENT_LINKS[tier];
    if (targetUrl) window.location.href = targetUrl;
}

function processStripeDonation() {
    window.location.href = STRIPE_PAYMENT_LINKS['donation'];
}
