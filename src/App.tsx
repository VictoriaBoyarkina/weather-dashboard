import { useState } from 'react'
import SearchPlace from './components/SearchPlace'
import SideBar from './components/SideBar'
import { Place } from './types'

function App() {
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null)
  return (
    <div className="grid grid-rows-3 grid-flow-col gap-4 min-h-screen font-Roboto bg-weather-primary">
      <SideBar />
      <header className="col-span-2">
        <div className="flex flex-col gap-4">
          <SearchPlace onSetCurrentPlace={setCurrentPlace} />
        </div>
      </header>

      <main className="row-span-2 col-span-2"></main>
      {/* 
      {currentPlace && (
        <div className=" text-white py-2 bg-weather-secondary w-full text-center">
          <div className="container">
            <p>Location: {currentPlace.placeName}</p>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default App
