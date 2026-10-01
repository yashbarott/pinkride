export function isDemoMode(deploymentEnvironment: string, configuredMode: string) {
  return deploymentEnvironment !== "production" && configuredMode === "demo";
}