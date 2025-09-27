import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'

interface STEMTool {
  id: string
  name: string
  description: string
  icon: string
  url: string
}

const stemTools: STEMTool[] = [
  {
    id: 'scratch',
    name: 'Scratch Coding',
    description: 'Visual programming for creative coding projects.',
    icon: '/icons/stem-tools/scratch.svg',
    url: 'https://scratch.mit.edu/'
  },
  {
    id: 'tinkercad',
    name: 'TinkerCAD',
    description: '3D design and electronics simulation.',
    icon: '/icons/stem-tools/tinkercad.svg',
    url: 'https://www.tinkercad.com/'
  },
  {
    id: 'geogebra',
    name: 'GeoGebra',
    description: 'Math visualization and graphing tools.',
    icon: '/icons/stem-tools/geogebra.svg',
    url: 'https://www.geogebra.org/'
  },
  {
    id: 'science-journal',
    name: 'Science Journal',
    description: 'Digital experiments and science logging.',
    icon: '/icons/stem-tools/science-journal.svg',
    url: 'https://sciencejournal.withgoogle.com/'
  }
]

export const ToolLauncher: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>STEM Tools Hub</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stemTools.map(tool => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border rounded-lg p-3 hover:shadow-md transition"
          >
            <img src={tool.icon} alt={tool.name} className="w-12 h-12" />
            <div>
              <h3 className="font-semibold">{tool.name}</h3>
              <p className="text-xs text-gray-600">{tool.description}</p>
            </div>
            <Button size="sm" variant="outline">Open</Button>
          </a>
        ))}
      </div>
    </CardContent>
  </Card>
)