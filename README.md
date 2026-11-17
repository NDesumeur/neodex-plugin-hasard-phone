# Hasard

Laisse le hasard décider, en pixel art : une roue avec tes propres choix, des dés qui roulent, une pièce qui tourne, un nombre tiré entre deux bornes et des équipes formées au hasard. Chaque tirage a son petit son.

*English version: [README.en.md](README.en.md)*

## Version téléphone

- Un **onglet par jeu** (roue, dés, pièce, nombre, équipes) au lieu de six cartes à faire défiler.
- Le même tirage et les mêmes listes que sur PC (même identifiant `neodex.hasard`).

## La roue

- Écris tes choix dans **Choix de la roue**, un par ligne (24 au plus ; au départ : pizza, sushis, burger, pâtes, tacos, salade). La roue se redessine aussitôt, une part par choix.
- **Clique sur la roue**, sur **Tourner** ou appuie sur **Espace** : elle fait plusieurs tours en cliquetant et ralentit ; la part gagnante s'allume et son nom s'affiche en grosses lettres.
- **Retirer le gagnant** : chaque gagnant quitte la roue et s'ajoute à l'**ordre de passage**, jusqu'à ce que tout le monde soit passé. **Tout remettre** recommence ; ta liste, elle, ne change pas.

## Les dés

Choisis de **1 à 6 dés** et leur nombre de **faces** : 4, 6, 8, 10, 12, 20 ou 100. **Lancer** les fait rouler sur un tapis : ils rebondissent sur les bords (avec le bruit), changent de face en roulant, puis s'arrêtent ; le **total** s'affiche en dessous. Les dés à 6 faces montrent leurs points, les autres leur nombre.

## Pile ou face

**Lancer la pièce** : elle monte en tournant (un tintement à chaque demi-tour), retombe et rebondit, puis **PILE** ou **FACE** s'affiche, à une chance sur deux.

## Nombre au hasard

Indique un minimum et un maximum (**De** … à …, nombres négatifs compris), puis **Tirer** : les chiffres défilent puis s'arrêtent sur un nombre entier entre les deux, bornes comprises.

## Équipes

Écris les noms, un par ligne, choisis de **2 à 8 équipes**, puis **Former les équipes** : les noms sont mélangés et répartis en équipes de même taille (à une personne près), chacune de sa couleur.

## Données et synchronisation

Tes choix de roue, tes noms et tes réglages sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Hasard → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
