import { type KeyboardEvent, type PointerEvent, useCallback, useEffect, useRef, useState } from 'react'

import { type Camera, cameraScale, clamp, toCanvas, type Viewport, zoomCamera } from './mapLogic'

export function useMapCamera(canvas: number, initialFocus?: { x: number; y: number }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<Viewport>({ width: 800, height: 600 })
  const [camera, setCamera] = useState<Camera>(() => ({
    x: initialFocus?.x ?? canvas / 2,
    y: initialFocus?.y ?? canvas / 2,
    zoom: initialFocus ? 4 : 1,
  }))
  const cameraRef = useRef(camera)
  const frameRef = useRef<null | number>(null)
  const pendingCameraRef = useRef(camera)
  const [coordinates, setCoordinates] = useState<null | { x: number; y: number }>(null)
  const pendingCoordinatesRef = useRef<null | { x: number; y: number }>(null)
  const gesture = useRef({ points: new Map<number, { x: number; y: number }>(), moved: false, suppressUntil: 0 })

  const scheduleFrame = useCallback(() => {
    if (frameRef.current !== null) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      cameraRef.current = pendingCameraRef.current
      setCamera(pendingCameraRef.current)
      setCoordinates(pendingCoordinatesRef.current)
    })
  }, [])

  const updateCamera = useCallback(
    (update: ((current: Camera) => Camera) | Camera) => {
      const current = cameraRef.current
      const next = typeof update === 'function' ? update(current) : update
      cameraRef.current = next
      pendingCameraRef.current = next
      scheduleFrame()
    },
    [scheduleFrame],
  )

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(() => setViewport({ width: stage.clientWidth, height: stage.clientHeight }))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const handleWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-map-control]')) return
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
        ),
      )
    }
    stage.addEventListener('wheel', handleWheel, { passive: false })
    return () => stage.removeEventListener('wheel', handleWheel)
  }, [canvas, updateCamera, viewport])

  function point(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest('[data-map-control]'))) return
    const g = gesture.current
    if (!g.points.size) g.moved = false
    g.points.set(event.pointerId, point(event))
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current,
      p = point(event)
    pendingCoordinatesRef.current = toCanvas(p.x, p.y, cameraRef.current, viewport, canvas)
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
        const next = zoomCamera(current, distanceAfter / Math.max(1, distanceBefore), cx, cy, viewport, canvas)
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
  }
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.ctrlKey || event.altKey || event.metaKey) return
    if (['+', '-', '=', '_'].includes(event.key)) {
      event.preventDefault()
      zoom(['+', '='].includes(event.key) ? Math.SQRT2 : 1 / Math.SQRT2)
    } else if (event.key.startsWith('Arrow')) {
      event.preventDefault()
      const amount = (event.shiftKey ? 240 : 90) / cameraScale(camera, viewport, canvas)
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
    updateCamera((current) => zoomCamera(current, factor, viewport.width / 2, viewport.height / 2, viewport, canvas))
  }
  function fit() {
    updateCamera({ x: canvas / 2, y: canvas / 2, zoom: 1 })
  }
  function jump(p: { x: number; y: number }) {
    updateCamera((current) => ({ x: p.x, y: p.y, zoom: Math.max(4, current.zoom) }))
  }
  return {
    stageRef,
    viewport,
    camera,
    coordinates,
    zoom,
    fit,
    jump,
    canClick: () => performance.now() > gesture.current.suppressUntil,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onKeyDown: handleKeyDown,
    },
  }
}
