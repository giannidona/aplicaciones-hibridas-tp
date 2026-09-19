export function createPage(title, content) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Sadona</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #faf7f5; color: #2b2b2b; }
    header { background: #1f1a2e; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; }
    header a { color: #fff; text-decoration: none; font-weight: bold; font-size: 1.4rem; letter-spacing: 0.5px; }
    header nav a { font-size: 0.95rem; font-weight: normal; margin-left: 1.5rem; opacity: 0.85; }
    header nav a:hover { opacity: 1; }
    main { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    h1 { margin-bottom: 1.5rem; color: #1f1a2e; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem; }
    .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); transition: transform 0.15s ease; text-decoration: none; color: inherit; display: block; }
    .card:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
    .card img { width: 100%; height: 160px; object-fit: cover; background: #eee; }
    .card-body { padding: 0.9rem; }
    .card-body .brand { font-size: 0.75rem; text-transform: uppercase; color: #a06cd5; font-weight: 600; }
    .card-body h3 { font-size: 0.95rem; margin: 0.25rem 0; }
    .card-body .price { font-weight: bold; color: #1f1a2e; margin-top: 0.4rem; }
    .detail { background: #fff; border-radius: 12px; padding: 2rem; display: flex; gap: 2rem; flex-wrap: wrap; }
    .detail img { width: 300px; max-width: 100%; border-radius: 8px; object-fit: cover; }
    .detail .info { flex: 1; min-width: 250px; }
    .detail .price { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; }
    footer { text-align: center; padding: 2rem; color: #999; font-size: 0.85rem; }
  </style>
</head>
<body>
  <header>
    <a href="/">Sadona</a>
    <nav><a href="/">Inicio</a></nav>
  </header>
  <main>${content}</main>
  <footer>Sadona — Catálogo de productos</footer>
</body>
</html>`;
}

export function renderMenu(categories) {
  const items = categories
    .map(
      (c) => `
    <a class="card" href="/categorias/${c._id}">
      <img src="${c.image}" alt="${c.name}">
      <div class="card-body"><h3>${c.name}</h3></div>
    </a>`,
    )
    .join("");
  return `<h1>Nuestras categorías</h1><div class="grid">${items}</div>`;
}

export function renderProductGrid(title, products) {
  const items = products
    .map(
      (p) => `
    <a class="card" href="/productos/${p._id}">
      <img src="${p.images?.[0]?.url || ""}" alt="${p.name}">
      <div class="card-body">
        <div class="brand">${p.brandName || ""}</div>
        <h3>${p.name}</h3>
        <div class="price">$${p.price}</div>
      </div>
    </a>`,
    )
    .join("");
  return `<h1>${title}</h1><div class="grid">${items}</div>`;
}

export function renderProductDetail(product, brand) {
  return `<div class="detail">
    <img src="${product.images?.[0]?.url || ""}" alt="${product.name}">
    <div class="info">
      <div class="brand">${brand?.name || ""}</div>
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <div class="price">$${product.price}</div>
    </div>
  </div>`;
}
