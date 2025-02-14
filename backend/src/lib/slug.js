export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/o[ʻ’']/g, "o")
    .replace(/g[ʻ’']/g, "g")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
