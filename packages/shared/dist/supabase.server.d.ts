import type { SupabaseClient } from "@supabase/supabase-js";
export declare const createSupabaseServerClient: (request: Request, response: Response, { supabaseUrl, supabaseKey, }: {
    supabaseUrl: string;
    supabaseKey: string;
}) => {
    supabase: SupabaseClient;
    getUser: () => Promise<any>;
    getClientsForUser: (userId: string) => Promise<any[]>;
    response: Response;
};
//# sourceMappingURL=supabase.server.d.ts.map