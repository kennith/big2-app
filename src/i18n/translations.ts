export type Language = 'en' | 'zh-TW';

export interface Translations {
  gameTitle: string;
  round: string;
  scores: string;
  rules: string;
  log: string;
  settings: string;
  reset: string;
  resetConfirm: string;
  leaveGameWarning: string;
  muteSound: string;
  enableSound: string;
  soundEffects: string;
  soundEffectsDesc: string;
  volume: string;
  botSpeed: string;
  fast: string;
  normal: string;
  relaxed: string;
  autoPass: string;
  autoPassDesc: string;
  careerStats: string;
  roundsPlayed: string;
  roundsWon: string;
  winStreak: string;
  best: string;
  totalPenaltyPts: string;
  close: string;
  gotIt: string;
  nextRound: string;
  resetMatch: string;
  victory: string;
  wonRound: string;
  roundCompleted: string;
  player: string;
  cardsLeft: string;
  multiplier: string;
  roundPts: string;
  totalPts: string;
  doublePenalty: string;
  triplePenalty: string;
  yourHand: string;
  sort: string;
  rank: string;
  suit: string;
  combo: string;
  comboLayout: string;
  switchComboLayout: string;
  lastCard: string;
  cardsLeftAlert: string;
  waitingForTurn: string;
  selectCards: string;
  invalidCombo: string;
  playCombo: string;
  readyToPlay: string;
  lead3DAlert: string;
  clear: string;
  hint: string;
  pass: string;
  passed: string;
  thinking: string;
  playedBy: string;
  playersPassed1: string;
  playersPassedPlural: string;
  startingMove3D: string;
  mustPlay3DYou: string;
  mustPlay3DBot: string;
  freePlay: string;
  freePlayYou: string;
  freePlayBot: string;
  actionLogTitle: string;
  noPlaysYet: string;
  holds3DLead: string;
  trickClearedLead: string;
  language: string;
  personalities: {
    aggressive: string;
    balanced: string;
    cautious: string;
  };
  combos: {
    single: string;
    pair: string;
    triple: string;
    straight: string;
    flush: string;
    fullHouse: string;
    quad: string;
    straightFlush: string;
    high: string;
    fullOf: string;
    withKicker: string;
  };
  suits: {
    D: string;
    C: string;
    H: string;
    S: string;
  };
  rulesContent: {
    title: string;
    section1Title: string;
    rankOrder: string;
    suitOrder: string;
    lowestHighestCard: string;
    section2Title: string;
    singleDesc: string;
    pairDesc: string;
    tripleDesc: string;
    fiveCardDesc: string;
    section3Title: string;
    straightDesc: string;
    flushDesc: string;
    fullHouseDesc: string;
    quadDesc: string;
    straightFlushDesc: string;
    section4Title: string;
    firstTurnDesc: string;
    matchingDesc: string;
    trickResetDesc: string;
    section5Title: string;
    scoringDesc1: string;
    scoringDesc2: string;
    scoringDesc3: string;
    scoringDesc4: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    gameTitle: 'BIG2',
    round: 'Round',
    scores: 'Scores',
    rules: 'Rules',
    log: 'Log',
    settings: 'Settings',
    reset: 'Reset',
    resetConfirm: 'Are you sure you want to reset match scores and start a new game?',
    leaveGameWarning: 'A game is currently in progress. Refreshing or leaving will end the current game. Are you sure you want to leave?',
    muteSound: 'Mute Sound',
    enableSound: 'Enable Sound',
    soundEffects: 'Sound Effects',
    soundEffectsDesc: 'Play Web Audio synthesized effects',
    volume: 'Volume',
    botSpeed: 'Bot Turn Speed',
    fast: 'Fast',
    normal: 'Normal',
    relaxed: 'Relaxed',
    autoPass: 'Auto-Pass',
    autoPassDesc: 'Automatically pass if you have no playable moves',
    careerStats: 'Match History Stats',
    roundsPlayed: 'Rounds Played:',
    roundsWon: 'Rounds Won:',
    winStreak: 'Win Streak:',
    best: 'Best',
    totalPenaltyPts: 'Total Penalty Pts:',
    close: 'Close',
    gotIt: "Got It, Let's Play!",
    nextRound: 'Next Round ➔',
    resetMatch: 'Reset Match',
    victory: 'VICTORY!',
    wonRound: 'Won!',
    roundCompleted: 'Completed',
    player: 'Player',
    cardsLeft: 'Cards Left',
    multiplier: 'Multiplier',
    roundPts: 'Round Pts',
    totalPts: 'Total Pts',
    doublePenalty: 'Double',
    triplePenalty: 'Triple',
    yourHand: 'Your Hand',
    sort: 'Sort',
    rank: 'Rank',
    suit: 'Suit',
    combo: 'Combinations',
    comboLayout: 'Layout',
    switchComboLayout: 'Switch Combination Layout',
    lastCard: 'LAST CARD!',
    cardsLeftAlert: 'LEFT!',
    waitingForTurn: 'Waiting for Turn...',
    selectCards: 'Select Cards',
    invalidCombo: 'Invalid Combination',
    playCombo: 'Play',
    readyToPlay: 'Ready to play',
    lead3DAlert: 'You have 3♦! Lead the first trick containing 3♦.',
    clear: 'Clear',
    hint: 'Hint',
    pass: 'Pass',
    passed: 'Passed',
    thinking: 'Thinking...',
    playedBy: 'Played by',
    playersPassed1: 'player has passed',
    playersPassedPlural: 'players have passed',
    startingMove3D: 'Starting Move: 3 of Diamonds',
    mustPlay3DYou: 'You must play a hand containing 3♦',
    mustPlay3DBot: 'is leading with 3♦',
    freePlay: 'Free Play (New Trick)',
    freePlayYou: 'You have the lead! Play any valid combination.',
    freePlayBot: 'has the lead.',
    actionLogTitle: 'Match Action Log',
    noPlaysYet: 'No plays recorded yet this round.',
    holds3DLead: 'holds 3♦ and leads the first hand.',
    trickClearedLead: 'Trick cleared! {name} has free play.',
    language: 'Language',
    personalities: {
      aggressive: 'Aggressive',
      balanced: 'Balanced',
      cautious: 'Cautious',
    },
    combos: {
      single: 'Single',
      pair: 'Pair',
      triple: 'Triple',
      straight: 'Straight',
      flush: 'Flush',
      fullHouse: 'Full House',
      quad: 'Four of a Kind',
      straightFlush: 'Straight Flush',
      high: 'High',
      fullOf: 'full of',
      withKicker: 'with',
    },
    suits: {
      D: 'Diamonds',
      C: 'Clubs',
      H: 'Hearts',
      S: 'Spades',
    },
    rulesContent: {
      title: 'Big Two Rules & Combinations',
      section1Title: '1. Card Hierarchy & Suits',
      rankOrder: 'Rank Order (Lowest to Highest):',
      suitOrder: 'Suit Order (Lowest to Highest):',
      lowestHighestCard: 'Lowest card in deck: 3♦. Highest card in deck: 2♠.',
      section2Title: '2. Playable Combinations',
      singleDesc: 'Any single card. Compared by rank, then suit (e.g. 2♠ > 2♥ > 2♣ > 2♦ > A♠).',
      pairDesc: '2 cards of same rank. Higher rank wins; if rank ties, pair with higher suit wins.',
      tripleDesc: '3 cards of same rank. Compared by rank.',
      fiveCardDesc: 'Must beat with higher 5-card tier or stronger combo of same tier.',
      section3Title: '3. 5-Card Hand Tiers (Lowest to Highest)',
      straightDesc: '5 consecutive cards (e.g. 3-4-5-6-7, 10-J-Q-K-A, 2-3-4-5-6)',
      flushDesc: '5 cards of identical suit (Ranked by Suit first, then highest card)',
      fullHouseDesc: '3 of a kind + 1 pair (Ranked by the Triple rank)',
      quadDesc: '4 of same rank + 1 kicker card (Bomb)',
      straightFlushDesc: '5 consecutive cards in the same suit (Highest hand)',
      section4Title: '4. First Turn, Turns & Free Play',
      firstTurnDesc: 'Starting Hand: The player holding the 3 of Diamonds (3♦) leads first, and their play must include 3♦.',
      matchingDesc: 'Matching: Players must play a higher combination matching the current card count (1, 2, 3, or 5 cards) or Pass.',
      trickResetDesc: 'Trick Reset: When 3 consecutive players Pass, the trick ends and the last person to play gets a Free Play (leads any valid combination).',
      section5Title: '5. Scoring & Penalties',
      scoringDesc1: 'Winner: First player to shed all 13 cards scores 0 penalty points.',
      scoringDesc2: '1 to 9 cards left: 1 point per card remaining.',
      scoringDesc3: '10 to 12 cards left: 2x Double Penalty (e.g. 10 cards = 20 pts).',
      scoringDesc4: '13 cards unplayed: 3x Triple Penalty (39 pts!).',
    },
  },
  'zh-TW': {
    gameTitle: '大老二 (鋤大D)',
    round: '第',
    scores: '目前比分',
    rules: '規則說明',
    log: '對局紀錄',
    settings: '遊戲設定',
    reset: '重新開始',
    resetConfirm: '確定要重設比賽總分並開始新對局嗎？',
    leaveGameWarning: '對局正在進行中，重新整理或離開頁面將會結束當前遊戲。確定要離開嗎？',
    muteSound: '靜音',
    enableSound: '開啟音效',
    soundEffects: '遊戲音效',
    soundEffectsDesc: '使用 Web Audio 合成音效',
    volume: '音量調整',
    botSpeed: '電腦出牌速度',
    fast: '快速',
    normal: '標準',
    relaxed: '休閒',
    autoPass: '無牌自動跳過',
    autoPassDesc: '當手中無可壓制牌型時自動 Pass',
    careerStats: '生涯戰績統計',
    roundsPlayed: '總對局數：',
    roundsWon: '勝場數：',
    winStreak: '連勝紀錄：',
    best: '最佳',
    totalPenaltyPts: '累積罰分：',
    close: '關閉',
    gotIt: '瞭解，開始對局！',
    nextRound: '下一回合 ➔',
    resetMatch: '重設比賽',
    victory: '大獲全勝！',
    wonRound: '獲勝！',
    roundCompleted: '回合結束',
    player: '玩家',
    cardsLeft: '剩餘張數',
    multiplier: '罰分倍率',
    roundPts: '本局罰分',
    totalPts: '累積總分',
    doublePenalty: '雙倍',
    triplePenalty: '三倍',
    yourHand: '你的手牌',
    sort: '排序',
    rank: '點數',
    suit: '花色',
    combo: '牌型組合',
    comboLayout: '組合排列',
    switchComboLayout: '切換組合排列方式',
    lastCard: '最後一張！',
    cardsLeftAlert: '張！',
    waitingForTurn: '等待其他玩家...',
    selectCards: '請選擇手牌',
    invalidCombo: '非有效牌型',
    playCombo: '出牌',
    readyToPlay: '準備打出',
    lead3DAlert: '持有方塊 3！首張出牌必須包含方塊 3 (♦3)。',
    clear: '清除選擇',
    hint: '提示',
    pass: '過牌 (Pass)',
    passed: '過牌',
    thinking: '思考中...',
    playedBy: '出牌者：',
    playersPassed1: '位玩家已過牌',
    playersPassedPlural: '位玩家已過牌',
    startingMove3D: '首回合先出：方塊 3 (♦3)',
    mustPlay3DYou: '你必須打出包含方塊 3 (♦3) 的組合',
    mustPlay3DBot: '持有方塊 3，正在首出...',
    freePlay: '✨ 取得出牌權 (自由出牌)',
    freePlayYou: '你取得了出牌權！可出任意合法牌型。',
    freePlayBot: '取得出牌權。',
    actionLogTitle: '對局出牌歷史紀錄',
    noPlaysYet: '本回合尚未有出牌紀錄。',
    holds3DLead: '持有方塊 3，取得首出權。',
    trickClearedLead: '三家過牌！{name} 取得出牌權。',
    language: '語言 (Language)',
    personalities: {
      aggressive: '積極進攻型',
      balanced: '穩健平衡型',
      cautious: '謹慎防守型',
    },
    combos: {
      single: '單張',
      pair: '對子',
      triple: '三條',
      straight: '順子',
      flush: '同花',
      fullHouse: '葫蘆',
      quad: '鐵支 (四條/炸彈)',
      straightFlush: '同花順',
      high: '結尾',
      fullOf: '帶',
      withKicker: '帶',
    },
    suits: {
      D: '方塊',
      C: '梅花',
      H: '紅心',
      S: '黑桃',
    },
    rulesContent: {
      title: '大老二 (鋤大D) 規則與牌型說明',
      section1Title: '一、 點數大小與花色階級',
      rankOrder: '點數大小 (由小到大)：',
      suitOrder: '花色大小 (由小到大)：',
      lowestHighestCard: '最小單牌：方塊 3 (♦3)。 最大單牌：黑桃 2 (♠2)。',
      section2Title: '二、 基本出牌組合',
      singleDesc: '單張：比點數，同點數比花色 (如 ♠2 > ♥2 > ♣2 > ♦2 > ♠A)。',
      pairDesc: '對子 (兩張同點數)：比點數，同點數比包含的最大花色。',
      tripleDesc: '三條 (三張同點數)：比點數。',
      fiveCardDesc: '五張牌組合：必須以更高階級之五張牌型壓制，或同牌型比大小。',
      section3Title: '三、 五張牌型階級 (由小到大)',
      straightDesc: '1. 順子：五張連續點數 (如 3-4-5-6-7、10-J-Q-K-A、2-3-4-5-6)',
      flushDesc: '2. 同花：五張相同花色 (先比花色，花色相同再比最大點數)',
      fullHouseDesc: '3. 葫蘆：三條 + 一對 (比三條的點數大小)',
      quadDesc: '4. 鐵支 (四條/炸彈)：四張相同點數 + 任一張單牌 (比四條點數)',
      straightFlushDesc: '5. 同花順：同一花色的連續五張牌 (大老二中最強牌型)',
      section4Title: '四、 先出規則、輪流與出牌權',
      firstTurnDesc: '首回合先出：拿到方塊 3 (♦3) 的玩家必須首出，且出牌組合中必須包含方塊 3。',
      matchingDesc: '壓牌規則：後續玩家必須出同張數且更大的牌型，或選擇過牌 (Pass)。',
      trickResetDesc: '取得出牌權：當連續三家都選擇過牌時，桌面牌收回，由最後出牌者獲得自由出牌權 (可出任意牌型)。',
      section5Title: '五、 計分與輸家罰則',
      scoringDesc1: '勝利條件：最先將手中 13 張手牌全部出完者獲勝，罰分為 0。',
      scoringDesc2: '剩餘 1 至 9 張：每張計 1 分罰分。',
      scoringDesc3: '剩餘 10 至 12 張：雙倍罰分 (2x，如剩 10 張罰 20 分)。',
      scoringDesc4: '剩餘 13 張 (一張未出/老包)：三倍罰分 (3x，直接罰 39 分！)。',
    },
  },
};
