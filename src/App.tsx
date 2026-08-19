import { Route, Routes } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext/TaskProvider'
import Layout from './components/Layout/Layout'
import CreateTaskPage from './pages/CreateTaskPage/CreateTaskPage'
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import TaskDetailPage from './pages/TaskDetailPage/TaskDetailPage'

function App() {
  return (
    <TaskProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tareas/nueva" element={<CreateTaskPage />} />
          <Route path="/tareas/:taskId" element={<TaskDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </TaskProvider>
  )
}

export default App
