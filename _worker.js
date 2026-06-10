// Proxy para eventos en vivo — se despliega junto al index.html
// Cloudflare Pages lo detecta automáticamente como Worker
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Solo interceptar /proxy
    if (!url.pathname.startsWith('/proxy')) {
      // Pasar el resto de peticiones al sitio normal
      return fetch(request);
    }

    const target = url.searchParams.get('url');
    if (!target) return new Response('Falta ?url=', { status: 400 });

    const res = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://canchatv.online/'
      }
    });

    return new Response(res.body, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=120'
      }
    });
  }
};
