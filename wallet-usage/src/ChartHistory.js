import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
}
const mokData = [
  { count: 10 },
  { count: 20 },
  { count: 15 },
  { count: 25 },
  { count: 22 },
  { count: 30 },
  { count: 10 },
  { count: 10 },
  { count: 20 },
  { count: 15 },
  { count: 25 },
  { count: 25 },
]

const labels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: mokData.map((row) => row.count),
      backgroundColor: '#A978C4',
    },
  ],
}

export default function ChartHistory({ transactions }) {
  var txByMonth = new Map()

  const getChartDate = () => {
    const startDate = new Date('2020-01-22')
    const endDate = new Date('2022-01-27')

    const filteredTransactions = transactions.filter((tx) => {
      var date = new Date(tx.timestamp * 1000)
      if (date >= startDate && date <= endDate) {
        return tx
      }
    })

    console.log(startDate)
    console.log(filteredTransactions)
    console.log(transactions[0].timestamp)

    // Create a new Map to store the events for each month.

    // Loop through the events and add them to the Map.
    for (var event of filteredTransactions) {
      // Get the month for the event.
      var date = new Date(event.timestamp * 1000)
      var month = date.getMonth()
      console.log(date + '----' + month)
      // Check if we have already added an array for this month.
      if (!txByMonth.has(month)) {
        txByMonth.set(month, [])
      }

      // Add the event to the array for this month.
      txByMonth.get(month).push(event)
    }

    // Loop through the Map and print out the events for each month.
    for (var [month, events] of txByMonth) {
      console.log(`Month: ${month}, Events: ${events}`)
    }
  }

  return (
    <div>
      <div className="flex justify-center pt-11">
        <div className="block p-6 rounded-lg shadow-lg bg-slate-800 w-full max-w-2xl ">
          <h5 className="text-gray-100 text-xl leading-tight font-medium mb-2">
            Transaction Frequency
          </h5>
          <p className="text-gray-300 text-base mb-4">
            Click a month to see a breakdown of the transactions
          </p>
          <Bar options={options} data={data} />
          <button onClick={() => getChartDate()}>get chart date</button>
        </div>
      </div>
    </div>
  )
}
