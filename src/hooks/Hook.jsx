import React, { useEffect, useRef } from 'react'

export const useOutsideClick = (callback) => {
    const ref = useRef(null)
    useEffect(() => {
    const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback()
        }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
        document.removeEventListener('mousedown', handleClickOutside)
    }
    }, [callback])

    return ref;
}



export default useOutsideClick
