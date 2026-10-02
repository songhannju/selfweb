import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Serve api/notify.js during `npm run dev` so visit pings can be previewed locally.
function localApi(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/notify', async (req, res) => {
        Object.assign(process.env, { NTFY_TOPIC: env.NTFY_TOPIC, NTFY_SERVER: env.NTFY_SERVER, NTFY_TOKEN: env.NTFY_TOKEN });
        let raw = '';
        for await (const chunk of req) raw += chunk;
        req.body = raw;
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); };
        const { default: handler } = await server.ssrLoadModule('/api/notify.js');
        await handler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), localApi(loadEnv(mode, process.cwd(), ''))],
}));
