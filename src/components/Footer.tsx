import { Link } from 'react-router-dom'
import logoWhite from '../assets/logo.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/company/bnc-global-consulteck/',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/bncglobal.in/',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/bncglobal.in/',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Youtube',
      url: 'https://www.youtube.com/@bncglobalconsultech',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'X',
      url: 'https://twitter.com/GoyalSummit',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-[#0b2f5b] text-white/80 h-auto py-8 md:h-[219px] flex items-center border-t border-white/10 font-sans leading-[20.8px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Section: Logo & Copyright */}
        <div className="flex flex-col items-start space-y-2">
          <Link to="/" aria-label="BNC Global Home Page" className="rounded focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none">
            <img className="h-[91px] w-[247px] object-contain" src={logoWhite} alt="BNC Global Logo" />
          </Link>
          <p className="text-[16px] text-white font-sans leading-[20.8px]">
            Copyrights &copy; {currentYear} BNC Global Consultech Pvt. Ltd.
          </p>
        </div>

        {/* Center Section: Contacts & Socials */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex flex-col items-center text-[16px] text-white space-y-1 leading-[20.8px]">
            <a href="mailto:info@bncglobal.in" className="hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors" aria-label="Email BNC Global">
              info@bncglobal.in
            </a>
            <a href="tel:+919810575613" className="hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors" aria-label="Call BNC Global">
              +91 98105 75613
            </a>
          </div>
          {/* Socials */}
          <nav aria-label="Social Media Links" className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Follow BNC Global on ${social.name}`}
                className="w-[22px] h-[22px] text-white hover:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-all flex items-center justify-center"
              >
                {social.icon}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Section: Privacy & Blog Links */}
        <nav aria-label="Footer Links" className="flex flex-col items-end text-[16px] space-y-2">
          <Link to="/privacy-policy" className="text-[#BFD9ED] hover:text-white focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors">
            Privacy Policy
          </Link>
          <Link to="/blog" className="text-[#BFD9ED] hover:text-white focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded transition-colors">
            Blog
          </Link>
        </nav>
      </div>
    </footer>
  )
}
