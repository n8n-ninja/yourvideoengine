import { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router';
import { supabase } from '../supabase.client';

export default function Protected() {
  const { client_slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }
      // TODO: fetch les slugs autorisés pour ce user
      // Ici, on autorise tout pour le POC
      setAllowed(true);
      setLoading(false);
    })();
  }, [client_slug, navigate]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard client : {client_slug}</h1>
        {/* Dashboard ou <Outlet /> pour sous-routes */}
        <Outlet />
      </div>
    </div>
  );
} 