import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

/*
 * `VITE_ALLOWED_HOSTS` — comma-separated hostnames the dev and preview servers
 * will answer to, on top of localhost.
 *
 * Vite rejects any request whose Host header it does not recognise, which is a
 * DNS-rebinding defence worth keeping. But it also means the dev server answers
 * "Blocked request" to everything arriving through a tunnel, where the Host is
 * whatever public name the tunnel was handed — and `./share.sh` gets a new one
 * on every single run, so no fixed hostname can be listed here.
 *
 * A leading dot matches subdomains, so the default below covers any Cloudflare
 * quick tunnel while still refusing every other unknown Host. Set
 * VITE_ALLOWED_HOSTS in .env to add names (or to replace this with a tighter
 * list); it is a comma-separated string.
 */
const TUNNEL_HOSTS = [".trycloudflare.com"]

function allowedHosts(env: Record<string, string>): string[] {
  const configured = (env.VITE_ALLOWED_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean)
  return configured.length > 0 ? configured : TUNNEL_HOSTS
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "")
  const hosts = allowedHosts(env)

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      allowedHosts: hosts,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      allowedHosts: hosts,
    },
  }
})
