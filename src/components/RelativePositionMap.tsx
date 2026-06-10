import { extend } from '@pixi/react'
import { Assets, Sprite, Texture } from 'pixi.js'
import { useEffect, useMemo, useState } from 'react'

import { useRelativePositionStore } from '../stores/relativePositionStore'

// agent: @pixi/react v8 は JSX で使う Pixi 要素を明示的に登録する必要がある
extend({ Sprite })

const canvasSize = 400
const currentScreenPosition = {
  x: canvasSize * 0.5,
  y: canvasSize * 0.8,
}
const bunnyImageUrl = 'https://pixijs.com/assets/bunny.png'
const relationScale = 0.7
const objectSize = 36
const currentMarkerSize = 28

interface Position {
  x: number
  y: number
}

const toScreenPosition = (relativePosition: Position): Position => ({
  x: currentScreenPosition.x + relativePosition.x * relationScale,
  y: currentScreenPosition.y - relativePosition.y * relationScale,
})

const RelativePositionMap = () => {
  const [bunnyTexture, setBunnyTexture] = useState(Texture.EMPTY)
  const frame = useRelativePositionStore((state) => state.frame)
  const startFrameSubscription = useRelativePositionStore(
    (state) => state.startFrameSubscription,
  )
  const stopFrameSubscription = useRelativePositionStore(
    (state) => state.stopFrameSubscription,
  )

  useEffect(() => {
    // agent: 外部画像アセットを Pixi の Assets キャッシュへ明示的にロードする
    void Assets.load<Texture>(bunnyImageUrl).then(setBunnyTexture)
  }, [])

  useEffect(() => {
    // agent: 20fps の位置配信を Zustand ストアへ接続し、購読ライフサイクルを同期する
    startFrameSubscription()

    return () => {
      stopFrameSubscription()
    }
  }, [startFrameSubscription, stopFrameSubscription])

  const screenRelations = useMemo(
    () =>
      frame.relations.map((relation) => ({
        ...relation,
        screenPosition: toScreenPosition(relation.relativePosition),
      })),
    [frame],
  )

  return (
    <>
      <pixiSprite
        texture={bunnyTexture}
        x={currentScreenPosition.x}
        y={currentScreenPosition.y}
        anchor={0.5}
        width={currentMarkerSize}
        height={currentMarkerSize}
        alpha={0.65}
        tint={0x2fffd5}
      />
      {screenRelations.map((relation) => (
        <pixiSprite
          key={relation.id}
          texture={bunnyTexture}
          x={relation.screenPosition.x}
          y={relation.screenPosition.y}
          anchor={0.5}
          width={objectSize}
          height={objectSize}
        />
      ))}
    </>
  )
}

export default RelativePositionMap
