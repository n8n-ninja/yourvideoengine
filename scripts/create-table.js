#!/usr/bin/env node

require("dotenv").config()
const { createClient } = require("@supabase/supabase-js")

const [tableName, clientSlug] = process.argv.slice(2)

if (!tableName || !clientSlug) {
  console.error("❌ Usage: pnpm create-table <table_name> <client_slug>")
  process.exit(1)
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log(`🛠 Creating table '${tableName}' for client '${clientSlug}'...`)

  const { data, error } = await supabase.rpc("create_client_table", {
    slug_param: clientSlug,
    table_name_param: tableName,
  })

  if (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }

  console.log("✅ Table created successfully with RLS policies.")
}

run()
