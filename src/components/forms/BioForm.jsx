import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  Avatar,
} from '@mui/material'
import {
  Save as SaveIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Description as ResumeIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { supabase } from '../../config/supabase'

const BioForm = () => {
  const [bio, setBio] = useState({
    name: '',
    roles: [],
    description: '',
    github: '',
    resume: '',
    linkedin: '',
    twitter: '',
    insta: '',
    image: '',
  })

  useEffect(() => {
    fetchBio()
  }, [])

  const fetchBio = async () => {
    try {
      const { data, error } = await supabase
        .from('bio')
        .select('*')
        .single()

      if (error) throw error
      console.log('Fetched bio:', data)
      setBio(data || {})
    } catch (error) {
      console.error('Error fetching bio:', error)
      toast.error('Error fetching bio: ' + error.message)
    }
  }

  const handleSubmit = async () => {
    try {
      if (!bio.name || !bio.description) {
        toast.error('Please fill in all required fields')
        return
      }

      const { error } = await supabase
        .from('bio')
        .upsert(bio)

      if (error) throw error

      await fetchBio()
      toast.success('Bio updated successfully')
    } catch (error) {
      console.error('Error saving bio:', error)
      toast.error('Error saving bio: ' + error.message)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Box sx={{ 
          backgroundColor: '#F8FAFC',
          p: 4,
          borderBottom: '1px solid',
          borderColor: 'grey.200',
        }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}>
            Bio
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B' }}>
            Manage your personal information and social links
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Profile image */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={bio.image}
                  alt={bio.name}
                  sx={{
                    width: 150,
                    height: 150,
                    border: '4px solid white',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>
            </Grid>

            {/* Profile image URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile image URL"
                value={bio.image || ''}
                onChange={(e) => setBio({ ...bio, image: e.target.value })}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name"
                value={bio.name || ''}
                onChange={(e) => setBio({ ...bio, name: e.target.value })}
              />
            </Grid>

            {/* Roles */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Roles (comma-separated)"
                value={Array.isArray(bio.roles) ? bio.roles.join(', ') : ''}
                onChange={(e) => setBio({ 
                  ...bio, 
                  roles: e.target.value.split(',').map(role => role.trim()).filter(Boolean)
                })}
                helperText="Enter roles separated by commas"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                value={bio.description || ''}
                onChange={(e) => setBio({ ...bio, description: e.target.value })}
              />
            </Grid>

            {/* Social Links */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={bio.github || ''}
                onChange={(e) => setBio({ ...bio, github: e.target.value })}
                InputProps={{
                  startAdornment: <GitHubIcon sx={{ mr: 1, color: '#64748B' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={bio.linkedin || ''}
                onChange={(e) => setBio({ ...bio, linkedin: e.target.value })}
                InputProps={{
                  startAdornment: <LinkedInIcon sx={{ mr: 1, color: '#64748B' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Twitter URL"
                value={bio.twitter || ''}
                onChange={(e) => setBio({ ...bio, twitter: e.target.value })}
                InputProps={{
                  startAdornment: <TwitterIcon sx={{ mr: 1, color: '#64748B' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram URL"
                value={bio.insta || ''}
                onChange={(e) => setBio({ ...bio, insta: e.target.value })}
                InputProps={{
                  startAdornment: <InstagramIcon sx={{ mr: 1, color: '#64748B' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume URL"
                value={bio.resume || ''}
                onChange={(e) => setBio({ ...bio, resume: e.target.value })}
                InputProps={{
                  startAdornment: <ResumeIcon sx={{ mr: 1, color: '#64748B' }} />,
                }}
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: '#0F172A',
                    '&:hover': { backgroundColor: '#1E293B' },
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Social Links Preview */}
      <Paper sx={{ mt: 3, p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ color: '#1E293B', mb: 2 }}>
          Social Links Preview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {bio.github && (
            <IconButton 
              href={bio.github}
              target="_blank"
              sx={{ 
                color: '#1E293B',
                '&:hover': { backgroundColor: '#F1F5F9' }
              }}
            >
              <GitHubIcon />
            </IconButton>
          )}
          {bio.linkedin && (
            <IconButton 
              href={bio.linkedin}
              target="_blank"
              sx={{ 
                color: '#0077B5',
                '&:hover': { backgroundColor: '#F1F5F9' }
              }}
            >
              <LinkedInIcon />
            </IconButton>
          )}
          {bio.twitter && (
            <IconButton 
              href={bio.twitter}
              target="_blank"
              sx={{ 
                color: '#1DA1F2',
                '&:hover': { backgroundColor: '#F1F5F9' }
              }}
            >
              <TwitterIcon />
            </IconButton>
          )}
          {bio.insta && (
            <IconButton 
              href={bio.insta}
              target="_blank"
              sx={{ 
                color: '#E4405F',
                '&:hover': { backgroundColor: '#F1F5F9' }
              }}
            >
              <InstagramIcon />
            </IconButton>
          )}
          {bio.resume && (
            <IconButton 
              href={bio.resume}
              target="_blank"
              sx={{ 
                color: '#1E293B',
                '&:hover': { backgroundColor: '#F1F5F9' }
              }}
            >
              <ResumeIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default BioForm 