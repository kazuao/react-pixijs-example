import { extend, useTick } from '@pixi/react'
import { Assets, Sprite, Texture } from 'pixi.js'
import { useCallback, useEffect, useRef, useState } from 'react'

// agent: @pixi/react v8 は JSX で使う Pixi 要素を明示的に登録する必要がある
extend({ Sprite })

const bunnyImageUrl = 'https://pixijs.com/assets/bunny.png'
const initialMotion = {
  x: 100,
  y: 100,
  dx: 3, // x方向の速度
  dy: 3, // y方向の速度
}

// アニメーションを制御するコンポーネント
const BouncingBunny = () => {
  const spriteRef = useRef<Sprite>(null)
  const motionRef = useRef(initialMotion)
  const [bunnyTexture, setBunnyTexture] = useState(Texture.EMPTY)

  useEffect(() => {
    // agent: 外部画像アセットを Pixi の Assets キャッシュへ明示的にロードする
    void Assets.load<Texture>(bunnyImageUrl).then(setBunnyTexture)
  }, [])

  const width = 400 // ステージの幅
  const height = 400

  // useTickはPixiJSのメインループ（Ticker）に毎フレーム処理を登録するフック
  const updateMotion = useCallback((ticker: { deltaTime: number }) => {
    const sprite = spriteRef.current

    if (sprite === null) {
      return
    }

    // agent: Pixi のフレーム更新では React state ではなく表示オブジェクトを直接更新する
    const delta = ticker.deltaTime
    const motion = motionRef.current
    const nextX = motion.x + motion.dx * delta
    const nextY = motion.y + motion.dy * delta

    // 画面の端（今回はw400, h400のステージを想定）で跳ね返る判定
    // スプライトの中心点を基準（anchor=0.5）にするため、サイズ（50x50）の半分を考慮
    const nextDx = nextX > width - 25 || nextX < 25 ? -motion.dx : motion.dx
    const nextDy = nextY > height - 25 || nextY < 25 ? -motion.dy : motion.dy

    motionRef.current = {
      x: nextX,
      y: nextY,
      dx: nextDx,
      dy: nextDy,
    }
    // eslint-disable-next-line functional/immutable-data -- agent: Pixi の表示オブジェクトは ticker 内で直接座標を更新する
    sprite.x = nextX
    // eslint-disable-next-line functional/immutable-data -- agent: Pixi の表示オブジェクトは ticker 内で直接座標を更新する
    sprite.y = nextY
  }, [])

  useTick(updateMotion)

  return (
    <pixiSprite
      ref={spriteRef}
      texture={bunnyTexture}
      x={initialMotion.x}
      y={initialMotion.y}
      anchor={0.5} // 中心点を画像の真ん中に設定
      width={50}
      height={50}
    />
  )
}

export default BouncingBunny
