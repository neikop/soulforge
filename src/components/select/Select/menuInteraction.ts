type MenuInteractionEventLike = Pick<Event, 'composedPath' | 'target'>

type MenuRootLike = EventTarget & {
  contains: (node: Node | null) => boolean
}

function isEventWithinMenu({
  composedPath,
  menuRoot,
  target,
}: {
  composedPath?: () => EventTarget[]
  menuRoot: MenuRootLike
  target: EventTarget | null
}) {
  if (target instanceof Node && menuRoot.contains(target)) {
    return true
  }

  if (!composedPath) {
    return false
  }

  return composedPath().includes(menuRoot)
}

export function shouldCloseMenuFromPointerEvent({
  event,
  menuRoot,
}: {
  event: MenuInteractionEventLike
  menuRoot: MenuRootLike | null
}) {
  if (!menuRoot) {
    return false
  }

  return !isEventWithinMenu({
    composedPath: typeof event.composedPath === 'function' ? event.composedPath.bind(event) : undefined,
    menuRoot,
    target: event.target,
  })
}
