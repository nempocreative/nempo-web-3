import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const deckDir = join(process.cwd(), 'src/program/pasar-seni-garut');
const mediaDir = join(process.cwd(), 'public/media/pasar-seni-garut');

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.tsx') ? [join(dir, e.name)] : [],
  );
}

describe('Pasar Seni Garut deck photos', () => {
  const refs = new Set<string>();
  for (const f of files(deckDir)) {
    for (const m of readFileSync(f, 'utf8').matchAll(/[\w-]+\.(?:webp|png|jpe?g)/g)) refs.add(m[0]);
  }

  it('references photos', () => {
    expect(refs.size).toBeGreaterThan(10);
  });

  it.each([...refs])('%s exists in the media folder', (name) => {
    expect(existsSync(join(mediaDir, name))).toBe(true);
  });
});
