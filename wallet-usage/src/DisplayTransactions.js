export default function DisplayTransactions({ selectedMonth }) {
  return (
    <div>
      {selectedMonth && (
        <div className="flex justify-center pt-4">
          <div className="block p-6 rounded-lg shadow-lg bg-slate-800 w-full max-w-2xl ">
            <h5 className="text-gray-100 text-xl leading-tight font-medium mb-3">
              Feb 2022
            </h5>

            <div className="overflow-x-auto relative  sm:rounded-sm">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                <tbody>
                  <tr className="bg-white border-b dark:bg-slate-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Apple MacBook Pro 17"
                    </th>
                    <td className="py-4 px-6">Sliver</td>
                    <td className="py-4 px-6">Laptop</td>
                    <td className="py-4 px-6">$2999</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
