

# React 期末專題  
**串接 CoinGecko API 即時顯示市值前 30 名加密貨幣行情**
**線上 Demo：** https://final-presentation-lake.vercel.app


---

##  專題目的

簡單明瞭讓使用者能在單一頁面快速掌握主要加密貨幣的市況與走勢。

### 想解決的問題
- 練習 React 核心觀念並串接真實第三方 API
- 可以清楚理解當前市場幣種狀況

---

##  主要功能

| 功能 | 說明 |
|------|------|
| **即時行情列表** | 顯示市值前 30 名加密貨幣的價格、24 小時漲跌 |
|  **搜尋過濾** | 支援以幣名或代號（如 `bitcoin`、`btc`）即時過濾 |
|  **漲跌視覺化** | 上漲顯示綠色、下跌顯示紅色，一眼判斷市況 |
|  **自動更新** | 每 60 秒自動向 API 重新拉取最新價格 |
|  **手動重新整理** | 提供按鈕讓使用者隨時更新資料 |
|  **顯示更新時間** | 清楚標示資料最後同步時間 |
|  **錯誤處理** | API 失敗時不會清空舊資料，並於畫面標示錯誤訊息 |
|  **響應式設計（RWD）** | 自動適應手機、平板、桌機等不同螢幕尺寸 |

---

##  使用技術

### 主要框架與工具
| 技術 | 版本 | 用途 |
|------|------|------|
| **React** | 19 | 前端 UI 框架（核心） |
| **Vite** | 8 | 前端開發伺服器與打包工具 |
| **JavaScript (ES6+)** | — | 程式語言 |
| **CSS3** | — | 樣式設計（Grid、Flex、CSS 變數） |

### 第三方服務
- **CoinGecko API**（免費）：提供加密貨幣即時價格、市值、漲跌資料
- **Vercel**：自動部署平台，每次 `git push` 即自動更新線上版本

---

##  專案結構

```
final_presentation/
├── index.html              # HTML 進入點
├── vite.config.js          # Vite 設定檔
│
└── src/
    ├── main.jsx            # React 進入點，將 App 掛載到 #root
    ├── App.jsx             # 根元件
    ├── index.css           # 全域樣式與 CSS 變數
    ├── App.css             # App 層級樣式
    │
    ├── pages/              # 頁面元件
    │   ├── HomePage.jsx    # 首頁：加密貨幣列表
    │   └── HomePage.css
    │
    └── components/         # 可重複使用元件
        ├── SearchBar.jsx   # 搜尋輸入框
        └── SearchBar.css
```

---

##  安裝與執行

### 環境需求
- Node.js 18 以上版本
- npm 9 以上版本

### 本機開發

```bash
# 1. 下載原始碼
git clone https://github.com/yanrong25/final_presentation.git
cd final_presentation

# 2. 安裝套件
npm install

# 3. 啟動開發伺服器
npm run dev
```

瀏覽器打開 http://localhost:5173 即可看到網站。

### 打包正式版

```bash
npm run build
```

打包結果會輸出到 `dist/` 資料夾。

---

## 主要程式邏輯說明

### 1. 資料取得（useEffect + fetch）

在 `HomePage.jsx` 中，元件首次渲染時透過 `useEffect` 呼叫 CoinGecko API 取得幣的列表：

```jsx
useEffect(() => {
  fetchCoins()                                  // 第一次取資料
  const timer = setInterval(fetchCoins, 60000)  // 每 60 秒自動更新
  return () => clearInterval(timer)             // 元件卸載時清除計時器
}, [])
```

清理函式（`return () => ...`）非常重要 — 避免使用者離開頁面後仍有殘留的計時器持續呼叫 API。

### 2. 狀態管理（useState）

頁面共有 6 個狀態：
- `coins`：原始幣資料陣列
- `loading` / `refreshing`：是否載入中 / 背景更新中
- `error`：錯誤訊息
- `lastUpdated`：最後更新時間
- `searchQuery`：搜尋字串

分為 `loading` 和 `refreshing` 兩種狀態的原因：第一次載入時要顯示整頁的「載入中」；自動更新時則保留舊資料，僅讓按鈕顯示「更新中」，避免畫面閃爍。

### 3. 搜尋過濾（filter）

```jsx
const filteredCoins = coins.filter((coin) => {
  const q = searchQuery.toLowerCase().trim()
  if (!q) return true
  return coin.name.toLowerCase().includes(q) ||
         coin.symbol.toLowerCase().includes(q)
})
```

原始 `coins` 陣列保留不變，過濾後產生新的 `filteredCoins`。使用者刪除搜尋字串即可瞬間還原顯示完整列表。

### 4. 元件拆分與 Props 傳遞

`SearchBar` 為 **Controlled Component**：本身不存儲狀態，所有資料由父元件 `HomePage` 透過 props 控制：

```jsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="搜尋幣名或代號"
/>
```

此模式讓 `searchQuery` 集中由 `HomePage` 管理，方便後續搜尋邏輯重用。

---

