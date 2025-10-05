"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const stemTools = [
  {
    name: "Scratch",
    description: "Learn coding through visual programming for math lessons",
    url: "https://scratch.mit.edu/",
    icon: "/icons/scratch.svg",
    category: "Coding",
    gradeLevels: ["6-12"],
    subjects: ["Mathematics", "Computer Science"],
  },
  {
    name: "GeoGebra",
    description: "Interactive mathematics software for geometry and algebra",
    url: "https://www.geogebra.org/",
    icon: "/icons/geogebra.svg",
    category: "Mathematics",
    gradeLevels: ["8-12"],
    subjects: ["Mathematics", "Physics"],
  },
  {
    name: "TinkerCAD",
    description: "3D design and electronics simulation",
    url: "https://www.tinkercad.com/",
    icon: "/icons/tinkercad.svg",
    category: "Electronics",
    gradeLevels: ["6-12"],
    subjects: ["Engineering", "Physics"],
  },
  {
    name: "Google Science Journal",
    description: "Mobile app for collecting sensor data and conducting experiments",
    url: "https://sciencejournal.withgoogle.com/",
    icon: "/icons/google-science.svg",
    category: "Data Collection",
    gradeLevels: ["9-12"],
    subjects: ["Science", "Physics"],
  },
  {
    name: "PhET Simulations",
    description: "Interactive simulations for science and math concepts",
    url: "https://phet.colorado.edu/",
    icon: "/icons/phet.svg",
    category: "Simulations",
    gradeLevels: ["6-12"],
    subjects: ["Physics", "Chemistry", "Mathematics"],
  }
];

const categories = ["All", "Coding", "Mathematics", "Electronics", "Data Collection", "Simulations"];
const gradeLevelOptions = ["All", "6-7", "8-9", "10-12"];

const StemToolCard: React.FC<{ tool: any }> = ({ tool }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex items-center gap-4">
        <img src={tool.icon} alt={`${tool.name} icon`} className="h-10 w-10" />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
          <Badge variant="outline" className="text-xs">
            {tool.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
        <p className="text-xs text-gray-500 mb-2">
          Grade Levels: {tool.gradeLevels.join(", ")}
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Subjects: {tool.subjects.join(", ")}
        </p>
      <a
  href={tool.url}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex w-full justify-center items-center gap-2 border px-4 py-2 rounded text-sm font-medium bg-white hover:bg-gray-50 border-gray-300 text-gray-900 transition"
>
  Open Tool
  <ExternalLink className="h-4 w-4" />
</a>

      </CardContent>
    </Card>
  );
};

const StemToolsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("All");

  const filteredTools = useMemo(() => {
    return stemTools.filter(tool => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.subjects.some((subj: string) => subj.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      
      const matchesGrade = selectedGradeLevel === "All" || tool.gradeLevels.some((level: string) => {
        if (selectedGradeLevel === "6-7") return level.startsWith("6") || level.startsWith("7");
        if (selectedGradeLevel === "8-9") return level.startsWith("8") || level.startsWith("9");
        if (selectedGradeLevel === "10-12") return level.startsWith("10") || level.startsWith("11") || level.startsWith("12");
        return false;
      });

      return matchesSearch && matchesCategory && matchesGrade;
    });
  }, [searchTerm, selectedCategory, selectedGradeLevel]);

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">STEM Tools Hub</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tools by name, category, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by Grade Level" />
          </SelectTrigger>
          <SelectContent>
            {gradeLevelOptions.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, idx) => (
            <StemToolCard key={idx} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tools match your search and filters.</p>
      )}
    </section>
  );
};

export default StemToolsSection;
