export const addSearchParams = (url: URL, existParams: [string, string][]) => {
  return new URL(
    `${url.origin}${url.pathname}?${new URLSearchParams([
      ...Array.from(url.searchParams.entries()),
      ...existParams,
    ])}`
  );
};
