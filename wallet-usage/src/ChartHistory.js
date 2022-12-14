import React, { useEffect, useState } from 'react'
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

const options = {
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

var tempData = {
  labels,
  datasets: [
    {
      label: 'Transactions',
      data: [23, 3, 0, 0, 0, 0, 5, 0, 0, 20, 0, 0],
      backgroundColor: '#A978C4',
    },
  ],
}

export default function ChartHistory({ transactions }) {
  const [data, setData] = useState(tempData)
  var txByMonth = new Map()
  var countByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  const updateGraphData = () => {
    setData({
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: countByMonth,
          backgroundColor: '#A978C4',
        },
      ],
    })
  }

  const createDataset = () => {
    for (var [month, events] of txByMonth) {
      countByMonth[month] = Object.keys(events).length
    }
    console.log(countByMonth)
    updateGraphData()
  }

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

    for (var event of filteredTransactions) {
      var date = new Date(event.timestamp * 1000)
      var month = date.getMonth()
      if (!txByMonth.has(month)) {
        txByMonth.set(month, [])
      }
      txByMonth.get(month).push(event)
    }
    for (var [month, events] of txByMonth) {
      var date = new Date(events[0].timestamp * 1000)
      console.log(`Month: ${month}, Events: ${date}`)
    }
    createDataset()
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
