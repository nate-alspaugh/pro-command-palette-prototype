function Header() {
  return (
    <header className="header-row">
      <div className="logo-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M2 2h20v20H2z"/> 
          <path d="M7 7h10v10H7z" fill="#000"/> 
        </svg>
      </div>
      <div className="company-info">
        <h1 className="company-name">RBLX</h1>
        <span className="company-ticker">ROBLOX CORP</span>
      </div>
    </header>
  )
}

export default Header
