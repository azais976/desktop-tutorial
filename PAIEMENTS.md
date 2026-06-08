# 💳 Encaissement automatique Stripe — Guide A → Z

Ce guide met en place le **paiement au montant exact** de chaque prestation
(pas besoin de créer un lien Stripe par coupe). Le client paie le prix réel de
sa réservation, l'argent arrive sur **ton compte bancaire** via Stripe.

> ⏱️ ~10 minutes. Une seule étape exige **ta clé secrète Stripe** : c'est
> pour ça qu'elle doit être faite par toi (la clé ne doit jamais être partagée).

---

## 🚀 Déploiement express (bouton 1-clic)

Le bouton ci-dessous fait **tout** automatiquement : il copie le projet,
configure Vercel, et te demande **uniquement** de coller ta clé Stripe.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fazais976%2Fdesktop-tutorial&env=STRIPE_SECRET_KEY&envDescription=Votre%20cl%C3%A9%20secr%C3%A8te%20Stripe%20(commence%20par%20sk_)&envLink=https%3A%2F%2Fdashboard.stripe.com%2Fapikeys&project-name=barberlink-paiements&repository-name=barberlink-paiements)

**Lien direct** (si le bouton ne s'affiche pas) :
```
https://vercel.com/new/clone?repository-url=https://github.com/azais976/desktop-tutorial&env=STRIPE_SECRET_KEY&envDescription=Cle%20secrete%20Stripe&envLink=https://dashboard.stripe.com/apikeys&project-name=barberlink-paiements&repository-name=barberlink-paiements
```

Les 3 clics :
1. Connecte-toi avec **GitHub** (ça crée un petit dépôt `barberlink-paiements`).
2. Quand Vercel demande **`STRIPE_SECRET_KEY`**, colle ta clé `sk_test_…`
   (où la trouver : Stripe → Développeurs → Clés API).
3. Clique **Deploy**. Tu obtiens une URL → ton endpoint est
   `https://barberlink-paiements-xxx.vercel.app/api/checkout`.

Puis va dans l'app → onglet **Paiements** → méthode **Automatique** → colle
cette URL → **Enregistrer**. Terminé ✅

> Le détail manuel complet reste décrit plus bas, au cas où.

---

## Comment ça marche

```
Client réserve  ──>  App (GitHub Pages)  ──fetch──>  Fonction Vercel  ──>  Stripe Checkout
                                                      (ta clé secrète)        (page sécurisée)
                                                                                    │
                                                                          paiement ──> ton IBAN
```

- L'app appelle ta fonction `api/checkout.js` avec le **montant exact**.
- La fonction crée une session **Stripe Checkout** et renvoie l'URL de paiement.
- Le client est redirigé vers Stripe (CB, Apple Pay, Google Pay), paie, revient.
- Ta **clé secrète** reste sur le serveur Vercel, jamais dans le navigateur.

---

## Étape 1 — Récupérer ta clé secrète Stripe

1. Va sur **https://dashboard.stripe.com** (crée le compte si besoin).
2. En haut à droite, choisis **Test** (pour essayer) ou **Live** (pour de vrai).
3. Menu **Développeurs → Clés API**.
4. Copie la **clé secrète** :
   - Test : commence par `sk_test_...`
   - Réel : commence par `sk_live_...`

⚠️ Ne colle JAMAIS cette clé dans l'app ou dans un message. Elle va uniquement
dans Vercel (étape 3).

---

## Étape 2 — Déployer la fonction sur Vercel

1. Va sur **https://vercel.com** → **Sign up** → **Continue with GitHub**.
2. Clique **Add New… → Project**.
3. Sélectionne ton dépôt **`desktop-tutorial`** → **Import**.
4. Laisse les réglages par défaut (Framework : « Other »). **Ne clique pas
   encore sur Deploy** — va d'abord à l'étape 3 (variable d'environnement).

> Le dossier `api/` et le fichier `package.json` (déjà dans le dépôt) sont
> détectés automatiquement par Vercel comme fonction serverless.

---

## Étape 3 — Ajouter ta clé secrète dans Vercel

Toujours sur l'écran d'import (ou ensuite : **Settings → Environment Variables**) :

1. Ajoute une variable :
   - **Name** : `STRIPE_SECRET_KEY`
   - **Value** : ta clé `sk_test_...` ou `sk_live_...`
2. (Optionnel, recommandé en production) ajoute aussi :
   - **Name** : `ALLOWED_ORIGIN`
   - **Value** : `https://azais976.github.io`
3. Clique **Deploy**.

Au bout d'une minute, Vercel te donne une URL type
`https://desktop-tutorial-xxxx.vercel.app`.

➡️ **L'URL de ta fonction** est donc :
```
https://desktop-tutorial-xxxx.vercel.app/api/checkout
```

---

## Étape 4 — Brancher l'app

1. Ouvre l'app → tableau de bord salon → onglet **Paiements**.
2. Coche **Activer le paiement en ligne**.
3. Méthode d'encaissement → choisis **Automatique ✨**.
4. Colle l'URL `https://…vercel.app/api/checkout` dans **URL de la fonction**.
5. Choisis **Acompte (%)** ou **Total**, puis **Enregistrer**.

C'est fini ✅ — à la prochaine réservation, le bouton « Payer en ligne »
encaisse le **montant exact** de la prestation.

---

## Étape 5 — Tester

- Avec une clé **Test** (`sk_test_`), utilise la carte de test Stripe :
  `4242 4242 4242 4242`, date future, CVC `123`.
- Vérifie le paiement dans **Stripe → Paiements**.
- Quand tout marche, repasse Stripe en **Live**, remplace la variable
  `STRIPE_SECRET_KEY` par la clé `sk_live_...`, redeploie. 🎉

---

## Suivi des paiements

Chaque paiement porte la **référence du RDV** (`client_reference_id` +
metadata `rdvId`), visible dans Stripe → Paiements → détail. Pratique pour
rapprocher un encaissement d'un rendez-vous.

---

## Et pour plusieurs salons indépendants ? (évolution)

Cette fonction encaisse sur **un seul compte Stripe** (le tien). Si demain
chaque salon doit recevoir l'argent sur **son propre** compte, l'évolution
s'appelle **Stripe Connect** (chaque salon connecte son compte, BarberLink
route le paiement et peut prélever une commission). Dis-le moi quand tu veux,
je te le mets en place.
