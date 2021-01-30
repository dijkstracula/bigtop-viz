import React, { Component, useEffect } from 'react';

import { Result } from "./interfaces"
import { KeyframeTable } from './components/KeyframeTable'
import { Keyframe, KeyframesFromLines } from './keyframe';
import { PlaybackControls } from './components/PlaybackControls';


const INPUT = `new state,previous state,action,reward
[0.011347046974051981 -0.15130313186528035 0.016331433696223002 0.2916006514062464],[0.010466028797961956 0.04405090880450124 0.016456005321849043 -0.006228581281301979],0,0.000000
[0.008320984336746374 -0.34665409126457547 0.022163446724347932 0.5893892420667983],[0.011347046974051981 -0.15130313186528035 0.016331433696223002 0.2916006514062464],0,0.000000
[0.0013879025114548645 -0.5420792609518238 0.0339512315656839 0.8889705221022804],[0.008320984336746374 -0.34665409126457547 0.022163446724347932 0.5893892420667983],0,0.000000
[-0.009453682707581611 -0.7376450890245887 0.05173064200772951 1.1921299555090266],[0.0013879025114548645 -0.5420792609518238 0.0339512315656839 0.8889705221022804],0,0.000000
[-0.024206584488073384 -0.9333976214028855 0.07557324111791004 1.5005679840206194],[-0.009453682707581611 -0.7376450890245887 0.05173064200772951 1.1921299555090266],0,0.000000
[-0.04287453691613109 -1.1293516876858987 0.10558460079832244 1.815857505765986],[-0.024206584488073384 -0.9333976214028855 0.07557324111791004 1.5005679840206194],0,0.000000
[-0.06546157066984906 -1.3254782319400435 0.14190175091364216 2.1393932435036724],[-0.04287453691613109 -1.1293516876858987 0.10558460079832244 1.815857505765986],0,0.000000
[-0.09197113530864993 -1.5216893762251393 0.18468961578371562 2.472330978002499],[-0.06546157066984906 -1.3254782319400435 0.14190175091364216 2.1393932435036724],0,0.000000
[-0.007536250292873428 0.018682307286710942 -0.04343629807825238 -0.03434807452672088],[-0.09197113530864993 -1.5216893762251393 0.18468961578371562 2.472330978002499],0,-1.000000`.split("\n")

type AppState = {
  keyframes: Result<Keyframe[]>
  currentFrame: number
  isPlaying: boolean
  fps: number
}

export default class App extends Component<{}, AppState> {
  public state: AppState = {
    keyframes: KeyframesFromLines(INPUT),
    currentFrame: 0,
    isPlaying: true,
    fps: 25
  }

  onTimeout() {
    setTimeout(() => {
      if (!(this.state.keyframes instanceof Error)) {
        this.setState({ currentFrame: (this.state.currentFrame + 1) % (this.state.keyframes.length) })
      }
      this.onTimeout()
    }, 1000 / this.state.fps)
  }

  componentDidMount() {
    this.onTimeout()
  }

  render() {
    let kfComponent;
    if (this.state.keyframes instanceof Error) {
      kfComponent = (<div>Error: {this.state.keyframes} </div>)
    } else {
      kfComponent = (<KeyframeTable currentFrame={this.state.currentFrame} keyframes={this.state.keyframes} />)
    }
    return (
      /* Menu */
      <div className="container flex-direction=row">
        <div className="terminal-nav">
          <header className="terminal-logo">Bigtop</header>
          <nav className="terminal-menu">
            <ul vocab="https://schema.org" typeof="BreadcrumbList">
              <li><a href="#">About</a></li>
              <li><a href="#">Upload</a></li>
            </ul>
          </nav>
        </div>
        <hr />
        <div className="flex flex-direction=column">
          {/* left column: the viz stage */}
          <div className="stage">
            <header>
              <h2>Vis</h2>
            </header>
            <div className="state"></div>
          </div>
          {/* right column: the keyframe table and controls */}
          <div className="flex-direction=row">
            <div className="keyframe-table">
              <header>
                <h3>Keyframes</h3>
              </header>
              {kfComponent}
            </div>
            <div className="keyframe-table">
              <PlaybackControls
                isPlaying={this.state.isPlaying}
                fps={this.state.fps}
                currentFrame={this.state.currentFrame}
                totalFrames={8}
                onFPSChange={(fps: number) => this.setState({ fps: fps })}
                onFrameChange={(frame: number) => this.setState({ currentFrame: frame })} />
            </div>
          </div>
        </div>
      </div >
    );
  }
};
