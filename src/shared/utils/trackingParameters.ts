const TRACKING_PARAMETER_NAMES = new Set(["fbclid", "gclid"]);

function isTrackingParameter(name: string): boolean {
  const normalizedName = name.toLowerCase();
  return TRACKING_PARAMETER_NAMES.has(normalizedName) || normalizedName.startsWith("utm_");
}

export function getUrlWithoutTrackingParameters(urlValue: string): string | null {
  const url = new URL(urlValue);
  let removedTrackingParameter = false;

  for (const name of [...url.searchParams.keys()]) {
    if (!isTrackingParameter(name)) continue;

    url.searchParams.delete(name);
    removedTrackingParameter = true;
  }

  if (!removedTrackingParameter) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

export function removeTrackingParametersFromAddressBar(): void {
  const cleanUrl = getUrlWithoutTrackingParameters(window.location.href);
  if (cleanUrl === null) return;

  window.history.replaceState(window.history.state, "", cleanUrl);
}
