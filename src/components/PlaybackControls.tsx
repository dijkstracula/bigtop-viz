import * as React from 'react';

interface Props {
    isPlaying: boolean
    fps: number
    currentFrame: number
    totalFrames: number

    onFPSChange: (fps: number) => void
    onFrameChange: (frame: number) => void
}

const MIN_FPS = 1
const MAX_FPS = 60

export const PlaybackControls = (props: Props) => {
    return (
        <form action="#">
            <fieldset>
                <legend>Controls</legend>
                <div className="playback-controls">
                    <div className="form-group">
                        <label>Frame {props.currentFrame}/{props.totalFrames} </label>
                        <input type="range" min="0" max={props.totalFrames} step="1"
                            value={props.currentFrame}
                            onChange={(e) => props.onFrameChange(e.target.valueAsNumber)} />
                    </div>
                    <div className="form-group">
                        <label>frames/sec: {props.fps}</label>
                        <input type="range" min={MIN_FPS} max={MAX_FPS} step="1"
                            value={props.fps}
                            onChange={(e) => props.onFPSChange(e.target.valueAsNumber)} />
                    </div>
                </div>
            </fieldset>
        </form>
    )
}