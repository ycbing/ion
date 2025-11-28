import { useEffect, useMemo, useState } from "react";

type Provider = {
  name: string;
  label: string;
  baseUrl: string;
  models: string[];
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function App() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await fetch(`${API_BASE}/providers`);

        if (!response.ok) {
          throw new Error(`Failed to load providers: ${response.status}`);
        }

        const payload = (await response.json()) as { providers?: Provider[] };
        setProviders(payload.providers ?? []);
        setStatus("ready");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    void loadProviders();
  }, []);

  const subtitle = useMemo(() => {
    if (status === "loading") {
      return "Loading provider catalog...";
    }

    if (status === "error") {
      return "Unable to reach backend. Check that the API is running and CORS is configured.";
    }

    if (providers.length === 0) {
      return "No providers are enabled. Update AI_PROVIDERS in your env configuration.";
    }

    return `Connected to ${providers.length} provider${providers.length === 1 ? "" : "s"}.`;
  }, [providers.length, status]);

  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.75rem", marginBottom: "0.75rem" }}>Content Generator</h1>
        <p style={{ color: "#555", lineHeight: 1.6 }}>{subtitle}</p>
      </header>

      {status === "ready" && providers.length > 0 && (
        <section style={{ display: "grid", gap: "1.25rem" }}>
          {providers.map((provider) => (
            <article
              key={provider.name}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{provider.label}</h2>
              <p style={{ marginBottom: "0.75rem", color: "#4b5563" }}>{provider.baseUrl}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {provider.models.map((model) => (
                  <span
                    key={model}
                    style={{
                      background: "#eef2ff",
                      borderRadius: "999px",
                      color: "#4338ca",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      padding: "0.35rem 0.75rem",
                    }}
                  >
                    {model}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
