import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

console.log("Starting create-user Edge Function...");

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

    // Pour la création d'utilisateur, on n'accepte que le service_role_key
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (token !== serviceRoleKey) {
        throw new Error("Invalid token: only service_role_key is allowed");
    }

    return true;
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

        const { email, password, user_metadata } = await req.json();

        if (!email || typeof email !== "string") {
            return new Response(
                JSON.stringify({ error: "Missing or invalid email" }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        if (!password || typeof password !== "string" || password.length < 6) {
            return new Response(
                JSON.stringify({
                    error: "Password must be at least 6 characters",
                }),
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

        // Créer l'utilisateur avec l'API Admin
        const { data: { user }, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // L'email est automatiquement confirmé
            user_metadata,
        });

        if (error) {
            console.error("User creation error:", error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({
                success: true,
                user: {
                    id: user?.id,
                    email: user?.email,
                    user_metadata: user?.user_metadata,
                },
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
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
