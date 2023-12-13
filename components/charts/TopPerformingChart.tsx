import React from 'react'
import {Chart as ChartJS,ArcElement,Tooltip,Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2'

ChartJS.register(ArcElement,Tooltip,Legend)

interface Room{
    roomName:string,
    bookingsCount:number  
}

interface Props{
   rooms:Room[]
}

const TopPerformingChart = ({rooms}:Props) => {

    console.log(rooms)

    const data = {
        labels: rooms?.map((room)=>room?.roomName),
        datasets: [
            {
                label: '# of Bookings',
                data:  rooms?.map((room)=>room?.bookingsCount),
                borderColor: ['rgba(255,206,86,0.2)'],
                backgroundColor: ['rgba(232,99,132,1)',
                'rgba(232,211,6,1)',
                'rgba(54,162,235,1)',
                'rgba(255,159,64,1)',
                'rgba(153,102,255,1)' ],
                pointBackgroundColor: 'rgba(255,206,86,0.2)',
            }
            
        ]
    }
    
  return (
     <Doughnut data={data}/>
  )
}

export default TopPerformingChart