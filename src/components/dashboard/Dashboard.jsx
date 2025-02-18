import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import Sidebar from './Sidebar'
import BioForm from '../forms/BioForm'
import SkillForm from '../forms/SkillForm'
import ExperienceForm from '../forms/ExperienceForm'
import ProjectForm from '../forms/ProjectForm'
import EducationForm from '../forms/EducationForm'

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
          <Route path="/" element={<BioForm />} />
          <Route path="/skills" element={<SkillForm />} />
          <Route path="/experience" element={<ExperienceForm />} />
          <Route path="/projects" element={<ProjectForm />} />
          <Route path="/education" element={<EducationForm />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default Dashboard 