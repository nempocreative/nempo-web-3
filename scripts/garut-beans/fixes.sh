#!/usr/bin/env bash
# Small layout fixes for the original Garut Beans source, applied before every build.
# Usage: bash scripts/garut-beans/fixes.sh <path to artifacts/kopi-garut-web>
set -euo pipefail
APP="$1"
HOME_CSS="$APP/src/pages/home-page.css"
# `.gb-home button { font: inherit; border: 0 }` outranks every button class on the home page,
# so buttons like "Tambah", "Delivery" and "Racik paket" lost their designed size, weight and border.
# :where() keeps the reset but lets the button classes win again.
sed -i 's/^\.gb-home button {$/.gb-home :where(button) {/' "$HOME_CSS"
grep -q '^\.gb-home :where(button) {$' "$HOME_CSS" || { echo "fixes.sh: home button reset not found" >&2; exit 1; }

# Shadow room for sideways card rows and smaller floating buttons on phones.
# Re-running drops the previously appended block first, so edits to tidy.css always land.
# (The original file has no final newline, so an earlier block may sit right after a closing brace.)
sed -i 's#}/\* NEMPO tidy fixes#}\n/* NEMPO tidy fixes#' "$HOME_CSS"
sed -i '/^\/\* NEMPO tidy fixes/,$d' "$HOME_CSS"
[ -z "$(tail -c1 "$HOME_CSS")" ] || echo >> "$HOME_CSS"
cat "$(dirname "$0")/tidy.css" >> "$HOME_CSS"

# The home page hides the Mini Games / Live Chat buttons above the menu only on very narrow phones
# (<= 420px), so on most phones they cover the menu icons. Hide them there on every phone width.
APP_TSX="$APP/src/App.tsx"
sed -i "s/route === '\/' \&\& window.innerWidth <= 420 \&\& window.scrollY < 480/route === '\/' \&\& window.innerWidth < 700 \&\& window.scrollY < 480/" "$APP_TSX"
grep -q "window.innerWidth < 700 && window.scrollY < 480" "$APP_TSX" || { echo "fixes.sh: floating button rule not found" >&2; exit 1; }
