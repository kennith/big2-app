# ♠️ Big Two (大老二 / 鋤大D / Deuces) Web Game

A modern, responsive, client-side **Big Two (大老二 / 鋤大D)** card game built with **Vue 3**, **TypeScript**, and **Tailwind CSS**. Play against three intelligent heuristic AI opponents directly in your browser.

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Vue 3](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.2-purple.svg)
![Vitest](https://img.shields.io/badge/Vitest-4.1-red.svg)

---

## ✨ Features

- **🎮 Authentic Big Two Rules**: Standard card rankings ($3\diamondsuit \dots 2\spadesuit$), full 5-card hand hierarchy, opening $3\diamondsuit$ rule, 3-consecutive-pass trick clears, and double/triple penalty multipliers.
- **🤖 3 Heuristic AI Personalities**:
  - **阿強 (Alex - 積極進攻型 / Aggressive)**: Fast tempo, seizes trick control with high cards.
  - **小美 (Bella - 穩健平衡型 / Balanced)**: Balanced card shedding and card conservation.
  - **阿明 (Charlie - 謹慎防守型 / Cautious)**: Conserves high deuces, blocks opponents in danger states ($\le 3$ cards).
- **🂠 3 Intelligent Hand Sorting Modes**:
  - **點數排序 (Sort by Rank)**: Ascending Big 2 rank value.
  - **花色排序 (Sort by Suit)**: Grouped by suit ($\diamondsuit \rightarrow \clubsuit \rightarrow \heartsuit \rightarrow \spadesuit$).
  - **牌型組合排序 (Sort by Combination)**: Partitions hand into 5-card hands, triples, pairs, and singles with **interactive hint badges** and one-click combo selection.
- **🌐 Bilingual Localization**: Instant switching between **繁體中文 (Traditional Chinese)** and **English**.
- **⌨️ Keyboard Shortcuts**: Full hotkey support for rapid play (<kbd>P</kbd> for Pass, <kbd>Space</kbd>/<kbd>Enter</kbd> for Play, <kbd>H</kbd> for Hint, <kbd>C</kbd> for Clear, <kbd>S</kbd> for Sort).
- **🔊 Web Audio API Sound Synthesizer**: Zero external audio files — deals, plays, table slams, knocks, and fanfare sounds are generated in real-time.
- **🛡️ Accidental Reload Guard**: Prevents losing games in progress with `beforeunload` confirmation prompts.
- **📱 Fully Responsive**: Fluid play on desktop, tablet, and mobile browsers.

---

## 🂡 Card Ranking & Rules

### Rank Hierarchy (Lowest to Highest)
$$3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < \text{J} < \text{Q} < \text{K} < \text{A} < 2$$

### Suit Hierarchy (Lowest to Highest)
$$\diamondsuit\text{ (Diamonds / 方塊)} < \clubsuit\text{ (Clubs / 梅花)} < \heartsuit\text{ (Hearts / 紅心)} < \spadesuit\text{ (Spades / 黑桃)}$$

- **Lowest Card**: $3\diamondsuit$ (Diamonds 3)
- **Highest Card**: $2\spadesuit$ (Spades 2)

### 5-Card Hand Tiers
$$\text{順子 (Straight)} < \text{同花 (Flush)} < \text{葫蘆 (Full House)} < \text{鐵支 (Quads / 炸彈)} < \text{同花順 (Straight Flush)}$$

### Multiplier Scoring Penalties
- **1 to 9 cards unplayed**: $1\times$ penalty ($1 \text{ pt/card}$)
- **10 to 12 cards unplayed**: $2\times$ **Double Penalty (雙倍罰分)**
- **13 cards unplayed**: $3\times$ **Triple Penalty (三倍罰分 / 老包)**

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>P</kbd> | **過牌 / Pass** |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | **出牌 / Play Cards** |
| <kbd>H</kbd> | **提示 / Hint** |
| <kbd>C</kbd> / <kbd>Esc</kbd> | **清除選牌 / Clear Selection** |
| <kbd>S</kbd> | **切換排序 / Cycle Sort Mode** |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/big2-app.git
cd big2-app

# Install dependencies
npm install
```

### Development

```bash
# Start local Vite development server
npm run dev
```

### Run Tests

```bash
# Run unit test suite (23 vitest tests)
npm run test
```

### Production Build

```bash
# Build optimized production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

This project is pre-configured with a **GitHub Actions workflow** (`.github/workflows/deploy.yml`) for automated deployment:

1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository:
   - Navigate to **Settings** $\rightarrow$ **Pages**.
   - Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
3. Every push to `main` will automatically run tests, build the project, and deploy it to `https://<your-username>.github.io/<your-repo-name>/`.

---

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Effects**: [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API (Synthesizer)

---

## 📄 License

MIT License © 2026. Built with ❤️ for Big Two enthusiasts!
