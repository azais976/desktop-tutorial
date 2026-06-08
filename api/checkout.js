// BarberLink — Fonction serverless : crée une session Stripe Checkout au
// montant EXACT de la prestation, puis renvoie l'URL de paiement sécurisée.
//
// Déploiement : Vercel (dossier /api détecté automatiquement comme fonction).
// Variable d'environnement requise : STRIPE_SECRET_KEY (clé secrète Stripe).
// La clé secrète reste UNIQUEMENT côté serveur — jamais envoyée au navigateur.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Origine(s) autorisée(s) à appeler la fonction. '*' = toutes (pratique au
// départ). Pour verrouiller, mettez l'URL de votre app, ex. :
//   ALLOWED_ORIGIN = https://azais976.github.io
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

export default async function handler(req, res) {
  // CORS — autorise l'app (hébergée ailleurs) à appeler cette fonction
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY manquante côté serveur' });
  }

  try {
    // Vercel parse déjà le JSON ; on tolère aussi une string brute
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { amount, label, rdvId, email, successUrl, cancelUrl } = body;

    const cents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(cents) || cents < 50) {
      return res.status(400).json({ error: 'Montant invalide (minimum 0,50 €)' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Active automatiquement tous les moyens de paiement configurés dans
      // votre tableau de bord Stripe (CB, Apple Pay, Google Pay, etc.)
      automatic_payment_methods: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: (label || 'Prestation BarberLink').slice(0, 250) },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      client_reference_id: rdvId ? String(rdvId).slice(0, 200) : undefined,
      customer_email: email || undefined,
      // Métadonnées utiles pour le rapprochement côté Stripe
      metadata: { rdvId: rdvId ? String(rdvId) : '', prestation: label || '' },
      success_url: successUrl || 'https://example.com/?paiement=ok',
      cancel_url: cancelUrl || 'https://example.com/?paiement=annule',
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Erreur Stripe' });
  }
}
