import * as React from 'react';

interface Props {
    isPlaying: boolean
    fps: number
    currentFrame: number
    totalFrames: number

    onFPSChange: (fps: number) => void
    onFrameChange: (frame: number) => void
    onPauseClick: () => void
    onChapterChange: (offset: number) => void
}

const MIN_FPS = 1
const MAX_FPS = 60

const PREV_CHAPTER = "<<"
const NEXT_CHAPTER = ">>"
const BACK_BUTTON = "<"
const FW_BUTTON = ">"
const PAUSE_BUTTON = "Pause"
const PLAY_BUTTON = "Play"

export const PlaybackControls = (props: Props) => {
    let playbackButtonText = (props.isPlaying) ? PAUSE_BUTTON : PLAY_BUTTON
    return (
        <form action="#">
            <fieldset>
                <legend>Controls</legend>
                <div className="playback-controls">
                    <div className="form-group">
                        <label>Frame {props.currentFrame}/{props.totalFrames} </label>
                        <input type="range" min="0" max={props.totalFrames - 1} step="1"
                            value={props.currentFrame}
                            onChange={(e) => props.onFrameChange(e.target.valueAsNumber)} />
                    </div>

                    <div className="form-group">
                        <label>frames/sec: {props.fps}</label>
                        <input type="range" min={MIN_FPS} max={MAX_FPS} step="1"
                            value={props.fps}
                            onChange={(e) => {
                                e.preventDefault()
                                props.onFPSChange(e.target.valueAsNumber)
                            }} />
                    </div>

                    <div className="flex flex-direction=row">
                        <div className="form-group">
                            <button id="submit"
                                className="btn btn-default btn-ghost"
                                onClick={(e) => {
                                    e.preventDefault()
                                    props.onChapterChange(-1)
                                }}
                            >{PREV_CHAPTER}</button>
                        </div>
                        <div className="form-group">
                            <button id="submit"
                                className="btn btn-default btn-ghost"
                                onClick={(e) => {
                                    e.preventDefault()
                                    props.onFrameChange(((props.currentFrame + props.totalFrames) - 1) % (props.totalFrames - 1))
                                }}
                            >{BACK_BUTTON}</button>
                        </div>
                        <div className="form-group">
                            <button id="submit"
                                className="btn btn-default btn-ghost"
                                onClick={(e) => {
                                    e.preventDefault()
                                    props.onPauseClick()
                                }}
                            >{playbackButtonText}</button>
                        </div>
                        <div className="form-group">
                            <button id="submit"
                                className="btn btn-default btn-ghost"
                                onClick={(e) => {
                                    e.preventDefault()
                                    props.onFrameChange(props.currentFrame + 1 % (props.totalFrames - 1))
                                }}
                            >{FW_BUTTON}</button>
                        </div>
                        <div className="form-group">
                            <button id="submit"
                                className="btn btn-default btn-ghost"
                                onClick={(e) => {
                                    e.preventDefault()
                                    props.onChapterChange(1)
                                }}
                            >{NEXT_CHAPTER}</button>
                        </div>
                    </div>
                </div>
            </fieldset>
        </form >
    )
}