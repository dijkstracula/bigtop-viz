import { Result } from "./interfaces"
import { Keyframe, KeyframesFromLines, KeyframeFromDataArray } from "./keyframe"

const HEADER = "new state,previous state,action,reward"

test('Errors on an incorrect keyframe structure (1)', () => {
    const input = [[0.0, -1.0, 0.1, 0.2], [0, 0, 0, 0], [1], [0]];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Errors on an incorrect keyframe structure (2)', () => {
    const input = [0.0, -1.0, 0.1, 0.2];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Errors on out-of-bounds cart_x (1)', () => {
    const input = [[-4.81, -1.0, 0.1, 0.2], [0, 0, 0, 0], 0, 0];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Errors on out-of-bounds cart_x (2)', () => {
    const input = [[4.81, -1.0, 0.1, 0.2], [0, 0, 0, 0], 0, 0];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Errors on out-of-bounds pole_theta (1)', () => {
    const input = [[0, -1.0, -0.419, 0.2], [0, 0, 0, 0], 0, 0];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Errors on out-of-bounds pole_theta (2)', () => {
    const input = [[0, -1.0, 0.419, 0.2], [0, 0, 0, 0], 0, 0];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Errors on invalid action', () => {
    const input = [[0, -1.0, 0.419, 0.2], [0, 0, 0, 0], 42, 0];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Errors on invalid reward', () => {
    const input = [[0, -1.0, 0.419, 0.2], [0, 0, 0, 0], 0, 2];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);
    expect(output instanceof Error).toBe(true)
});

test('Constructs a correct keyframe (1)', () => {
    const input = [[0, -1.0, 0.1, 0.2], [0, 0, 0, 0], 0, 0];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);

    expect((output instanceof Error)).toBe(false);
    const asKeyframe = (output as Keyframe);

    expect(asKeyframe.cart_x).toBe(0.0)
    expect(asKeyframe.cart_dx).toBe(-1.0)
    expect(asKeyframe.pole_theta).toBe(0.1)
    expect(asKeyframe.pole_omega).toBe(0.2)
    expect(asKeyframe.action).toBe("Left")
    expect(asKeyframe.reward).toBe(null)
});

test('Constructs a correct keyframe (2)', () => {
    const input = [[0, -1.0, 0.1, 0.2], [0, 0, 0, 0], 1, 0];
    const output: Result<Keyframe> = KeyframeFromDataArray(input);

    expect((output instanceof Error)).toBe(false);
    const asKeyframe = (output as Keyframe);
    
    expect(asKeyframe.cart_x).toBe(0)
    expect(asKeyframe.cart_dx).toBe(-1.0)
    expect(asKeyframe.pole_theta).toBe(0.1)
    expect(asKeyframe.pole_omega).toBe(0.2)
    expect(asKeyframe.action).toBe("Right")
    expect(asKeyframe.reward).toBe(null)
});

test('Errors if header is missing', () => {
    const input = [
        /* HEADER, */
        "[0 -1.0 0.1 0.2], [0 0 0 0], 1, 0"
    ]

    const output: Result<Keyframe[]> = KeyframesFromLines(input);

    expect((output instanceof Error)).toBe(true);
})

test('Constructs correct array of keyframes (1)', () => {
    const input = [
        HEADER,
        "[0 -1.0 0.1 0.2], [0 0 0 0], 1, 0"
    ]

    const output: Result<Keyframe[]> = KeyframesFromLines(input);

    expect((output instanceof Error)).toBe(false);
    const asKeyframes = (output as Keyframe[]);

    expect(asKeyframes.length).toBe(input.length - 1)

    const kf = asKeyframes[0]

    expect(kf.cart_x).toBe(0)
    expect(kf.cart_dx).toBe(-1.0)
    expect(kf.pole_theta).toBe(0.1)
    expect(kf.pole_omega).toBe(0.2)
    expect(kf.action).toBe("Right")
    expect(kf.reward).toBe(null)
})