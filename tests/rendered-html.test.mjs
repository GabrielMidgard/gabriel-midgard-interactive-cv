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

test("publica la configuración editable sin recompilar", async () => {
  const rawSettings = await readFile(new URL("dist/settings.json", root), "utf8");
  const settings = JSON.parse(rawSettings);

  assert.equal(settings.defaultMode, "cinematic");
  assert.equal(settings.loading.durationSeconds, 5);
  assert.equal(settings.loading.modeSelectorEnabled, false);
  assert.equal(settings.scrollGuide.inactivitySeconds, 5);
  assert.equal(settings.scrollGuide.dismissDelaySeconds, 2);
  assert.equal(settings.modals.questDurationSeconds, 3);
  assert.deepEqual(settings.modes.cinematic.scenes, [
    "fantastic-town",
    "enchanted-forest",
    "castle-walls",
    "skills",
    "experience",
    "education",
    "contact",
  ]);
  await access(new URL("dist/settings.schema.json", root));
});
