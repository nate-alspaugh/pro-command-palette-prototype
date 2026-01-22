interface HeaderProps {
  title?: string
  subtitle?: string
  showLogo?: boolean
}

export default function Header({ title = "RBLX", subtitle = "Company Profile", showLogo = true }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 mb-6">
      {showLogo && (
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M2 2h20v20H2z"/> 
            <path d="M7 7h10v10H7z" fill="#000"/> 
          </svg>
        </div>
      )}
      <div className="flex flex-col">
        <h1 className="text-[18px] font-weight-book m-0 leading-none text-txt-primary">{title}</h1>
        <span className="text-[12px] text-txt-secondary tracking-[0.5px] uppercase leading-none">{subtitle}</span>
      </div>
    </header>
  )
}
