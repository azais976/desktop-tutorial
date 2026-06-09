# 🚀 Déployer BarberLink sur toutes les plateformes

BarberLink est une **PWA** (Progressive Web App). Un seul code, installable
partout : iPhone, Android, Windows, Mac, Linux — et même publiable sur les
stores (Google Play, Microsoft Store).

---

## 1. Le site est déjà en ligne ✅

| Page | Adresse |
|------|---------|
| **L'application** | https://azais976.github.io/desktop-tutorial/ |
| **Page d'installation** (cible du QR code) | https://azais976.github.io/desktop-tutorial/install.html |
| **Affiche à imprimer (A4)** | https://azais976.github.io/desktop-tutorial/affiche.html |

Hébergement : **GitHub Pages**, gratuit, HTTPS automatique. Chaque `push` sur
la branche `main` met le site à jour en ~1 minute.

---

## 2. Installation directe (aucun store nécessaire)

C'est le mode recommandé : le client scanne le **QR code de l'affiche** →
arrive sur `install.html` → suit les 3 étapes adaptées à son appareil.

- **iPhone / iPad** : Safari → Partager → « Sur l'écran d'accueil »
- **Android** : Chrome → bannière « Installer l'application » (ou menu ⋮)
- **Ordinateur** : Chrome / Edge → icône « installer » ⊕ dans la barre d'adresse

L'app s'installe alors comme une vraie application (icône, plein écran,
fonctionne hors-ligne).

---

## 3. (Optionnel) Publier sur les app stores

Si tu veux une présence sur les stores, **PWABuilder** (outil gratuit de
Microsoft) emballe la PWA en application native, sans réécrire le code.

### Étapes communes
1. Va sur **https://www.pwabuilder.com**
2. Colle l'URL : `https://azais976.github.io/desktop-tutorial/`
3. PWABuilder analyse le manifest et les icônes (déjà prêts ✅)

### 🤖 Google Play (Android)
- Clique **Package for stores → Android**
- Télécharge le `.zip` : il contient le `.aab` (à envoyer au store) **et** un
  fichier `assetlinks.json` avec ton **empreinte SHA-256**.
- Ouvre ce `assetlinks.json` et copie l'empreinte `sha256_cert_fingerprints`
  dans le fichier **`.well-known/assetlinks.json`** de ce dépôt (remplace
  `REMPLACER_PAR_VOTRE_EMPREINTE_SHA256`), puis `push`. ➜ l'app s'ouvre alors
  en plein écran, sans barre de navigateur (exactement comme Planity).
- Compte développeur Google Play : **25 $ une seule fois**
- Dépose le `.aab` dans la Google Play Console → ton app est sur le Play Store.

### 🪟 Microsoft Store (Windows)
- Clique **Package for stores → Windows**
- Compte développeur Microsoft : gratuit pour les particuliers
- Dépose le paquet `.msixbundle`

### 🍎 Apple App Store (iPhone)
- PWABuilder génère aussi un projet iOS, à ouvrir dans **Xcode** (Mac requis)
- Compte développeur Apple : **99 $/an**
- ⚠️ Apple est plus strict : pour beaucoup de salons, le **QR + installation
  Safari** suffit largement et évite ces frais.

---

## 4. Mettre à jour l'app

Tout est automatique : il suffit de modifier le code et de `push` sur `main`.
Le **service worker** (`sw.js`) sert toujours la dernière version en ligne et
garde une copie hors-ligne. À chaque grosse mise à jour, on incrémente la
version du cache (`barberlink-vX`) pour forcer le rafraîchissement.

---

## 5. Récapitulatif des fichiers PWA

| Fichier | Rôle |
|---------|------|
| `manifest.json` | Nom, icônes, couleurs, raccourcis (rend l'app installable) |
| `sw.js` | Service worker : hors-ligne + mises à jour |
| `icon-192.png` / `icon-512.png` | Icônes de l'app (3D) |
| `apple-touch-icon.png` | Icône iOS |
| `install.html` | Page d'installation intelligente (cible du QR) |
| `affiche.html` | Affiche A4 imprimable avec QR code |
| `qr-install.svg` | QR code vectoriel (net à toute taille) |

> 💡 Pour regénérer le QR code (si l'URL change) :
> `python3 build/gen_qr.py`
