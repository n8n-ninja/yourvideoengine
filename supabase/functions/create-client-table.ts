import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

console.log("Starting create-client-table Edge Function...");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Fonction pour vérifier l'authentification
const authenticate = async (req: Request) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
        throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        throw new Error("Missing token");
    }

    // Vérifier si c'est le service_role_key
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (token === serviceRoleKey) {
        return true;
    }

    // Si ce n'est pas le service_role_key, vérifier si c'est un token JWT valide
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) {
        throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, anonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        throw new Error("Invalid token");
    }

    return user;
};

serve(async (req) => {
    try {
        // Handle CORS preflight requests
        if (req.method === "OPTIONS") {
            return new Response("ok", { headers: corsHeaders });
        }

        if (req.method !== "POST") {
            return new Response(
                JSON.stringify({ error: "Method Not Allowed" }),
                {
                    status: 405,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        // Vérifier l'authentification
        try {
            await authenticate(req);
        } catch (authError: unknown) {
            const errorMessage = authError instanceof Error
                ? authError.message
                : "Authentication failed";
            return new Response(
                JSON.stringify({ error: errorMessage }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const { slug, table_name } = await req.json();

        if (!slug || typeof slug !== "string") {
            return new Response(
                JSON.stringify({ error: "Missing or invalid slug" }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        if (!table_name || typeof table_name !== "string") {
            return new Response(
                JSON.stringify({ error: "Missing or invalid table_name" }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing environment variables");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase.rpc("create_client_table", {
            slug_param: slug,
            table_name_param: table_name,
        });

        if (error) {
            console.error("RPC error:", error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
});
