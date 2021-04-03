import type { Demo } from '../../common/protocol'
import type { ChangeDemo, ExecutionStrategy, ExecutionStrategyStart } from './index'
import { onContext } from '../../common/onContext'
import {
  shouldRun,
  mainLoop,
  getDrawBuffer,
  flushDrawBuffer,
  mutateMatrix,
  pixelsPerMeterGetter,
  switchDemo,
  setClearCanvas
} from '../../common/demoSwitcher'

export const runOnMainThread: ExecutionStrategyStart = ({
  canvasElement,
  initialDemo,
  replaceCanvas
}): ExecutionStrategy => {
  const gl: WebGL2RenderingContext | null = canvasElement.getContext('webgl2')
  if (gl === null) {
    throw new Error('Failed to create WebGL2 rendering context')
  }
  setClearCanvas(() => gl.clear(gl.COLOR_BUFFER_BIT))
  onContext(
    gl,
    shouldRun,
    mainLoop,
    getDrawBuffer,
    flushDrawBuffer,
    mutateMatrix,
    pixelsPerMeterGetter
  )
  const changeDemo: ChangeDemo = (demo: Demo): void => {
    switchDemo(demo)
  }
  changeDemo(initialDemo)

  return {
    changeDemo,
    destroy: () => {
      replaceCanvas()
    }
  }
}