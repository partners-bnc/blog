import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react'
import headerLogo from '../assets/header_logo.png'

interface DropdownItem {
  name: string
  path: string
}

interface NavLinkItem {
  name: string
  path: string
  isExternal?: boolean
  dropdown?: DropdownItem[]
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const location = useLocation()

  const navLinks: NavLinkItem[] = [
    { name: 'Virtual CFO Network', path: '/virtual-cfo' },
    { name: 'Services', path: '/bnc-global-services' },
    {
      name: 'Partner Platform',
      path: 'http://partners.bncglobal.in/',
      isExternal: true,
    },
    {
      name: 'Countries we serve',
      path: '#',
      dropdown: [
        { name: 'Australia', path: '/countires-we-serve/australia' },
        { name: 'Canada', path: '/countires-we-serve/canada' },
        { name: 'Saudi Arabia', path: '/countires-we-serve/saudi-arabia' },
        { name: 'UAE', path: '/countires-we-serve/uae' },
      ],
    },
    {
      name: 'Careers',
      path: '#',
      dropdown: [
        { name: 'Careers Home', path: '/careers' },
        { name: 'Elevate', path: '/elevate' },
        { name: 'Transforming Professionals', path: '/transforming-professionals' },
        { name: 'Communities', path: '/communities' },
      ],
    },
    { name: 'About us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-8' },
  ]

  const isActive = (path: string) => {
    if (path === '#') return false
    return location.pathname === path
  }

  const toggleDropdown = (index: number) => {
    if (activeDropdown === index) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(index)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm font-display h-[115px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between h-[115px] items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center rounded focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none" aria-label="BNC Global Home Page">
              <img className="h-[63px] w-[137px] object-contain" src={headerLogo} alt="BNC Global Logo" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav aria-label="Main Navigation" className="hidden lg:flex space-x-1 items-center">
            {navLinks.map((link, idx) => {
              if (link.dropdown) {
                const isDropdownOpen = activeDropdown === idx
                return (
                  <div key={link.name} className="relative group">
                    <button
                      onClick={() => toggleDropdown(idx)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1 px-4 py-2 text-[14px] font-normal leading-[31px] text-black hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded transition-all cursor-pointer ${
                        link.dropdown.some((sub) => isActive(sub.path)) ? 'text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" aria-hidden="true" />
                    </button>
                    {/* Dropdown menu wrapper to bridge the hover gap */}
                    <div className="absolute left-0 top-full pt-2 w-56 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:scale-100 focus-within:pointer-events-auto transition-all duration-200 z-50">
                      <div className="rounded-xl bg-white border border-slate-150 shadow-xl py-2" role="menu">
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            role="menuitem"
                            className={`block px-4 py-2.5 text-[14px] text-black hover:text-blue-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none transition-colors ${
                              isActive(subItem.path) ? 'bg-blue-50/50 text-blue-600 font-semibold' : ''
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              if (link.isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 px-4 py-2 text-[14px] font-normal leading-[31px] text-black hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded transition-all"
                  >
                    {link.name}
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-[14px] font-normal leading-[31px] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded transition-all ${
                    isActive(link.path)
                      ? 'text-blue-600 font-normal'
                      : 'text-black hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-2 absolute top-[115px] left-0 right-0 shadow-lg z-50 animate-in slide-in-from-top duration-200">
          {navLinks.map((link, idx) => {
            if (link.dropdown) {
              return (
                <div key={link.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(idx)}
                    className="w-full flex justify-between items-center px-4 py-2.5 text-base font-medium rounded-lg text-slate-650 hover:text-blue-600 hover:bg-slate-50"
                  >
                    {link.name}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeDropdown === idx ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === idx && (
                    <div className="pl-6 space-y-1 bg-slate-50/50 rounded-lg py-1 border-l-2 border-slate-200">
                      {link.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => setIsOpen(false)}
                          className={`block px-4 py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors ${
                            isActive(subItem.path) ? 'text-blue-600 font-semibold' : ''
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            if (link.isExternal) {
              return (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 text-base font-medium rounded-lg text-slate-650 hover:text-blue-600 hover:bg-slate-50"
                >
                  <span>{link.name}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              )
            }

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50/50 text-blue-600 font-semibold'
                    : 'text-slate-655 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
