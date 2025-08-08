// Language resources for EN and FR
// Remove the const translations = { ... } block entirely

// Utility object for Stripe and other logic
const babacoiffureUtils = {
  getAccountLink: async (accountId) => {
    // The base URL of your website
    const baseUrl = "https://babacoiffure.com";
    // Create account link with proper return_url and refresh_url
    return await stripe.accountLinks.create({
      account: accountId, // Connected account ID
      refresh_url: `${baseUrl}/onboarding_success.html?success=false&accountId=${accountId}`,
      return_url: `${baseUrl}/onboarding_success.html?success=true&accountId=${accountId}`,
      type: "account_onboarding",
    });
  }
};

// Export for use in language switcher logic
window.translations = window.translations || {};
window.translations.en = {
  hero: {
    title: "Simplify Your Hairdressing Business",
    tagline: "Automated appointment management for independent hairdressers",
    app_store: "Download on the App Store",
    play_store: "Coming soon to Android",
    tutorials_cta: 'See Tutorials'
  },
  features: [
    { title: "Smart Scheduling", desc: "Effortlessly manage your appointments and client bookings" },
    { title: "Service Personalization", desc: "Create and manage your unique service offerings" },
    { title: "Social Media Integration", desc: "Generate shareable booking links for Instagram" }
  ],
  features_full: {
    clients: [
      { title: 'Provider & Service Discovery', desc: 'View hairstylist profiles and browse services.' },
      { title: 'Advanced Booking', desc: 'Select services, add-ons, variations, and book with an interactive calendar.' },
      { title: 'Flexible Location', desc: 'Choose service at home or provider’s location.' },
      { title: 'Booking Summary', desc: 'Review all details before confirming.' },
      { title: 'Payments & Scheduling', desc: 'Pay securely, view appointment history, receive notifications, and reschedule.' },
    ],
    providers: [
      { title: 'Service & Profile Management', desc: 'Create, edit, and delete services with complex pricing and image galleries.' },
      { title: 'Shareable Profile', desc: 'Share a unique booking link with clients.' },
      { title: 'Availability & Appointments', desc: 'Manage calendar, accept/reject requests, and propose new times.' },
      { title: 'Payments & Subscriptions', desc: 'Connect bank account, receive payouts, and manage premium plans.' },
    ],
    shared: [
      { title: 'Account & Profile', desc: 'Secure registration, login, password recovery, and profile updates.' },
      { title: 'Real-time Communication', desc: '1:1 chat and push notifications for messages and appointments.' },
      { title: 'Safety & Moderation', desc: 'Block or report users for safety.' },
      { title: 'Multilingual', desc: 'Switch between English and French.' },
    ]
  },
  testimonials: [
    { text: "Great app, makes my booking process so much easier!", author: "— John, Stylist (EN)" },
    { text: "Super intuitive and saves me hours every week.", author: "— Sarah, Salon Owner (EN)" },
    { text: "My clients love the easy booking experience!", author: "— Emily, Hairdresser (EN)" },
    { text: "Finally, a tool that understands hairdressers!", author: "— Mike, Barber (EN)" },
    { text: "The notifications and reminders are a game changer.", author: "— Lisa, Freelancer (EN)" }
  ],
  footer: {
    terms: "Terms of Use",
    support: "Support",
    privacy: "Privacy Policy",
    copyright: "All rights reserved."
  },
  social: {
    title: "Follow Us",
    subtitle: "Stay connected with our latest updates and hair styling tips"
  },
  ai_page: {
    hero: {
      title: "Discover Babacoiffure AI",
      tagline: "Manage your appointments directly via Instagram DM with our artificial intelligence."
    },
    features: {
      title: "Key AI Features"
    },
    newsletter: {
      title: "Sign Up for Our AI Newsletter",
      description: "Be the first to know about the latest advancements in our AI and new features.",
      placeholder: "Your email address",
      button: "Sign Up"
    }
  }
};
window.translations.fr = {
  hero: {
    title: "Simplifiez Votre Activité de Coiffure",
    tagline: "Gestion automatisée des rendez-vous pour coiffeurs indépendants",
    app_store: "Télécharger sur l'App Store",
    play_store: "Bientôt disponible sur Android",
    tutorials_cta: 'Voir les tutoriels'
  },
  features: [
    { title: "Planification Intelligente", desc: "Gérez sans effort vos rendez-vous et réservations clients" },
    { title: "Personnalisation des Services", desc: "Créez et gérez vos offres de services uniques" },
    { title: "Intégration Réseaux Sociaux", desc: "Générez des liens de réservation partageables sur Instagram" }
  ],
  features_full: {
    clients: [
      { title: 'Découverte de prestataires & services', desc: 'Consultez les profils des coiffeurs et explorez leurs services.' },
      { title: 'Réservation avancée', desc: 'Sélectionnez des services, options, variantes et réservez via un calendrier interactif.' },
      { title: 'Lieu flexible', desc: 'Choisissez le service à domicile ou chez le prestataire.' },
      { title: 'Résumé de réservation', desc: 'Vérifiez tous les détails avant de confirmer.' },
      { title: 'Paiements & planning', desc: 'Payez en toute sécurité, consultez l’historique, recevez des notifications et replanifiez.' },
    ],
    providers: [
      { title: 'Gestion des services & profil', desc: 'Créez, modifiez, supprimez des services avec tarification complexe et galerie d’images.' },
      { title: 'Profil partageable', desc: 'Partagez un lien de réservation unique avec vos clients.' },
      { title: 'Disponibilité & rendez-vous', desc: 'Gérez le calendrier, acceptez/refusez les demandes, proposez de nouveaux créneaux.' },
      { title: 'Paiements & abonnements', desc: 'Connectez un compte bancaire, recevez des paiements, gérez les offres premium.' },
    ],
    shared: [
      { title: 'Compte & profil', desc: 'Inscription sécurisée, connexion, récupération de mot de passe, mise à jour du profil.' },
      { title: 'Communication en temps réel', desc: 'Chat 1:1 et notifications pour messages et rendez-vous.' },
      { title: 'Sécurité & modération', desc: 'Bloquez ou signalez des utilisateurs pour votre sécurité.' },
      { title: 'Multilingue', desc: 'Basculez entre anglais et français.' },
    ]
  },
  testimonials: [
    { text: "Super application, très pratique pour gérer mes rendez-vous !", author: "— Marie, Coiffeuse (FR)" },
    { text: "Interface intuitive, je gagne un temps fou chaque semaine.", author: "— Sophie, Gérante de salon (FR)" },
    { text: "Mes clients adorent la réservation en ligne !", author: "— Emma, Coiffeuse (FR)" },
    { text: "Enfin un outil pensé pour les coiffeurs !", author: "— Marc, Barbier (FR)" },
    { text: "Les rappels et notifications sont top.", author: "— Léa, Indépendante (FR)" }
  ],
  footer: {
    terms: "Conditions d'Utilisation",
    support: "Support",
    privacy: "Politique de Confidentialité",
    copyright: "Tous droits réservés."
  },
  social: {
    title: "Suivez-nous",
    subtitle: "Restez connecté avec nos dernières actualités et conseils de coiffure"
  },
  ai_page: {
    hero: {
      title: "Découvrez l'IA Babacoiffure",
      tagline: "Gérez vos rendez-vous directement via Instagram DM grâce à notre intelligence artificielle."
    },
    features: {
      title: "Fonctionnalités Clés de l'IA"
    },
    newsletter: {
      title: "Inscrivez-vous à notre Newsletter IA",
      description: "Soyez les premiers informés des dernières avancées de notre IA et des nouvelles fonctionnalités.",
      placeholder: "Votre adresse email",
      button: "S'inscrire"
    }
  }
};
window.babacoiffureUtils = babacoiffureUtils; 