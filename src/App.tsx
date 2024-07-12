import { useState } from 'react'
import SearchPlace from './components/SearchPlace'
import { Place } from './types'

function App() {
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)

  return (
    <div className="flex flex-col min-h-screen font-Roboto bg-weather-primary">
      <main className="container text-white">
        <div className="flex flex-col gap-4">
          <SearchPlace onSetCurrentPlace={setCurrentPlace} />
        </div>
      </main>
      {currentPlace && (
        <div className=" text-white py-2 bg-weather-secondary w-full text-center">
          <div className="container">
            <p>Location: {currentPlace.placeName}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
