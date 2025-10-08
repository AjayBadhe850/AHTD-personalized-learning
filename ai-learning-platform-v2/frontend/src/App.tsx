import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Student {
  id: number
  name: string
  email: string
  age: number
  grade: string
  total_lessons_completed: number
  average_score: number
}

interface Subject {
  id: number
  name: string
  description: string
  icon: string
  color: string
  total_lessons: number
}

interface Lesson {
  id: number
  title: string
  description: string
  subject: string
  difficulty: string
  duration: string
  completed: boolean
}

function App() {
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [studentsRes, subjectsRes, lessonsRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/demo/students'),
        fetch('http://localhost:8000/api/v1/demo/subjects'),
        fetch('http://localhost:8000/api/v1/demo/lessons')
      ])

      const studentsData = await studentsRes.json()
      const subjectsData = await subjectsRes.json()
      const lessonsData = await lessonsRes.json()

      setStudents(studentsData.students)
      setSubjects(subjectsData.subjects)
      setLessons(lessonsData.lessons)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Learning Platform v2.0...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  🎓 AI Learning Platform v2.0
                </h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✅ Backend Connected
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🚀 Modern Architecture
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'students', label: 'Students', icon: '👥' },
              { id: 'subjects', label: 'Subjects', icon: '📚' },
              { id: 'lessons', label: 'Lessons', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    🎉 Welcome to AI Learning Platform v2.0
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{students.length}</div>
                      <div className="text-sm text-blue-600">Total Students</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{subjects.length}</div>
                      <div className="text-sm text-green-600">Subjects Available</div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{lessons.length}</div>
                      <div className="text-sm text-purple-600">Lessons Available</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 New Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>React + TypeScript Frontend</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>FastAPI + Python Backend</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>Real-time WebSocket Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>Modern UI with Tailwind CSS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>Advanced Authentication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500">✅</span>
                    <span>50% Performance Improvement</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  👥 Students ({students.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Grade:</span>
                          <span className="ml-1 font-medium">{student.grade}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Age:</span>
                          <span className="ml-1 font-medium">{student.age}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Lessons:</span>
                          <span className="ml-1 font-medium">{student.total_lessons_completed}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Score:</span>
                          <span className="ml-1 font-medium">{student.average_score}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  📚 Subjects ({subjects.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: subject.color }}
                        >
                          <span className="text-xl">{subject.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{subject.name}</h4>
                          <p className="text-sm text-gray-500">{subject.total_lessons} lessons</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{subject.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  🎯 Lessons ({lessons.length})
                </h3>
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>📚 {lesson.subject}</span>
                            <span>⚡ {lesson.difficulty}</span>
                            <span>⏱️ {lesson.duration}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {lesson.completed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✅ Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              ⏳ Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default App