/**
 * Creates a Stripe account link for onboarding
 * @param {string} accountId - The Stripe connected account ID
 * @returns {Promise<Object>} The Stripe account link object
 */
export const getAccountLink = async (accountId) => {
    // The base URL of your website
    const baseUrl = "https://babacoiffure.com";

    // Create account link with proper return_url and refresh_url
    return await stripe.accountLinks.create({
        account: accountId, // Connected account ID
        refresh_url: `${baseUrl}/onboarding_success.html?success=false&accountId=${accountId}`,
        return_url: `${baseUrl}/onboarding_success.html?success=true&accountId=${accountId}`,
        type: "account_onboarding",
    });
};

/**
 * Example usage
 */
const startOnboarding = async (accountId) => {
    try {
        const accountLink = await getAccountLink(accountId);

        // Redirect to the Stripe-hosted onboarding page
        window.location.href = accountLink.url;
    } catch (error) {
        console.error("Error creating account link:", error);
        // Handle error appropriately
    }
}; 