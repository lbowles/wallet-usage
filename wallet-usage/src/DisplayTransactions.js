import { useEffect, useState } from 'react'
import open from './open.svg'

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function DisplayTransactions({ selectedMonth }) {
  const [tableRows, setTableRows] = useState()

  const getDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getMonth = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return monthNames[date.getMonth()] + ' ' + date.getFullYear()
  }

  useEffect(() => {
    if (selectedMonth) {
      setTableRows(
        selectedMonth.map((trans) => (
          <tr className="bg-white border-b dark:bg-slate-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="py-4 px-6">{getDate(trans.timestamp)}</td>
            <td className="py-4 px-6">{trans.hash.substring(0, 14)}...</td>
            <td className="py-4 px-6">Laptop</td>
            <td className="py-4 px-6">
              <a>
                <img src={open} style={{ height: '18px' }}></img>
              </a>
            </td>
          </tr>
        )),
      )
    }
  }, [selectedMonth])

  return (
    <div>
      {selectedMonth && (
        <div className="flex justify-center pt-4">
          <div className="block p-6 rounded-lg shadow-lg bg-slate-800 w-full max-w-2xl ">
            <h5 className="text-gray-100 text-xl leading-tight font-medium mb-4">
              {getMonth(selectedMonth[0].timestamp)}
            </h5>

            <div className="overflow-x-auto relative  sm:rounded-sm max-h-72">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Date
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Transaction Hash
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Gass used
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>{tableRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
