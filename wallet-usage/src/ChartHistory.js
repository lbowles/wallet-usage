import { Chart } from 'chart.js/auto'
;(async function () {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ]

  new Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
      labels: data.map((row) => row.year),
      datasets: [
        {
          label: 'Acquisitions by year',
          data: data.map((row) => row.count),
        },
      ],
    },
  })
})()

export default function ChartHistory(transactions) {
  return (
    <div>
      <div className="flex justify-center pt-11">
        <div className="block p-6 rounded-lg shadow-lg bg-slate-800 ">
          <h5 className="text-gray-100 text-xl leading-tight font-medium mb-2">
            Transaction Frequency
          </h5>
          <p className="text-gray-300 text-base mb-4">
            Click a month to see a breakdown of the transactions
          </p>
          <div style={{ width: '700px' }}>
            <canvas id="myChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  )
}
