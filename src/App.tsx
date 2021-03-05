import React, { Component } from 'react';
import { le } from 'binary-search-bounds';

import { Result } from "./interfaces"
import { KeyframeTable } from './components/KeyframeTable'
import { ChaptersFromKeyframes, Keyframe, KeyframesFromLines } from './keyframe';
import { PlaybackControls } from './components/PlaybackControls';
import { CartpoleStage } from './components/CartpoleStage';
import { MessageBar } from './components/MessageBar';
import { fileURLToPath } from 'url';

const WELCOME_MSG = "🎪 Welcome to BigTop 🎪"

type AppState = {
  // TODO: Pull this out into a separate Error and Keyframe[] field, I think.  Destructuring it
  // everywhere is more of a pain than I thought it would be.
  keyframes: Result<Keyframe[]>
  chapters: number[]
  currentFrame: number
  isPlaying: boolean
  fps: number
  msg: string
}

export default class App extends Component<{}, AppState> {
  public state: AppState = {
    keyframes: [],
    chapters: [],
    currentFrame: 0,
    isPlaying: true,
    fps: 25,
    msg: "Load a Cartpoles file to begin."
  }

  onTimeout() {
    setTimeout(() => {
      if (this.state.isPlaying && !(this.state.keyframes instanceof Error) && this.state.keyframes.length > 0) {
        const nextFrameIdx = (this.state.currentFrame + 1) % (this.state.keyframes.length - 1)
        const nextFrame = this.state.keyframes[nextFrameIdx]

        if (nextFrame.reward !== undefined) {
          const msg = `Reward of ${nextFrame.reward} on frame ${nextFrameIdx}`
          this.setState({ msg: msg })
        }

        this.setState({ currentFrame: nextFrameIdx })
        this.onTimeout()
      }
    }, 1000 / this.state.fps)
  }

  onFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files === null || e.currentTarget.files.length == 0) {
      return
    }
    const text = e.currentTarget.files[0].text()
    text.then((blob) => {
      const lines = blob.split("\n")
      const kfs = KeyframesFromLines(lines)
      if (!(kfs instanceof Error)) {
        const chps = ChaptersFromKeyframes(kfs)

        this.setState({ keyframes: kfs, chapters: chps, currentFrame: 0 })
        this.onTimeout()
      } else {
        this.setState({ keyframes: kfs })
      }
    })
  }

  render() {
    let vizComponents;

    if (this.state.keyframes instanceof Error) {
      vizComponents = <div>Error: {this.state.keyframes.message} </div>
    } else if (this.state.keyframes?.length === 0) {
      vizComponents = <div>
        <h1>{WELCOME_MSG}</h1>
      </div>
    } else {
      vizComponents = <div className="container flex flex-direction=column">
        {/* left column: the viz stage */}
        <div className="">
          <CartpoleStage kf={this.state.keyframes[this.state.currentFrame]} />
        </div>
        {/* right column: the keyframe table and controls */}
        <div className="container flex-direction=row">
          <div className="container keyframe-table">
            <KeyframeTable currentFrame={this.state.currentFrame} keyframes={this.state.keyframes} />
          </div>
          <div className="container">
            <PlaybackControls
              isPlaying={this.state.isPlaying}
              fps={this.state.fps}
              currentFrame={this.state.currentFrame}
              totalFrames={this.state.keyframes.length}
              onFPSChange={(fps: number) => this.setState({ fps: fps })}
              onFrameChange={(frame: number) => {
                this.setState({ currentFrame: frame, isPlaying: false, msg: "" })
              }}
              onPauseClick={() => {
                this.setState({ isPlaying: !this.state.isPlaying })
                this.onTimeout()
              }}
              onChapterChange={(offset: number) => {
                let chIdx = le(this.state.chapters, this.state.currentFrame)
                chIdx = (chIdx + this.state.chapters.length + offset) % (this.state.chapters.length)
                this.setState({ currentFrame: this.state.chapters[chIdx], msg: `Skipping to chapter ${chIdx + 1} of ${this.state.chapters.length}` })
              }}
            />
          </div>
        </div>
      </div>
    }

    return (
      /* Menu */
      <div className="container flex-direction=row">
        <div className="terminal-nav">
          <header className="terminal-logo">Bigtop</header>
          <nav className="terminal-menu">
            <ul vocab="https://schema.org" typeof="BreadcrumbList">
              <li>
                <label htmlFor="file-upload" className="custom-file-upload"> Load </label>
                <input id="file-upload" type="file" accept="text/csv" onChange={((e: any) => this.onFileLoad(e)).bind(this)} />
              </li>
            </ul>
          </nav>
        </div>
        <hr />
        {vizComponents}
        < MessageBar msg={this.state.msg} />
      </div >
    );
  }
};
