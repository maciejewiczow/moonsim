import * as React from 'react'
import { useEffect } from 'react'
import { connect } from 'react-redux'

import MoonAnimation from './../animation/MoonAnimation'

interface MoonCanvasInjectedProps {
    angle: number
}

let moon: MoonAnimation

const MoonCanvasComponent = ({ angle }: /* MoonCanvasInjectedProps */ any) => {
    const canvasRootRef = React.createRef<HTMLDivElement>()

    useEffect(() => {
        ;(async () => {
            if (canvasRootRef.current === null) return

            moon = new MoonAnimation(canvasRootRef.current)
            await moon.loadAssets()
            moon.animate()
        })()
    }, [])

    useEffect(() => moon.setAngle(angle), [angle])

    return <div ref={canvasRootRef} />
}

//TODO: Connect this to store
export const MoonCanvas = MoonCanvasComponent
