import {
  type KeyboardEvent,
  type PointerEvent,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import {
  type Camera,
  cameraScale,
  clamp,
  MAX_ZOOM,
  needsCameraRender,
  toCanvas,
  toScreen,
  type Viewport,
  zoomCamera,
} from './mapLogic'

export function useMapCamera(canvas: number, initialFocus?: { x: number; y: number }, maxZoom = MAX_ZOOM) {
  const stageRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const coordinatesRef = useRef<HTMLParagraphElement>(null)
  const [viewport, setViewport] = useState<Viewport>({ width: 800, height: 600 })
  const viewportRef = useRef(viewport)
  const [camera, setCamera] = useState<Camera>(() => ({
    x: initialFocus?.x ?? canvas / 2,
    y: initialFocus?.y ?? canvas / 2,
    zoom: initialFocus ? 4 : 1,
  }))
  const cameraRef = useRef(camera)
  const renderedCameraRef = useRef(camera)
  const frameRef = useRef<null | number>(null)
  const settleRef = useRef<null | ReturnType<typeof setTimeout>>(null)
  const pointerRef = useRef<null | { x: number; y: number }>(null)
  const paintedViewRef = useRef<null | { camera: Camera; viewport: Viewport }>(null)
  const gesture = useRef({ points: new Map<number, { x: number; y: number }>(), moved: false, suppressUntil: 0 })

  const scheduleFrame = useCallback(() => {
    if (frameRef.current !== null) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      const current = cameraRef.current
      const size = viewportRef.current
      const scale = cameraScale(current, size, canvas)
      const origin = toScreen(0, 0, current, size, canvas)
      const painted = paintedViewRef.current
      if (worldRef.current && (painted?.camera !== current || painted.viewport !== size)) {
        worldRef.current.style.transform = `translate3d(${origin.x}px, ${origin.y}px, 0) scale(${scale})`
        const inverseScale = String(1 / scale)
        if (worldRef.current.style.getPropertyValue('--map-inverse-scale') !== inverseScale)
          worldRef.current.style.setProperty('--map-inverse-scale', inverseScale)
        paintedViewRef.current = { camera: current, viewport: size }
      }
      if (coordinatesRef.current) {
        const pointer = pointerRef.current
        const coordinates = pointer ? toCanvas(pointer.x, pointer.y, current, size, canvas) : null
        const label = coordinates ? `${Math.round(coordinates.x)}, ${Math.round(coordinates.y)}` : ''
        if (coordinatesRef.current.textContent !== label) coordinatesRef.current.textContent = label
      }
      if (needsCameraRender(current, renderedCameraRef.current, size, canvas)) {
        startTransition(() => setCamera(current))
      }
    })
  }, [canvas])

  useLayoutEffect(() => {
    renderedCameraRef.current = camera
    scheduleFrame()
  }, [camera, viewport, scheduleFrame])

  const updateCamera = useCallback(
    (update: ((current: Camera) => Camera) | Camera) => {
      const current = cameraRef.current
      const next = typeof update === 'function' ? update(current) : update
      cameraRef.current = next
      scheduleFrame()
      if (settleRef.current !== null) clearTimeout(settleRef.current)
      settleRef.current = setTimeout(() => {
        settleRef.current = null
        startTransition(() => setCamera(cameraRef.current))
      }, 120)
    },
    [scheduleFrame],
  )

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      if (settleRef.current !== null) clearTimeout(settleRef.current)
      frameRef.current = null
      settleRef.current = null
      paintedViewRef.current = null
    },
    [],
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(() => {
      const next = { width: stage.clientWidth, height: stage.clientHeight }
      if (next.width === viewportRef.current.width && next.height === viewportRef.current.height) return
      viewportRef.current = next
      setViewport(next)
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const handleWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-map-control]:not([data-row])')) return
      event.preventDefault()
      const rect = stage.getBoundingClientRect()
      const delta =
        event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * rect.height : event.deltaY
      updateCamera((previous) =>
        zoomCamera(
          previous,
          Math.exp(-delta * (event.ctrlKey ? 0.01 : 0.0022)),
          event.clientX - rect.left,
          event.clientY - rect.top,
          viewport,
          canvas,
          maxZoom,
        ),
      )
    }
    stage.addEventListener('wheel', handleWheel, { passive: false })
    return () => stage.removeEventListener('wheel', handleWheel)
  }, [canvas, maxZoom, updateCamera, viewport])

  function point(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest('[data-map-control]'))) return
    const g = gesture.current
    if (!g.points.size) g.moved = false
    g.points.set(event.pointerId, point(event))
    event.currentTarget.dataset.dragging = ''
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current,
      p = point(event)
    pointerRef.current = p
    scheduleFrame()
    const previous = g.points.get(event.pointerId)
    if (!previous) return
    const before = [...g.points.values()]
    g.points.set(event.pointerId, p)
    if (Math.hypot(p.x - previous.x, p.y - previous.y) > 1) g.moved = true
    if (g.points.size === 2) {
      const after = [...g.points.values()]
      if (!before[0] || !before[1] || !after[0] || !after[1]) return
      const distanceBefore = Math.hypot(before[0].x - before[1].x, before[0].y - before[1].y)
      const distanceAfter = Math.hypot(after[0].x - after[1].x, after[0].y - after[1].y)
      const cx = (before[0].x + before[1].x) / 2,
        cy = (before[0].y + before[1].y) / 2
      const dx = (after[0].x + after[1].x) / 2 - cx,
        dy = (after[0].y + after[1].y) / 2 - cy
      updateCamera((current) => {
        const next = zoomCamera(current, distanceAfter / Math.max(1, distanceBefore), cx, cy, viewport, canvas, maxZoom)
        const scale = cameraScale(next, viewport, canvas)
        return { ...next, x: clamp(next.x - dx / scale, 0, canvas), y: clamp(next.y - dy / scale, 0, canvas) }
      })
    } else if (g.points.size === 1) {
      updateCamera((current) => {
        const scale = cameraScale(current, viewport, canvas)
        return {
          ...current,
          x: clamp(current.x - (p.x - previous.x) / scale, 0, canvas),
          y: clamp(current.y - (p.y - previous.y) / scale, 0, canvas),
        }
      })
    }
  }
  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current.points.delete(event.pointerId) && gesture.current.moved)
      gesture.current.suppressUntil = performance.now() + 250
    if (!gesture.current.points.size) delete event.currentTarget.dataset.dragging
  }
  function handlePointerLeave() {
    if (gesture.current.points.size) return
    pointerRef.current = null
    scheduleFrame()
  }
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.ctrlKey || event.altKey || event.metaKey) return
    if (['+', '-', '=', '_'].includes(event.key)) {
      event.preventDefault()
      zoom(['+', '='].includes(event.key) ? Math.SQRT2 : 1 / Math.SQRT2)
    } else if (event.key.startsWith('Arrow')) {
      event.preventDefault()
      const amount = (event.shiftKey ? 240 : 90) / cameraScale(cameraRef.current, viewport, canvas)
      updateCamera((current) => ({
        ...current,
        x: clamp(
          current.x + (event.key === 'ArrowLeft' ? -amount : event.key === 'ArrowRight' ? amount : 0),
          0,
          canvas,
        ),
        y: clamp(current.y + (event.key === 'ArrowUp' ? -amount : event.key === 'ArrowDown' ? amount : 0), 0, canvas),
      }))
    } else if (event.key === 'Home') {
      event.preventDefault()
      fit()
    }
  }
  function zoom(factor: number) {
    updateCamera((current) =>
      zoomCamera(current, factor, viewport.width / 2, viewport.height / 2, viewport, canvas, maxZoom),
    )
  }
  function fit() {
    updateCamera({ x: canvas / 2, y: canvas / 2, zoom: 1 })
  }
  function jump(p: { x: number; y: number }) {
    updateCamera((current) => ({ x: p.x, y: p.y, zoom: Math.max(4, current.zoom) }))
  }
  return {
    stageRef,
    worldRef,
    coordinatesRef,
    viewport,
    camera,
    toCanvas: (x: number, y: number) => toCanvas(x, y, cameraRef.current, viewportRef.current, canvas),
    zoom,
    fit,
    jump,
    canClick: () => performance.now() > gesture.current.suppressUntil,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onLostPointerCapture: handlePointerUp,
      onPointerLeave: handlePointerLeave,
      onKeyDown: handleKeyDown,
    },
  }
}
