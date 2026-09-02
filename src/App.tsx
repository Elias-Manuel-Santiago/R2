import { Route, Routes } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext/TaskProvider'
import Layout from './components/Layout/Layout'
import CreateTaskPage from './pages/CreateTaskPage/CreateTaskPage'
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import TaskDetailPage from './pages/TaskDetailPage/TaskDetailPage'

function App() {
  return (
    // El proveedor deja el estado de tareas disponible en todas las rutas.
    <TaskProvider>
      <Routes>
        {/* Layout contiene los elementos comunes y Outlet renderiza cada página hija. */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tareas/nueva" element={<CreateTaskPage />} />
          <Route path="/tareas/:taskId" element={<TaskDetailPage />} />
          {/* Captura cualquier dirección que no coincida con las rutas anteriores. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </TaskProvider>
  )
}

export default App
