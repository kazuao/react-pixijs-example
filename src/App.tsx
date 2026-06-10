import './App.css'
import { Application } from '@pixi/react'

import RelativePositionMap from './components/RelativePositionMap'

const App = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#282c34',
      }}
    >
      <div>
        <h2
          style={{
            color: 'white',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          Relative Position Map
        </h2>

        {/* agent: @pixi/react v8 のルートには Application コンポーネントを使用する */}
        <Application width={400} height={400} background="#1099bb">
          <RelativePositionMap />
        </Application>
      </div>
    </div>
  )
}

export default App
