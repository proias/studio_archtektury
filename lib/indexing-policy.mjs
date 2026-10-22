// Indexing is opt-in and only applies to the production deployment.
export function indexingEnabled(env = process.env) {
  return env.CONTEXT === "production" && env.SITE_INDEXING_ENABLED === "true";
}
