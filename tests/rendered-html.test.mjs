import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("genera la entrada Vue del currículum", async () => {
  const html = await readFile(new URL("dist/index.html", root), "utf8");

  assert.match(html, /<html lang="es">/i);
  assert.match(html, /<title>Gabriel Vázquez Ruiz \| Full Stack Developer<\/title>/i);
  assert.match(html, /<div id="app"><\/div>/i);
  assert.match(html, /\/assets\/index-[^"']+\.js/);
});

test("incluye los recursos y metadatos de Sites", async () => {
  await access(new URL("dist/assets", root));
  await access(new URL("dist/.openai/hosting.json", root));
  await access(new URL("dist/assets/scenes/fantastic-town/fantastic-town-panorama-wide.webp", root));
  await access(new URL("dist/assets/characters/main-character/knight-motion.png", root));
});
