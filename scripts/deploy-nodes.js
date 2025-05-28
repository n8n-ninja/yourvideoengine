#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const fsp = require("fs/promises")
const path = require("path")

const ENVIRONMENT = process.argv[2] || "dev"
const VOLUME_IDS = {
  dev: "ocwcggsggco0s8kos4ko0ssk",
  prod: "n4gss4oc4s8gwwsw8g00go0w",
}
const VOLUME_ID = VOLUME_IDS[ENVIRONMENT]

if (!VOLUME_ID) {
  console.error(`❌ Environnement inconnu: ${ENVIRONMENT}`)
  process.exit(1)
}

const REMOTE = "root@91.107.237.123"
const SSH_KEY = "~/.ssh/id_hetzneraiatelier"
const REMOTE_BASE = `/var/lib/docker/volumes/${VOLUME_ID}_n8n-data/_data/custom-nodes/n8n-nodes-yourvideoengine`
const REMOTE_CUSTOM_NODES = `/var/lib/docker/volumes/${VOLUME_ID}_n8n-data/_data/custom-nodes`
const DEPLOY_DIR = ".deploy_tmp"

const run = (cmd, opts = {}) => {
  console.log(`$ ${cmd}`)
  execSync(cmd, { stdio: "inherit", ...opts })
}

const scriptsDir = __dirname
const n8nNodesDir = path.join(__dirname, "../n8n-nodes")

;(async () => {
  // Aller dans le dossier n8n-nodes
  process.chdir(n8nNodesDir)

  // 1. Clean dist
  await fsp.rm("dist", { recursive: true, force: true }).catch(() => {})

  // 2. Build
  run("pnpm build")

  // 3. Prépare le dossier temporaire
  await fsp.rm(DEPLOY_DIR, { recursive: true, force: true }).catch(() => {})
  await fsp.mkdir(DEPLOY_DIR)

  // Crée le dossier dist/ dans .deploy_tmp et copie les SVG
  const distDir = path.join(DEPLOY_DIR, "dist")
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }
  if (fs.existsSync("nodes"))
    run(`cp nodes/*.svg ${DEPLOY_DIR}/dist/ 2>/dev/null || true`)

  // 4. Copie les fichiers nécessaires
  run(`cp -r dist ${DEPLOY_DIR}/`)
  if (fs.existsSync("credentials")) run(`cp -r credentials ${DEPLOY_DIR}/`)
  run(`cp package.json ${DEPLOY_DIR}/`)
  if (fs.existsSync("README.md")) run(`cp README.md ${DEPLOY_DIR}/`)
  if (fs.existsSync("n8n-nodes/nodes"))
    run(`cp n8n-nodes/nodes/*.ts ${DEPLOY_DIR}/dist/nodes/ 2>/dev/null || true`)

  if (fs.existsSync("n8n-nodes/nodes/remotion-nodes.config.ts"))
    run(
      `cp n8n-nodes/nodes/remotion-nodes.config.ts ${DEPLOY_DIR}/dist/nodes/ 2>/dev/null || true`,
    )

  // Revenir dans le dossier scripts pour la suite
  process.chdir(scriptsDir)

  // 5. Vide tous les custom nodes du serveur distant
  run(`ssh -i ${SSH_KEY} ${REMOTE} "rm -rf ${REMOTE_CUSTOM_NODES}/*"`)

  // 6. Crée le dossier distant custom-nodes et le sous-dossier du node si besoin
  run(`ssh -i ${SSH_KEY} ${REMOTE} "mkdir -p ${REMOTE_BASE}"`)

  // 7. Upload tout le dossier propre d'un coup dans le bon dossier
  run(
    `scp -i ${SSH_KEY} -r ../n8n-nodes/${DEPLOY_DIR}/* ${REMOTE}:${REMOTE_BASE}/`,
  )

  // 8. Nettoie le dossier temporaire local
  await fsp
    .rm(path.join(n8nNodesDir, DEPLOY_DIR), { recursive: true, force: true })
    .catch(() => {})

  // 9. Affiche le contenu du dossier distant pour vérification
  run(`ssh -i ${SSH_KEY} ${REMOTE} "ls -l ${REMOTE_BASE}"`)

  // 10. Redémarre le container n8n pour charger le nouveau node
  run(`ssh -i ${SSH_KEY} ${REMOTE} "docker restart n8n-${VOLUME_ID}"`)

  console.log("✅ Déploiement terminé !")
})()
