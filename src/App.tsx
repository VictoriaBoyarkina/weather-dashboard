import usePlaces from './hooks/usePlaces'

function App() {
  const { isLoading, data, error, getSearchResults } = usePlaces()
  console.log(data)
  console.log(isLoading)
  console.log(error)

  async function handleChange(value: string) {
    getSearchResults.current(value)
  }

  return (
    <div className="flex flex-col min-h-screen font-Roboto bg-weather-primary">
      <main className="container text-white">
        <div className="pt-4 mb-8 relative">
          <input
            type="text"
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search for a city"
            className="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow"
          />
          <ul className="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"></ul>
        </div>
        <div className="flex flex-col gap-4"></div>
      </main>
    </div>
  )
}

export default App
