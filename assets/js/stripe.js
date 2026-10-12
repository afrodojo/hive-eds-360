// Stripe Integration & Payment Handler
const STRIPE_LINKS = {
    tier1: 'https://buy.stripe.com/test_tier1_individual',
    tier2: 'https://buy.stripe.com/test_tier2_researcher',
    tier3: 'https://buy.stripe.com/test_tier3_institution',
    donation: 'https://donate.stripe.com/test_donation_hive'
};

function triggerStripeCheckout(tierKey) {
    console.log(`Initiating checkout for tier: ${tierKey}`);
    
    // Check if valid URL exists
    if (STRIPE_LINKS[tierKey]) {
        window.open(STRIPE_LINKS[tierKey], '_blank');
    } else {
        // Fallback email trigger if direct Stripe URL is pending activation
        const emailSubject = encodeURIComponent(`Membership / Donation Inquiry: ${tierKey}`);
        const emailBody = encodeURIComponent(`Hello,\n\nI would like to initiate a subscription or donation for ${tierKey}.\n\nPrimary Contact: dassenseibsu@pm.me`);
        window.location.href = `mailto:dassenseibsu@pm.me?subject=${emailSubject}&body=${emailBody}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach click listeners to all buttons with data-stripe attribute
    const stripeBtns = document.querySelectorAll('[data-stripe]');
    stripeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tier = btn.getAttribute('data-stripe');
            triggerStripeCheckout(tier);
        });
    });
});
