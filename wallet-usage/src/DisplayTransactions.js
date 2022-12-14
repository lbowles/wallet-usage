export default function DisplayTransactions({ selectedMonth }) {
  return (
    <div>
      <div className="flex justify-center pt-11">
        <div className="block p-6 rounded-lg shadow-lg bg-slate-800 w-full max-w-2xl ">
          <h5 className="text-gray-100 text-xl leading-tight font-medium mb-2">
            Transaction Frequency
          </h5>
          <p className="text-gray-400 text-base mb-4">
            Click a month to see a breakdown of the transactions
          </p>
        </div>
      </div>
    </div>
  )
}
