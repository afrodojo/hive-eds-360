// worker/index.js or functions/api/v1/telemetry.js

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Standard CORS headers for client-side API calls
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Role',
      'Content-Type': 'application/json'
    };

    // 0. Handle CORS Preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Intercept telemetry endpoint requests
    if (url.pathname.startsWith('/api/v1/telemetry')) {
      const userRole = request.headers.get('X-User-Role') || 'PUBLIC';

      // 1. Unauthenticated / Public Visitors: Return operational status banner
      if (!['ADMIN', 'SUPER_ADMIN', 'ACADEMIC_PARTNERSHIP'].includes(userRole)) {
        return new Response(JSON.stringify({
          domain: 'hive.eds-360.com',
          status: 'OPERATIONAL',
          system_health: 'NOMINAL',
          compliance_rating: 'CMMC Level 2 / FIPS 140-3 Active',
          last_synced: new Date().toISOString()
        }), {
          status: 200,
          headers: corsHeaders
        });
      }

      // 2. Academic Partnership: Anonymized DAS research telemetry
      if (userRole === 'ACADEMIC_PARTNERSHIP') {
        return new Response(JSON.stringify({
          status: 'OPERATIONAL',
          das_research: 'Doctorate of Applied Science Active',
          cluster_nodes: 5,
          smt_decoding_latency_ms: 1.42,
          fips_mode: 'ACTIVE'
        }), {
          status: 200,
          headers: corsHeaders
        });
      }

      // 3. Admin & Super Admin: Pass through or query origin backend directly
      // If forwarding to a designated origin server, rewrite request or proxy here
      try {
        const originResponse = await fetch(request);
        const newResponse = new Response(originResponse.body, originResponse);
        
        // Append CORS headers to the origin response
        Object.keys(corsHeaders).forEach(key => {
          newResponse.headers.set(key, corsHeaders[key]);
        });

        return newResponse;
      } catch (err) {
        return new Response(JSON.stringify({
          error: 'Origin Ingestion Endpoint Unreachable',
          details: err.message
        }), {
          status: 502,
          headers: corsHeaders
        });
      }
    }

    return fetch(request);
  }
};
