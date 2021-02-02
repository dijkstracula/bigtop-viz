import * as React from 'react';

import { Keyframe } from '../keyframe';

interface Props {
    keyframes: Keyframe[]
    currentFrame: number
}

const PRECISION = 3
const COLS = 10

const inputsFromProps = (props: Props) => {
    const b = Math.min(props.keyframes.length - COLS, Math.max(0, props.currentFrame - COLS / 2))
    const e = Math.min(props.keyframes.length, b + COLS)
    const kfs = props.keyframes.slice(b, e)

    const body = kfs.map((kf: Keyframe, i: number) => {
        let classname = ""
        if (i + b == props.currentFrame) {
            classname += " highlighted"
        }
        return (
            <tr className={classname} key={i + b}>
                <td>{i + b}</td>
                <td>{kf.cart_x.toFixed(PRECISION)}</td>
                <td>{kf.cart_dx.toFixed(PRECISION)}</td>
                <td>{kf.pole_omega.toFixed(PRECISION)}</td>
                <td>{kf.pole_omega.toFixed(PRECISION)}</td>
                <td>{kf.action}</td>
            </tr>
        )
    })
    return (<tbody>{body}</tbody>)
}

export const KeyframeTable = (props: Props) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>i</th>
                        <th>x</th>
                        <th>dx</th>
                        <th>θ</th>
                        <th>ω</th>
                        <th>↔</th>
                    </tr>
                </thead>
                {inputsFromProps(props)}
            </table>
        </div>
    )
}