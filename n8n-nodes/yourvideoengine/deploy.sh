#!/bin/sh

set -e

# 1. Build le projet
pnpm build

# 2. Prépare le dossier temporaire
DEPLOY_DIR=.deploy_tmp
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# 3. Copie uniquement ce qu'il faut
cp -r dist $DEPLOY_DIR/
cp package.json $DEPLOY_DIR/
[ -f README.md ] && cp README.md $DEPLOY_DIR/

# 4. Crée le dossier distant custom-nodes et le sous-dossier du node si besoin
ssh -i ~/.ssh/id_hetzneraiatelier root@91.107.237.123 "mkdir -p /var/lib/docker/volumes/n8ocsk4gococwgso80cgo444_n8n-data/_data/custom-nodes/n8n-nodes-yourvideoengine"

# 5. Upload tout le dossier propre d'un coup dans le bon dossier
scp -i ~/.ssh/id_hetzneraiatelier -r $DEPLOY_DIR/* root@91.107.237.123:/var/lib/docker/volumes/n8ocsk4gococwgso80cgo444_n8n-data/_data/custom-nodes/n8n-nodes-yourvideoengine/

# 6. Nettoie le dossier temporaire local
# rm -rf $DEPLOY_DIR

# 7. Affiche le contenu du dossier distant pour vérification
ssh -i ~/.ssh/id_hetzneraiatelier root@91.107.237.123 "ls -l /var/lib/docker/volumes/n8ocsk4gococwgso80cgo444_n8n-data/_data/custom-nodes/n8n-nodes-yourvideoengine"

echo "✅ Déploiement terminé !"