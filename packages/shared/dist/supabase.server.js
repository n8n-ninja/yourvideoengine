import { createServerClient } from "@supabase/ssr";
import { getClientSlug } from "./utils/get-client-slug";
const isProd = process.env.NODE_ENV === "production";
const domain = isProd ? ".yourvideoengine.com" : ".yourvideoengine.local";
export const createSupabaseServerClient = (request, response, { supabaseUrl, supabaseKey, }) => {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll: async () => {
                const cookieHeader = request.headers.get("cookie") ?? "";
                return cookieHeader.split(";").map((cookie) => {
                    const [name, ...rest] = cookie.trim().split("=");
                    return {
                        name,
                        value: rest.join("="),
                    };
                });
            },
            setAll: async (cookies) => {
                for (const { name, value } of cookies) {
                    response.headers.append("Set-Cookie", `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Domain=${domain}`);
                }
            },
        },
    });
    const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        return data.user;
    };
    const getClientsForUser = async (userId) => {
        const { data, error } = await supabase
            .from("client_users")
            .select("client_id, clients:client_id(id, name, slug)")
            .eq("user_id", userId);
        if (error)
            throw new Error(error.message);
        return (data ?? []).map((row) => row.clients);
    };
    const verifyClientAccess = async (request) => {
        const user = await getUser();
        const clientSlug = getClientSlug(request);
        console.log("*****");
        console.log(user);
        console.log(clientSlug);
        console.log("*****");
        if (!user || !user.id || !clientSlug)
            return false;
        const { data, error } = await supabase
            .from("client_users")
            .select("client_id, clients:client_id(id, name, slug)")
            .eq("user_id", user?.id);
        if (error) {
            console.error("Error fetching client data:", error);
            return false;
        }
        const client = data.find((item) => item.clients?.slug === clientSlug);
        return !!client;
    };
    return {
        supabase,
        getUser,
        getClientsForUser,
        verifyClientAccess,
        response,
    };
};
