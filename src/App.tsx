import { createEffect, createSignal, Match, Show, Switch } from 'solid-js'

import dubaiAudio from './assets/dubai.mp3'
import dubaiVideo from './assets/dubai.mp4'
import { Backward } from './icons/Backward'
import { Forward } from './icons/Forward'
import { Play } from './icons/Play'
import { Stop } from './icons/Stop'

// Gets us time in format mm:ss
function getFormattedTime(time: number) {
  return new Date(1000 * time).toISOString().substring(14, 19)
}

export const App = () => {
  const [isVideoPlaying, setIsVideoPlaying] = createSignal(true)
  const [displayAnimationToBeShown, setDisplayAnimationToBeShown] =
    createSignal<'stop' | 'play' | ''>('')

  const [totalTime, setTotalTime] = createSignal('')
  const [currentTime, setCurrentTime] = createSignal('')
  const [currentProgress, setCurrentProgress] = createSignal(0)

  let videoElement: HTMLVideoElement
  let audioElement: HTMLAudioElement

  function triggerDisplayAnimation(isVideoCurrentlyPaused: boolean) {
    setDisplayAnimationToBeShown(isVideoCurrentlyPaused ? 'play' : 'stop')
  }

  function togglePause(
    event: Event & {
      currentTarget: HTMLVideoElement | HTMLButtonElement
      target: Element
    }
  ) {
    const hasClickedOnVideo = 'videoHeight' in event.target
    const isVideoCurrentlyPaused = videoElement.paused

    if (hasClickedOnVideo) {
      triggerDisplayAnimation(isVideoCurrentlyPaused)
    }

    if (isVideoCurrentlyPaused) {
      videoElement.play()
      audioElement.play()
      setIsVideoPlaying(true)
    } else {
      videoElement.pause()
      audioElement.pause()
      setIsVideoPlaying(false)
    }
  }

  createEffect(() => {
    videoElement.onloadedmetadata = function () {
      if (totalTime() === '' || currentTime() === '') {
        setTotalTime(getFormattedTime(videoElement.duration))
        setCurrentTime(getFormattedTime(videoElement.currentTime))
      }
    }
  })

  function handleVideoProgress(
    event: Event & { currentTarget: HTMLVideoElement; target: HTMLVideoElement }
  ) {
    setCurrentTime(getFormattedTime(event.target.currentTime))
    setCurrentProgress(
      Math.round((videoElement.currentTime / videoElement.duration) * 100)
    )
  }

  function handleSkipBySeconds(secondsToBeSkipped: number) {
    videoElement.currentTime += secondsToBeSkipped
    setCurrentTime(getFormattedTime(videoElement.currentTime))
  }

  function handleProgressSliderChange(
    event: Event & { currentTarget: HTMLInputElement; target: Element }
  ) {
    const roundedProgress = Math.round(
      Number((event.target as HTMLInputElement).value)
    )

    const percentage = roundedProgress / 100
    const newTime = percentage * videoElement.duration

    setCurrentProgress(roundedProgress)
    videoElement.currentTime = newTime
    setCurrentTime(getFormattedTime(newTime))
  }

  return (
    <main class="background-styles relative h-full w-full">
      <h1 class="sr-only">Dubai, the new Babylon.</h1>
      <audio
        autoplay
        loop
        src={dubaiAudio}
        class="sr-only"
        ref={audioElement}
        muted
      />

      <div class="player">
        <Switch>
          <Match when={displayAnimationToBeShown() === 'stop'}>
            <Stop class="display-animation" />
          </Match>
          <Match when={displayAnimationToBeShown() === 'play'}>
            <Play class="display-animation" />
          </Match>
        </Switch>

        <video
          ref={videoElement}
          onTimeUpdate={handleVideoProgress}
          class="player__video"
          src={dubaiVideo}
          width="1200"
          onClick={togglePause}
          autoplay
          muted
          loop
        />

        <div class="player__controls">
          <div class="absolute top-0 w-full">
            <div class="player__slider-wrapper relative w-full">
              <input
                type="range"
                name="progress"
                min="0"
                max="100"
                step="0.1"
                class="player__slider"
                onInput={handleProgressSliderChange}
                value={currentProgress()}
              />
              <div
                class="player__progress-finished"
                style={{
                  transform: `scaleX(${currentProgress() * 0.01})`,
                }}
              />
            </div>
          </div>

          <div class="player__time">
            <span>{currentTime()}</span> / <span>{totalTime()}</span>
          </div>

          <div class="player__skip">
            <button
              aria-label="Skip Backward by 30 seconds"
              class="player__skip-button"
              onClick={() => handleSkipBySeconds(-30)}
            >
              <Backward class="backward" />
            </button>

            <button
              aria-label="Skip Forward by 30 seconds"
              class="player__skip-button"
              onClick={() => handleSkipBySeconds(30)}
            >
              <Forward class="forward" />
            </button>
          </div>

          <button
            class="player__button"
            title="Toggle Play"
            onClick={togglePause}
            aria-label={isVideoPlaying() ? 'Stop video' : 'Play video'}
          >
            <Show when={isVideoPlaying()} fallback={<Play />}>
              <Stop />
            </Show>
          </button>
        </div>
      </div>
    </main>
  )
}
