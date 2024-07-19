import { useEffect, useState } from 'react'
import usePlaces from '../hooks/usePlaces'
import useOutsideClick from '../hooks/useOutsideClick'
import { Chart, Place } from '../types'

interface Props {
  onSetCurrentPlace: React.Dispatch<React.SetStateAction<Place | null>>
  currentPlace: Place | null
  chart: Chart | null
}

export default function SearchPlace({
  currentPlace,
  onSetCurrentPlace,
}: Props) {
  const [value, setValue] = useState('')
  const { data, error, getSearchResults } = usePlaces()
  const [resultIsOpen, setResultIsOpen] = useState(false)

  useEffect(
    function () {
      setValue(currentPlace?.placeName || '')
    },
    [currentPlace]
  )

  const ref = useOutsideClick<HTMLDivElement>(handleClickOutside, true)

  function handleClickOutside() {
    if (currentPlace) setValue(currentPlace.placeName)
    setResultIsOpen(false)
  }

  async function handleChange(value: string) {
    setValue(value)
    setResultIsOpen(true)
    if (getSearchResults.current) getSearchResults.current(value)
  }

  function handleClick(place: Place) {
    onSetCurrentPlace(place)
    setResultIsOpen(false)
    setValue(place.placeName)
  }

  function handleFocus() {
    setValue('')
    setResultIsOpen(true)
  }

  return (
    <div className="pt-4 mb-6 relative" ref={ref}>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        placeholder="Search for a city"
        className="py-2 px-1 w-full bg-transparent border-b border-slate-300 text-blue-700 font-semibold focus:border-weather-secondary focus:outline-none focus:shadow mb-3"
      />
      {resultIsOpen && (
        <ul className="absolute z-50 bg-slate-600 text-white w-full shadow-md py-2 px-1 top-[66px]">
          {error && <p>Sorry, something went wrong, please try again.</p>}
          {!error && data.length === 0 && (
            <p>No results match your query, try a different term.</p>
          )}
          {!error &&
            data.length > 0 &&
            data.map((place) => (
              <li
                className="cursor-pointer py-2"
                key={place.id}
                onClick={() => handleClick(place)}
              >
                {place.placeName}
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
