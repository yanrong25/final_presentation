import './SearchBar.css'

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '搜尋...'}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="清除"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
