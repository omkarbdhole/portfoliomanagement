import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  GitHub as GitHubIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { supabase } from '../../config/supabase'

const ProjectForm = () => {
  const [projects, setProjects] = useState([])
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentProject, setCurrentProject] = useState({
    title: '',
    description: '',
    description2: '',
    description3: '',
    image: '',
    tags: [],
    category: '',
    github: '',
    dashboard: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')

      if (error) throw error
      console.log('Fetched projects data:', data)
      setProjects(data || [])
    } catch (error) {
      console.error('Error details:', error)
      toast.error('Error fetching projects: ' + error.message)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!currentProject.title || !currentProject.description) {
        toast.error('Please fill in all required fields')
        return
      }

      const { error } = await supabase
        .from('projects')
        .upsert({
          ...currentProject,
          id: editMode ? currentProject.id : undefined
        })

      if (error) throw error

      await fetchProjects()
      handleClose()
      toast.success(editMode ? 'Project updated successfully' : 'Project added successfully')
    } catch (error) {
      console.error('Error details:', error)
      toast.error('Error saving project: ' + error.message)
    }
  }

  const handleEdit = (project) => {
    setCurrentProject(project)
    setEditMode(true)
    setOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchProjects()
      toast.success('Project deleted successfully')
    } catch (error) {
      toast.error('Error deleting project: ' + error.message)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setEditMode(false)
    setCurrentProject({
      title: '',
      description: '',
      description2: '',
      description3: '',
      image: '',
      tags: [],
      category: '',
      github: '',
      dashboard: '',
    })
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          p: 4,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>
              Projects
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Manage your projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditMode(false)
              setOpen(true)
            }}
            sx={{
              backgroundColor: '#0F172A',
              '&:hover': { backgroundColor: '#1E293B' },
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Add Project
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} key={project.id}>
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: '1px solid',
                  borderColor: 'grey.200',
                }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '200px',
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: '#F8FAFC',
                          border: '1px solid',
                          borderColor: 'grey.200',
                        }}
                      >
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <CodeIcon sx={{ fontSize: 40, color: '#94A3B8' }} />
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" sx={{ color: '#1E293B', mb: 1 }}>
                            {project.title}
                          </Typography>
                          <Chip 
                            label={project.category} 
                            size="small"
                            sx={{ 
                              backgroundColor: '#F1F5F9',
                              color: '#475569',
                              mb: 2,
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {project.github && (
                            <IconButton 
                              href={project.github}
                              target="_blank"
                              sx={{ color: '#1E293B' }}
                            >
                              <GitHubIcon />
                            </IconButton>
                          )}
                          {project.dashboard && (
                            <IconButton 
                              href={project.dashboard}
                              target="_blank"
                              sx={{ color: '#1E293B' }}
                            >
                              <DashboardIcon />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => handleEdit(project)}
                            sx={{ color: '#1E293B' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(project.id)}
                            sx={{ color: '#EF4444' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                        {project.description}
                      </Typography>
                      {project.description2 && (
                        <Typography variant="body2" sx={{ color: '#64748B', mb: 1 }}>
                          {project.description2}
                        </Typography>
                      )}
                      {project.description3 && (
                        <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                          {project.description3}
                        </Typography>
                      )}

                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {project.tags.map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag} 
                            size="small"
                            sx={{ 
                              backgroundColor: '#F1F5F9',
                              color: '#475569',
                            }}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#1E293B', fontWeight: 600 }}>
              {editMode ? 'Edit Project' : 'Add Project'}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Project Title"
                value={currentProject.title || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Image URL"
                value={currentProject.image || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
              />
              {currentProject.image && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <img
                    src={currentProject.image}
                    alt="Project Preview"
                    style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Category"
                value={currentProject.category || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                required
                label="Description"
                value={currentProject.description || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 2"
                value={currentProject.description2 || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, description2: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description 3"
                value={currentProject.description3 || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, description3: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={Array.isArray(currentProject.tags) ? currentProject.tags.join(', ') : ''}
                onChange={(e) => setCurrentProject({ 
                  ...currentProject, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                helperText="Enter tags separated by commas"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={currentProject.github || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, github: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dashboard URL"
                value={currentProject.dashboard || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, dashboard: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: '#64748B',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: '#0F172A',
              '&:hover': { backgroundColor: '#1E293B' },
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            {editMode ? 'Save Changes' : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProjectForm 