# BarberLink — Plateforme de réservation pour barbiers (La Réunion)

Application web multi-salons : recherche, comparaison et réservation de barbiers,
tableau de bord salon, abonnements (Essentiel / Croissance / Premium / Réseau),
promotions, parrainage, liste d'attente intelligente, paiements en ligne.

## Fichiers

| Fichier | Usage |
|---|---|
| `index.html` + `App.jsx` | **Version installable (PWA)** — à héberger. Le code est dans `App.jsx`. |
| `barberlink.html` | Version **100 % hors-ligne** (React + Babel intégrés). Double-clic pour ouvrir, aucune connexion requise. |
| `index_standalone.html` | Version autonome légère (React/Babel via CDN, internet requis au 1er chargement). |
| `manifest.json`, `sw.js`, `icon-*.png` | Fichiers PWA (installation sur écran d'accueil + hors-ligne). |
| `build/` | Scripts de génération (icônes + reconstruction des HTML autonomes). |

> Toute modification se fait dans **`App.jsx`**, puis on régénère les versions
> autonomes avec `python3 build/build_standalone.py`.

## Installer l'app sur un téléphone (PWA)

La PWA nécessite un hébergement **HTTPS** (impossible en `file://` — les navigateurs
bloquent le service worker sur un simple fichier local).

1. Héberger le dossier (les 4 fichiers `index.html`, `App.jsx`, `manifest.json`,
   `sw.js` + les `icon-*.png`) sur un service gratuit :
   - **Netlify** : glisser-déposer le dossier sur app.netlify.com/drop
   - **Vercel**, **GitHub Pages**, **Cloudflare Pages** : idem, gratuit.
2. Ouvrir l'URL https sur le téléphone :
   - **Android / Chrome** : une bannière « Installer l'application » apparaît.
   - **iPhone / Safari** : Partager → « Sur l'écran d'accueil ».
3. L'app obtient une icône, s'ouvre en plein écran et fonctionne hors-ligne.

Pour une publication sur **App Store / Google Play**, envelopper ensuite le projet
avec [Capacitor](https://capacitorjs.com) (un Mac est requis pour la build iOS).

## Recevoir les paiements

Aucun serveur n'est nécessaire : on utilise des **liens de paiement** (no-code).

1. Créer un compte **Stripe** (CB, Visa, Mastercard, Apple Pay, Google Pay),
   **PayPlug** ou **SumUp**.
2. Dans le tableau de bord du prestataire, créer un **lien de paiement**
   (« Payment Link ») — par ex. un acompte de réservation.
3. Dans BarberLink : tableau de bord salon → onglet **Paiements** → activer,
   choisir le prestataire, coller le lien, choisir acompte (%) ou total.
4. Côté client, après confirmation du RDV, un bouton **« Payer en ligne »**
   ouvre la page sécurisée du prestataire. Les virements arrivent sur le compte
   bancaire du salon.

### Encaissement automatique (montant exact par prestation)

Pour facturer le **prix réel** de chaque prestation (sans créer un lien par
coupe), le projet inclut une fonction serverless **`api/checkout.js`** (Stripe
Checkout) à déployer sur Vercel. Dans l'onglet **Paiements**, choisis la méthode
**« Automatique ✨ »** et colle l'URL de la fonction.

👉 Guide pas à pas : **[`PAIEMENTS.md`](./PAIEMENTS.md)**

| Fichier | Rôle |
|---|---|
| `api/checkout.js` | Fonction serverless : crée la session Stripe au montant exact |
| `package.json` | Dépendance `stripe` (installée par Vercel) |
| `vercel.json` | Config de déploiement Vercel |

## Développement

```bash
# Vérifier la syntaxe de App.jsx (Babel)
# Régénérer les icônes PWA
python3 build/gen_icons.py
# Régénérer barberlink.html et index_standalone.html depuis App.jsx
python3 build/build_standalone.py
```
