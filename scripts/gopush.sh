#!/bin/bash

# 🛠 Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}→ Staging changes...${NC}"
git add .

# Vérifie s'il y a des fichiers à commit
if git diff --cached --quiet; then
  echo -e "${RED}✗ Aucun changement à commit.${NC}"
  exit 0
fi

# Prépare le message avec timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="Auto commit $TIMESTAMP"

echo -e "${YELLOW}→ Commit en cours : '${COMMIT_MSG}'${NC}"
git commit -m "$COMMIT_MSG"

echo -e "${YELLOW}→ Push vers la branche distante...${NC}"
git push

echo -e "${GREEN}✓ Push terminé avec succès !${NC}"
