import * as React from 'react';

import { Keyframe } from '../keyframe';

interface Props {
    keyframes: Keyframe[]
    currentFrame: number
}

const PRECISION = 3

const inputsFromProps = (props: Props) => {
    const body = props.keyframes.map((kf: Keyframe, i: Number) => {
        let classname = ""
        if (i == props.currentFrame) {
            classname += " highlighted"
        }
        return (
            <tr className={classname}>
                <td>{i}</td>
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
                    <th>i</th>
                    <th>x</th>
                    <th>dx</th>
                    <th>θ</th>
                    <th>ω</th>
                    <th>↔</th>
                </thead>
                {inputsFromProps(props)}
            </table>
        </div>
    )
}