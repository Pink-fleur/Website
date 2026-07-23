const FLIGHT_MS = 650

export function flyToCart(sourceEl: HTMLElement, targetEl: HTMLElement) {
  const sourceImg = sourceEl.querySelector('img')

  if (!sourceImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bumpCartIcon(targetEl)
    return
  }

  const sourceRect = sourceImg.getBoundingClientRect()
  const targetRect = targetEl.getBoundingClientRect()

  // Clone the already-rendered, already-decoded <img> so the flying copy paints
  // instantly — a fresh `new Image()` pointed at the raw CDN url has to refetch,
  // which is what made the flight invisible on most clicks.
  const flying = sourceImg.cloneNode(false) as HTMLImageElement
  flying.removeAttribute('srcset')
  flying.removeAttribute('sizes')
  flying.removeAttribute('loading')
  flying.src = sourceImg.currentSrc || sourceImg.src

  flying.style.cssText = `
    position: fixed;
    left: ${sourceRect.left}px;
    top: ${sourceRect.top}px;
    width: ${sourceRect.width}px;
    height: ${sourceRect.height}px;
    object-fit: cover;
    margin: 0;
    z-index: 80;
    pointer-events: none;
    opacity: 1;
    will-change: transform, opacity;
    transform: translate(0, 0) scale(1);
    transition: transform ${FLIGHT_MS}ms cubic-bezier(0.55, 0, 0.85, 0.35), opacity ${FLIGHT_MS}ms ease-in;
  `

  document.body.appendChild(flying)

  const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)
  const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)
  const scale = Math.max(Math.min(targetRect.width / sourceRect.width, 1), 0.12)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flying.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
      flying.style.opacity = '0.2'
    })
  })

  window.setTimeout(() => {
    flying.remove()
    bumpCartIcon(targetEl)
  }, FLIGHT_MS)
}

function bumpCartIcon(targetEl: HTMLElement) {
  targetEl.classList.remove('animate-cart-bump')
  // Force a reflow so the animation restarts if it's already mid-bump.
  void targetEl.offsetWidth
  targetEl.classList.add('animate-cart-bump')
  window.setTimeout(() => targetEl.classList.remove('animate-cart-bump'), 450)
}
