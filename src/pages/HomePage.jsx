import { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import './HomePage.css'

const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1'

const REFRESH_INTERVAL = 60000

function HomePage() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCoins = coins.filter((coin) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      coin.name.toLowerCase().includes(q) ||
      coin.symbol.toLowerCase().includes(q)
    )
  })

  const fetchCoins = async () => {
    try {
      setRefreshing(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('API 回傳失敗')
      const data = await res.json()
      setCoins(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCoins()
    // 自動更新先關掉，避免被 API 速率限制
    // const timer = setInterval(fetchCoins, REFRESH_INTERVAL)
    // return () => clearInterval(timer)
  }, [])

  if (loading) return <p className="status">載入中...</p>
  if (error && coins.length === 0)
    return <p className="status error">錯誤：{error}</p>

  return (
    <div className="home">
      <header className="home-header">
        <div>
          <h1>加密貨幣行情</h1>
          <p className="subtitle">市值前 30 名</p>
        </div>
        <div className="refresh-area">
          {error && <span className="refresh-error">⚠️ {error}</span>}
          {lastUpdated && (
            <span className="last-updated">
              最後更新：{lastUpdated.toLocaleTimeString('zh-TW')}
            </span>
          )}
          <button
            className="refresh-btn"
            onClick={fetchCoins}
            disabled={refreshing}
          >
            {refreshing ? '更新中...' : '🔄 重新整理'}
          </button>
        </div>
      </header>

      <div className="search-wrap">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="搜尋幣名或代號（如 bitcoin、btc）"
        />
      </div>

      <div className="coin-table">
        <div className="coin-row coin-row-head">
          <span className="col-rank">#</span>
          <span className="col-name">名稱</span>
          <span className="col-price">價格 (USD)</span>
          <span className="col-change">24h 漲跌</span>
        </div>

        {filteredCoins.length === 0 && (
          <p className="status">找不到符合「{searchQuery}」的加密貨幣</p>
        )}

        {filteredCoins.map((coin) => (
          <div className="coin-row" key={coin.id}>
            <span className="col-rank">{coin.market_cap_rank}</span>
            <span className="col-name">
              <img src={coin.image} alt={coin.name} className="coin-icon" />
              <span className="coin-name-text">{coin.name}</span>
              <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
            </span>
            <span className="col-price">
              ${coin.current_price.toLocaleString()}
            </span>
            <span
              className={
                'col-change ' +
                (coin.price_change_percentage_24h >= 0 ? 'up' : 'down')
              }
            >
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage
