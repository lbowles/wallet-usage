import React, { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, getElementAtEvent, getDatasetAtEvent } from 'react-chartjs-2'
import Select from 'react-select'
import { toast } from 'react-toastify'

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

let txByMonth = new Map()

export default function ChartHistory({ transactions, handleMonthUpdate }) {
  const [data, setData] = useState(tempData)
  const startYear = new Date().getFullYear()
  const initialStartDate = new Date(startYear.toString() + '-01-01')
  const initialEndDate = new Date(startYear.toString() + '-12-31')
  let startDate = initialStartDate
  let endDate = initialEndDate
  const chartRef = useRef()
  const years = []

  for (let year = 2010; year <= startYear; year++) {
    years.push({ value: year, label: year })
  }

  var countByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  const updateGraphData = () => {
    setData({
      labels,
      datasets: [
        {
          label: 'Transactions',
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
    updateGraphData()
  }

  const getChartDate = () => {
    txByMonth.clear()
    const filteredTransactions = transactions.filter((tx) => {
      var date = new Date(tx.timeStamp * 1000)
      if (date >= startDate && date <= endDate) {
        return tx
      }
    })
    for (var event of filteredTransactions) {
      var date = new Date(event.timeStamp * 1000)
      var month = date.getMonth()
      if (!txByMonth.has(month)) {
        txByMonth.set(month, [])
      }
      txByMonth.get(month).push(event)
    }
    for (var [month, events] of txByMonth) {
      var date = new Date(events[0].timeStamp * 1000)
    }
    if (txByMonth.size == 0) {
      toast('No transactions found for this year', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })
    }
    createDataset()
  }

  const onClick = (event) => {
    getElementAtBar(getElementAtEvent(chartRef.current, event))
  }

  const getElementAtBar = (element) => {
    if (!element.length) return
    const { datasetIndex, index } = element[0]
    handleMonthUpdate(txByMonth.get(getMonthFromString(data.labels[index])))
  }

  const getMonthFromString = (mon) => {
    return new Date(Date.parse(mon + ' 1, 2012')).getMonth()
  }

  const yearSelectedTrigger = (selectedYear) => {
    const firstDate = new Date(selectedYear + '-01-01')
    const lastDate = new Date(selectedYear + '-12-31')
    startDate = firstDate
    endDate = lastDate
    getChartDate()
    handleMonthUpdate(null)
  }

  useEffect(() => {
    if (transactions) {
      getChartDate()
    }
  }, [transactions])

  return (
    <div>
      <div className="flex justify-center pt-11">
        <div className="block p-6 rounded-lg shadow-lg bg-slate-800 w-full max-w-2xl ">
          <div className=" flex justify-between ">
            <h5 className="text-gray-100 text-xl leading-tight font-medium mb-2 ">
              Transaction Frequency
            </h5>
            <Select
              options={years}
              onChange={(option) => yearSelectedTrigger(option.value)}
              className="my-react-select-container"
              classNamePrefix="my-react-select"
              placeholder={startYear}
            />
          </div>
          <p className="text-gray-400 text-base mb-4">
            Click a month to see a breakdown of the transactions
          </p>
          <Bar options={options} data={data} ref={chartRef} onClick={onClick} />
        </div>
      </div>
    </div>
  )
}
