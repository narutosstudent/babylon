import { createSignal, Match, Show, Switch } from 'solid-js'

import dubaiAudio from './assets/dubai.mp3'
import dubaiVideo from './assets/dubai.mp4'
import { Play } from './icons/Play'
import { Stop } from './icons/Stop'

export const App = () => {
  const [isVideoPlaying, setIsVideoPlaying] = createSignal(true)
  const [displayAnimationToBeShown, setDisplayAnimationToBeShown] =
    createSignal<'stop' | 'play' | ''>('')

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
          class="player__video"
          src={dubaiVideo}
          width="1200"
          onClick={togglePause}
          autoplay
          muted
        />

        <div class="player__controls">
          <div class="progress">
            <div class="progress__filled" />
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
