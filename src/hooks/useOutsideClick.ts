import { useEffect, useRef } from 'react'

function useOutsideClick<RefType extends HTMLElement>(
  handler: () => void,
  listenCapturing: boolean = true
) {
  const ref = useRef<RefType>(null)

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (
          ref.current &&
          e.target instanceof Node &&
          !ref.current.contains(e.target)
        ) {
          handler()
        }
      }
      document.addEventListener('click', handleClick, listenCapturing)
      return () =>
        document.removeEventListener('click', handleClick, listenCapturing)
    },
    [handler, listenCapturing]
  )
  return ref
}

export default useOutsideClick
