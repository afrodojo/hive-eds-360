// Production Stripe Integration
const STRIPE_LINKS = {
    tier1: 'https://buy.stripe.com/4gM28leW294M9FjbsR5os01',
    tier2: 'https://buy.stripe.com/4gM7sF5lsa8Q04J9kJ5os02',
    tier3: 'https://buy.stripe.com/3cIbIVbJQep6dVz7cB5os03',
    donation: 'https://donate.stripe.com/9B6bIVaFMep68BfgNb5os04'
};

function triggerStripeCheckout(tierKey) {
    console.log(`Initiating checkout for: ${tierKey}`);
    
    if (STRIPE_LINKS[tierKey]) {
        window.open(STRIPE_LINKS[tierKey], '_blank');
    } else {
        const emailSubject = encodeURIComponent(`Membership / Donation Inquiry: ${tierKey}`);
        const emailBody = encodeURIComponent(`Hello,\n\nI would like to subscribe or donate to ${tierKey}.\n\nPrimary Contact: dassenseibsu@pm.me`);
        window.location.href = `mailto:dassenseibsu@pm.me?subject=${emailSubject}&body=${emailBody}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Wire up all elements with data-stripe attributes
    const stripeBtns = document.querySelectorAll('[data-stripe]');
    stripeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tier = btn.getAttribute('data-stripe');
            triggerStripeCheckout(tier);
        });
    });
});
