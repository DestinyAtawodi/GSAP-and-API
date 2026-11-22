import { useState, useEffect, useRef } from 'react'
import './App.css'
import Axios from 'axios'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// GSAP plugins must be registered once before use
gsap.registerPlugin(useGSAP, ScrollTrigger)

const BASE_URL = 'https://api.coingecko.com/api/v3'

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------
   Animated "web" background: dots drift around and draw a line between
   any two dots that are close together. Plain canvas, no library.
------------------------------------------------------------------- */
const NetworkBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = prefersReducedMotion()
    const LINK_DISTANCE = 140
    const mouse = { x: null, y: null }
    let width = 0
    let height = 0
    let points = []
    let animationId

    const setup = () => {
      const dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(90, Math.floor((width * height) / 16000))
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 1.5,
        accent: Math.random() < 0.15, // a few amber dots, the rest grey
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // move dots and bounce off the edges
      points.forEach((p) => {
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
        }
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      })

      // lines between nearby dots (closer = darker)
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(60, 60, 67, ${(1 - dist / LINK_DISTANCE) * 0.16})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }

      // lines from the mouse to nearby dots
      if (mouse.x !== null) {
        points.forEach((p) => {
          const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y)
          if (dist < 160) {
            ctx.strokeStyle = `rgba(230, 170, 0, ${(1 - dist / 160) * 0.45})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        })
      }

      // the dots
      points.forEach((p) => {
        ctx.fillStyle = p.accent ? 'rgba(240, 175, 0, 0.8)' : 'rgba(60, 60, 67, 0.3)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (!reduce) animationId = requestAnimationFrame(draw)
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onMouseOut = (e) => {
      if (!e.relatedTarget) {
        mouse.x = null
        mouse.y = null
      }
    }

    setup()
    draw()
    window.addEventListener('resize', setup)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseout', onMouseOut)

    // cleanup when the component unmounts
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', setup)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

const FEATURES = [
  {
    title: 'Live prices',
    text: 'Prices come straight from CoinGecko every time you load or refresh the page.',
  },
  {
    title: 'Search in seconds',
    text: "Type a coin's name or symbol and the table filters as you type.",
  },
  {
    title: 'Your currency',
    text: 'Switch between USD, NGN, EUR and GBP without leaving the page.',
  },
]

const App = () => {
  const root = useRef(null)
  const [coins, setCoins] = useState([])
  const [search, setSearch] = useState('')
  const [currency, setCurrency] = useState('usd')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ---------- API ----------
  const fetchCoins = () => {
    setLoading(true)
    setError('')

    Axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
      },
    })
      .then((response) => setCoins(Array.isArray(response.data) ? response.data : []))
      .catch(() => setError('Could not load prices. Check your connection, or wait a minute and refresh.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCoins()
  }, [currency])

  // ---------- GSAP: page-level animation (runs once) ----------
  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // 1. Intro: headline, tagline, button come in one after the other
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-title', { y: 40, opacity: 0, duration: 1 })
        .from('.hero-tagline', { y: 30, opacity: 0, duration: 0.9 }, '-=0.6')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')

      // 2. Scroll: the hero fades and lifts away as you scroll down
      gsap.to('.hero-content', {
        opacity: 0,
        y: -100,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom 20%',
          scrub: true, // animation follows the scrollbar
        },
      })

      // 3. Scroll reveal: anything with class "reveal" rises in when it enters the screen
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })

      // 4. Scroll reveal for groups: children with "reveal-item" come in one by one
      gsap.utils.toArray('.reveal-group').forEach((group) => {
        gsap.from(group.querySelectorAll('.reveal-item'), {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 85%' },
        })
      })
    },
    { scope: root }
  )

  // ---------- GSAP: rows stagger in whenever new data arrives ----------
  useGSAP(
    () => {
      if (loading) return
      ScrollTrigger.refresh() // page height changed, so recalculate trigger positions
      const rows = gsap.utils.toArray('.coin-row')
      if (prefersReducedMotion() || rows.length === 0) return
      gsap.from(rows, { opacity: 0, y: 14, duration: 0.5, stagger: 0.03, ease: 'power2.out' })
    },
    { dependencies: [loading], scope: root }
  )

  // ---------- helpers ----------
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  )

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)

  const formatCap = (cap) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(cap)

  // numbers for the stats cards, worked out from the same API data
  const topCoin = coins[0]
  const totalCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0)
  const gainers = coins.filter((coin) => coin.price_change_percentage_24h >= 0).length

  const stats = [
    { label: topCoin ? `${topCoin.name} price` : 'Top coin price', value: topCoin ? formatPrice(topCoin.current_price) : '-' },
    { label: 'Top 20 market cap', value: coins.length ? formatCap(totalCap) : '-' },
    { label: 'Rising in 24h', value: coins.length ? `${gainers} of ${coins.length}` : '-' },
  ]

  return (
    <div ref={root} className="relative overflow-x-clip">
      <NetworkBackground />

      {/* Nav */}
      <nav className="glass fixed top-4 inset-x-0 mx-auto w-[min(92%,44rem)] z-20 rounded-full px-5 py-2.5 flex items-center justify-between">
        <span className="font-bold tracking-tight">ADEV</span>
        <div className="flex items-center gap-5 text-sm font-medium">
          <a href="#features" className="hidden sm:inline text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">
            Features
          </a>
          <a href="#market" className="bg-[#FFD60A] hover:bg-[#FFCC00] transition-colors rounded-full px-4 py-1.5">
            Live prices
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero min-h-screen flex items-center justify-center px-6 text-center">
        <div className="hero-content max-w-4xl">
          <h1 className="hero-title text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tighter leading-[1.02]">
            ADEV Crypto Tracker
          </h1>
          <p className="hero-tagline mt-6 text-xl md:text-2xl text-[#6e6e73] font-medium">
            Reliable live data for the coins that move the market.
          </p>
          <a
            href="#market"
            className="hero-cta inline-block mt-10 bg-[#FFD60A] hover:bg-[#FFCC00] transition-colors text-[#1d1d1f] font-semibold rounded-full px-8 py-3.5"
          >
            View the market
          </a>
        </div>
      </header>

      {/* Stats */}
      <section className="px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="reveal text-3xl md:text-4xl font-semibold tracking-tight text-center mb-10">
            The market right now
          </h2>
          <div className="reveal-group grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="reveal-item glass rounded-3xl p-6 text-center">
                <p className="text-sm text-[#6e6e73]">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24 scroll-mt-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="reveal text-3xl md:text-4xl font-semibold tracking-tight text-center mb-10">
            Everything you need to check the market
          </h2>
          <div className="reveal-group grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="reveal-item glass rounded-3xl p-6">
                <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-[#6e6e73] leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market */}
      <main id="market" className="px-4 py-24 scroll-mt-4">
        <section className="reveal glass max-w-4xl mx-auto rounded-3xl p-4 sm:p-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Market</h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="text"
              placeholder="Search by name or symbol"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-white/80 rounded-full px-5 py-2.5 outline-none placeholder:text-[#8e8e93]"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white/80 rounded-full px-4 py-2.5"
            >
              <option value="usd">USD</option>
              <option value="ngn">NGN</option>
              <option value="eur">EUR</option>
              <option value="gbp">GBP</option>
            </select>
            <button
              onClick={fetchCoins}
              className="bg-[#FFD60A] hover:bg-[#FFCC00] transition-colors font-semibold rounded-full px-6 py-2.5"
            >
              Refresh
            </button>
          </div>

          {loading && <p className="text-[#6e6e73] py-8 text-center">Loading prices...</p>}
          {error && <p className="text-[#d70015] py-8 text-center">{error}</p>}
          {!loading && !error && filteredCoins.length === 0 && (
            <p className="text-[#6e6e73] py-8 text-center">No coin matches "{search}".</p>
          )}

          {!loading && !error && filteredCoins.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-[#6e6e73] border-b border-black/10">
                    <th className="py-2 pr-3 font-medium w-10">#</th>
                    <th className="py-2 font-medium">Coin</th>
                    <th className="py-2 font-medium text-right">Price</th>
                    <th className="py-2 font-medium text-right">24h</th>
                    <th className="py-2 pl-4 font-medium text-right hidden sm:table-cell">Market cap</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoins.map((coin) => (
                    <tr
                      key={coin.id}
                      className="coin-row border-b border-black/5 last:border-0 hover:bg-white/60 transition-colors"
                    >
                      <td className="py-3 pr-3 text-[#6e6e73]">{coin.market_cap_rank}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt="" className="w-7 h-7" />
                          <span className="font-semibold">{coin.name}</span>
                          <span className="text-sm text-[#6e6e73] uppercase hidden sm:inline">{coin.symbol}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-medium tabular-nums">{formatPrice(coin.current_price)}</td>
                      <td
                        className={`py-3 text-right font-medium tabular-nums ${
                          coin.price_change_percentage_24h >= 0 ? 'text-[#248a3d]' : 'text-[#d70015]'
                        }`}
                      >
                        {coin.price_change_percentage_24h?.toFixed(2)}%
                      </td>
                      <td className="py-3 pl-4 text-right tabular-nums text-[#6e6e73] hidden sm:table-cell">
                        {formatCap(coin.market_cap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="reveal px-4 pb-12 text-center">
        <p className="font-semibold tracking-tight">ADEV Crypto Tracker</p>
        <p className="text-sm text-[#6e6e73] mt-1">Prices from CoinGecko</p>
      </footer>
    </div>
  )
}

export default App