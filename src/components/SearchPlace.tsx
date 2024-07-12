import { useState } from 'react'
import usePlaces from '../hooks/usePlaces'
import useOutsideClick from '../hooks/useOutsideClick'
import { Place } from '../types'

interface Props {
  onSetCurrentPlace: React.Dispatch<React.SetStateAction<Place | null>>
}

export default function SearchPlace({ onSetCurrentPlace }: Props) {
  const [value, setValue] = useState('')
  const { data, error, getSearchResults } = usePlaces()
  const [resultIsOpen, setResultIsOpen] = useState(false)

  const ref = useOutsideClick<HTMLDivElement>(setResultIsOpen, true)

  async function handleChange(value: string) {
    setValue(value)
    setResultIsOpen(true)
    if (getSearchResults.current) getSearchResults.current(value)
  }

  function handleClick(place: Place) {
    onSetCurrentPlace(place)
    setResultIsOpen(false)
    setValue('')
  }

  return (
    <div className="pt-4 mb-8 relative" ref={ref}>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setResultIsOpen(true)}
        placeholder="Search for a city"
        className="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow"
      />
      {resultIsOpen && (
        <ul className="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
          {error && <p>Sorry, something went wrong, please try again.</p>}
          {!error && data.length === 0 && (
            <p>No results match your query, try a different term.</p>
          )}
          {data.length > 0 &&
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
