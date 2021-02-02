import { Result } from "./interfaces"

export type Action = "Left" | "Right"

export type Reward = -1 | 1

export interface Keyframe {
    cart_x: number;     /* range: [-4,8, 4.8] */
    cart_dx: number;    /* range: [-Inf, Inf] */
    pole_theta: number; /* range: [-0.418, 0.418] */
    pole_omega: number; /* range: [-Inf, inf] */

    action: Action;

    reward?: Reward;
}

const MIN_CART_X = -4.8
const MAX_CART_X = 4.8
const MIN_POLE_THETA = -0.418
const MAX_POLE_THETA = 0.418

export function KeyframesFromLines(lines: string[]): Result<Keyframe[]> {
    let keyframes: Keyframe[] = []
    if (lines[0] !== "new state,previous state,action,reward") {
        return Error("Unknown header")
    }
    for (const line of lines.slice(1)) {
        // XXX: I hate this, but the structure is just annoying enough to be nontrivial to extract with regexen
        // but not annoying enough to extract with a parser generator.
        // TODO: confirm that we don't have control over this line format.
        let components: string[] = line.split(/,\s*/)
        if (components.length < 4) {
            return Error(`Couldn't parse ${line}: only ${components.length} components`)
        }
        components[0] = JSON.parse(components[0].replace(/\s+/g, ","))
        components[1] = JSON.parse(components[1].replace(/\s+/g, ","))
        const kf = KeyframeFromDataArray(components)
        if (kf instanceof Error) {
            return kf
        } else {
            keyframes.push(kf)
        }
    }
    return keyframes
}

/**
 * Produces a Keyframe given a sequence of strings of the following format:
 * 
 * [[cart position, cart velocity, pole angle, pole angular velocity],[unused, unused, unused, unused], action, reward]
 * 
 * @param csv A comma-separated line from a cartpoles environment run.
 * @returns either an Error if csv is invalid, or, a Keyframe if all parameters are valid.
 */
export function KeyframeFromDataArray(data: any[]): Result<Keyframe> {
    if (data.length < 4 || data.length > 5) {
        return Error(`Expected data of length 4 or 5; got ${data.length}`)
    }
    if (!Array.isArray(data[0]) || data[0].length !== 4) {
        return Error(`Expected data[0] ${data[0]} to be an array of length 4`)
    }
    if (!Array.isArray(data[1]) || data[1].length !== 4) {
        return Error(`Expected data[1] ${data[1]} to be an array of length 4`)
    }

    // XXX: Number() parses an array of one value. Argh.

    if (Array.isArray(data[2]) || Number(data[2]) === undefined) {
        return Error(`Expected data[2]=${data[2]} to be a number; got ${typeof(data[2])}.`)
    } else {
        data[2] = Number(data[2])
        if (data[2] !== 0 && data[2] !== 1) {
            return Error(`Expected data[2] ${data[2]} to be either 0 or 1.`)
        }
    }

    if (Array.isArray(data[3]) || Number(data[3]) === undefined) {
        return Error(`Expected data[3]=${data[3]} to be a number; got ${typeof(data[3])}.`)
    } else{
        data[3] = Number(data[3])
        if (data[3] !== -1 && data[3] !== 0 && data[3] !== 1) {
            return Error(`Expected data[3] ${data[3]} to be either -1, 0, or 1.`)
        }
    }

    /* XXX: does Number() throw? */
    const cart_x = Number(data[0][0])
    const cart_dx = Number(data[0][1])
    const pole_theta = Number(data[0][2])
    const pole_omega = Number(data[0][3])

    if (!Number.isFinite(cart_x)) {
        return Error(`cart_x: given ${cart_x}; expected a number`)
    }
    if (cart_x < MIN_CART_X || cart_x > MAX_CART_X) {
        return Error(`cart_x: given ${cart_x}; out of bounds`)
    }

    if (!Number.isFinite(cart_dx)) {
        return Error(`cart_dx: given ${cart_dx}; expected a number`)
    }

    if (!Number.isFinite(pole_theta)) {
        return Error(`pole_theta: given ${pole_theta}; expected a number`)
    }
    if (pole_theta < MIN_POLE_THETA || pole_theta > MAX_POLE_THETA) {
        return Error(`pole_theta given ${pole_theta}; out of bounds`)
    }

    if (!Number.isFinite(pole_omega)) {
        return Error(`pole_omega: given ${pole_omega}; expected a number`)
    }

    const action: Action = data[2] === 0 ? "Left" : "Right"

    let reward = null
    if (data[3] !== 0) {
        reward = data[3]
    }

    return {
        cart_x: cart_x,
        cart_dx: cart_dx,
        pole_theta: pole_theta,
        pole_omega: pole_omega,
        action: action,
        reward: reward
    }
}