import React from 'react'

const roles = [
  { value: 'student', label: 'Student', icon: '/icons/student.svg' },
  { value: 'teacher', label: 'Teacher', icon: '/icons/teacher.svg' },
  { value: 'hei-mentor', label: 'HEI Mentor', icon: '/icons/hei-mentor.svg' },
  { value: 'hei-admin', label: 'HEI Admin', icon: '/icons/hei-admin.svg' },
  { value: 'school-admin', label: 'School Admin', icon: '/icons/school-admin.svg' }
]

export const RoleSelector: React.FC<{ value?: string; onChange?: (v: string) => void }> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
    {roles.map(role => (
      <button
        key={role.value}
        type="button"
        className={`flex flex-col items-center p-4 border rounded transition
          ${value === role.value ? 'border-blue-700 shadow' : 'border-gray-200 hover:border-blue-300'}`}
        onClick={() => onChange?.(role.value)}
      >
        <img src={role.icon} alt={role.label} className="h-10 w-10 mb-2" />
        <span className="font-semibold">{role.label}</span>
      </button>
    ))}
  </div>
)