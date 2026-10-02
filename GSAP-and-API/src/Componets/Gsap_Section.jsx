import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// pos = where the image sits; from/to = scroll path (in % of the image's own size)
const items = [
  { src: 'https://res.cloudinary.com/kzekjix6/image/upload/v1790962122/Asian_model_screen1.avif', pos: 'left-[5%] top-[10%]',  from: { yPercent: 120 },  to: { yPercent: -140 } },
  { src: 'https://res.cloudinary.com/kzekjix6/image/upload/v1790962283/black_model_screen1.avif', pos: 'left-[30%] top-[15%]', from: { yPercent: -140 }, to: { yPercent: 120 } },
  { src: 'https://res.cloudinary.com/kzekjix6/image/upload/v1790962351/black_model_screen_2.avif', pos: 'left-0 top-[25%]',    from: { xPercent: 250 },  to: { xPercent: -250 } },
  { src: 'https://res.cloudinary.com/kzekjix6/image/upload/v1790962402/longsleeve_model.avif',     pos: 'left-[55%] top-[10%]', from: { yPercent: 120 },  to: { yPercent: -140 } },
  { src: 'https://res.cloudinary.com/kzekjix6/image/upload/v1790962449/Customizable_2.avif',       pos: 'right-0 top-[20%]',   from: { xPercent: -250 }, to: { xPercent: 250 } },
  { src: 'https://res.cloudinary.com/kzekjix6/image/upload/v1790962509/Asian_model_screen2.avif', pos: 'left-[75%] top-[12%]', from: { yPercent: -140 }, to: { yPercent: 120 } },
]

const Gsap_Section = () => {
  const container = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=4000',      // scroll distance the section stays pinned for
          scrub: 1,           // 1s smoothing, ties animation to scrollbar
          pin: true,
          anticipatePin: 1,
        },
      })

      // Text layers drift horizontally behind the models
      tl.fromTo('.txt-1', { xPercent: 30 },  { xPercent: -60, ease: 'none' }, 0)
        .fromTo('.txt-2', { xPercent: -60 }, { xPercent: 30,  ease: 'none' }, 0)

      // Images: staggered start times so they don't all move in sync
      items.forEach((item, i) => {
        tl.fromTo(`.img-${i}`, item.from, { ...item.to, ease: 'none', duration: 1 }, i * 0.12)
      })
    },
    { scope: container }
  )

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden bg-black">
      {/* BOLD TEXT: z-0 so it sits BEHIND the models */}
      <h2 className="txt-1 absolute top-[8%] left-0 z-0 whitespace-nowrap text-[22vw] font-black uppercase leading-none text-white">
        Wear Your Story
      </h2>
      <h2 className="txt-2 absolute bottom-[5%] left-0 z-0 whitespace-nowrap text-[22vw] font-black uppercase leading-none text-transparent [-webkit-text-stroke:2px_white]">
        Make It Yours
      </h2>

      {/* IMAGES: z-10 so they overlap the text */}
      {items.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt={`Model ${i + 1}`}
          className={`img-${i} absolute z-10 h-[65vh] w-auto object-contain ${item.pos}`}
        />
      ))}
    </section>
  )
}

export default Gsap_Section