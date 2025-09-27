import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

interface TimetableEntry {
  day: string
  time: string
  subject: string
  teacher: string
}

const sampleTimetable: TimetableEntry[] = [
  { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Priya Verma' },
  { day: 'Tuesday', time: '10:30 AM - 11:30 AM', subject: 'Science', teacher: 'Dr. Rajesh Kumar' },
  { day: 'Wednesday', time: '1:00 PM - 2:00 PM', subject: 'English', teacher: 'Anita Singh' }
]

export const DigitalTimetable: React.FC<{ timetable?: TimetableEntry[] }> = ({ timetable = sampleTimetable }) => (
  <Card>
    <CardHeader>
      <CardTitle>Digital Timetable</CardTitle>
    </CardHeader>
    <CardContent>
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Day</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Subject</th>
            <th className="border border-gray-300 p-2">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map(({ day, time, subject, teacher }, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-2">{day}</td>
              <td className="border border-gray-300 p-2">{time}</td>
              <td className="border border-gray-300 p-2">{subject}</td>
              <td className="border border-gray-300 p-2">{teacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
)