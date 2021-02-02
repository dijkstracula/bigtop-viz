import * as React from 'react';

import { Keyframe } from '../keyframe';

/* Slightly more than the min/max cartpole position */
const MIN_X = -4.0
const MAX_X = 4.0
const CART_WIDTH = 1.5
const CART_HEIGHT = 0.30
const TRACK_HEIGHT = 2.90
const POLE_LENGTH = 2.5
const POLE_WIDTH = 0.15

interface Props {
    kf: Keyframe;
}

const pole = (x: number, theta: number) => {
    const y1 = TRACK_HEIGHT - CART_HEIGHT;
    const y2 = y1 - POLE_LENGTH;

    const points: string = [
        [x - (POLE_WIDTH / 2), y2],
        [x + (POLE_WIDTH / 2), y2],
        [x + (POLE_WIDTH / 2), y1],
        [x - (POLE_WIDTH / 2), y1],
    ].reduce((str, v) => `${str} ${v[0]},${v[1]}`, "")


    const transform = `rotate(${theta * 360 / Math.PI / 2},${x} ${y1})`
    return (
        <g transform={transform}>
            <polyline points={points} filter="url(#dxblur)" />
        </g >
    )
}

const cart = (x: number) => {
    return (
        <g>
            <rect x={x - (CART_WIDTH / 2)} y={TRACK_HEIGHT - CART_HEIGHT} width={CART_WIDTH} height={CART_HEIGHT}
                rx={0.125}
                fill="#59431c"
                filter="url(#dxblur)"
            />
        </g>
    )
}

const dxblur = (dx: number) => {
    dx *= 0.005
    const stddev = `${Math.abs(dx)} 0`
    return (
        <filter id={"dxblur"}>
            <feGaussianBlur stdDeviation={stddev} />
            <feOffset dx={-dx} />
            <feComposite operator="over" in="SourceGraphic" />
        </filter>
    )
}

export const CartpoleStage = (props: Props) => {
    const viewbox = `${MIN_X} ${0} ${MAX_X - MIN_X} ${2}`
    return (
        <svg width="100%" height="100%" viewBox={viewbox} preserveAspectRatio="xMinYMid meet" style={{ backgroundColor: "grey" }} >
            <line x1={MIN_X} x2={MAX_X} y1={TRACK_HEIGHT} y2={TRACK_HEIGHT} stroke="black" strokeWidth="0.01" />

            <defs>
                {dxblur(props.kf.cart_dx)}
            </defs>

            {pole(props.kf.cart_x, props.kf.pole_theta)}
            {cart(props.kf.cart_x)}
        </svg>
    )
}