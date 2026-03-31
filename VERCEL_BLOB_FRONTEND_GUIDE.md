# 🎨 Frontend Implementation - Vercel Blob Images

## 📝 Overview

Backend sudah menggunakan Vercel Blob Storage untuk menyimpan gambar. Frontend tinggal consume API dan display images.

## 🔗 API Endpoints (Backend)

Base URL: `https://admin-portfolio-fiky.vercel.app/api`

### Public Endpoints (No Auth Required)

```
GET  /profile        - Get profile data (with image_url)
GET  /skills         - Get all skills (with image_url)
GET  /projects       - Get all projects (with image_url)
```

### Response Format

**Profile:**
```json
{
  "status": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "image_filename": "https://xxx.public.blob.vercel-storage.com/profiles/profile_123.jpg",
    "image_url": "https://xxx.public.blob.vercel-storage.com/profiles/profile_123.jpg",
    "created_at": "2025-12-23T10:00:00.000000Z",
    "updated_at": "2025-12-23T10:00:00.000000Z"
  }
}
```

**Skills:**
```json
{
  "status": true,
  "message": "Skills retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "React JS",
      "name_en": "React JS",
      "keterangan": "Framework JavaScript",
      "keterangan_en": "JavaScript Framework",
      "image_filename": "https://xxx.public.blob.vercel-storage.com/skills/skill_123.png",
      "image_url": "https://xxx.public.blob.vercel-storage.com/skills/skill_123.png"
    }
  ]
}
```

**Projects:**
```json
{
  "status": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Portfolio Website",
      "title_en": "Portfolio Website",
      "descripstion": "Website portfolio pribadi",
      "descripstion_en": "Personal portfolio website",
      "image_filename": "https://xxx.public.blob.vercel-storage.com/projects/project_123.jpg",
      "image_url": "https://xxx.public.blob.vercel-storage.com/projects/project_123.jpg",
      "referance_url": "https://example.com",
      "github_url": "https://github.com/user/repo",
      "tools": ["React", "Tailwind", "Vite"]
    }
  ]
}
```

## 🎯 Implementation

### 1. Update API Service

File: `src/services/apiService.js`

```javascript
import { prefetchApi } from '../hooks/useApi';

const baseUrl = import.meta.env.VITE_BASE_URL;

export const API_ENDPOINTS = {
  PROFILE: '/profile',
  SKILLS: '/skills',
  SKILL_DETAIL: (id) => `/skills/${id}`,
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id) => `/projects/${id}`,
};

// Prefetch all data for homepage
export const prefetchHomeData = async () => {
  await Promise.all([
    prefetchApi(API_ENDPOINTS.PROFILE),
    prefetchApi(API_ENDPOINTS.SKILLS),
    prefetchApi(API_ENDPOINTS.PROJECTS),
  ]);
};
```

### 2. Fetch Profile Data

File: `src/services/profileService.js` (create new)

```javascript
import api from '../api/Api';

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data.data; // Returns profile object with image_url
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};
```

### 3. Fetch Skills Data

File: `src/services/skillServices.js`

```javascript
import api from '../api/Api';

export const getSkills = async () => {
  try {
    const response = await api.get('/skills');
    return response.data.data; // Returns array of skills with image_url
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw error;
  }
};

export const getSkillById = async (id) => {
  try {
    const response = await api.get(`/skills/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch skill:', error);
    throw error;
  }
};
```

### 4. Fetch Projects Data

File: `src/services/projectServices.js`

```javascript
import api from '../api/Api';

export const getProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data.data; // Returns array of projects with image_url
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    throw error;
  }
};
```

## 🖼️ Display Images

### Hero Section (Profile)

```javascript
import { useState, useEffect } from 'react';
import { getProfile } from '../services/profileService';

function HeroSection() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <section className="hero">
      <img 
        src={profile.image_url} 
        alt={profile.name}
        className="w-32 h-32 rounded-full object-cover"
      />
      <h1>{profile.name}</h1>
    </section>
  );
}
```

### Skills Section

```javascript
import { useState, useEffect } from 'react';
import { getSkills } from '../services/skillServices';

function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section className="skills">
      <h2>Skills</h2>
      <div className="grid grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-card">
            <img 
              src={skill.image_url} 
              alt={skill.name}
              className="w-16 h-16 object-contain"
            />
            <h3>{skill.name}</h3>
            <p>{skill.keterangan}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Projects Section

```javascript
import { useState, useEffect } from 'react';
import { getProjects } from '../services/projectServices';

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section className="projects">
      <h2>Projects</h2>
      <div className="grid grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3>{project.title}</h3>
            <p>{project.descripstion}</p>
            <div className="flex gap-2">
              {project.referance_url && (
                <a href={project.referance_url} target="_blank" rel="noopener noreferrer">
                  Demo
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
            <div className="tools">
              {project.tools?.map((tool, index) => (
                <span key={index} className="badge">{tool}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

## 🎨 Image Optimization

### Lazy Loading

```javascript
<img 
  src={image_url} 
  alt={name}
  loading="lazy"
  className="w-full h-auto"
/>
```

### Fallback Image

```javascript
const [imgSrc, setImgSrc] = useState(image_url);

<img 
  src={imgSrc} 
  alt={name}
  onError={() => setImgSrc('/placeholder.png')}
  className="w-full h-auto"
/>
```

### Responsive Images

```javascript
<picture>
  <source 
    media="(min-width: 768px)" 
    srcSet={image_url}
  />
  <img 
    src={image_url} 
    alt={name}
    className="w-full h-auto"
  />
</picture>
```

## 🔄 Using React Query (Optional)

Install:
```bash
npm install @tanstack/react-query
```

Setup:
```javascript
// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

Usage:
```javascript
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../services/projectServices';

function ProjectsSection() {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {projects?.map((project) => (
        <div key={project.id}>
          <img src={project.image_url} alt={project.title} />
          <h3>{project.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

## 🌐 i18n Support

Jika menggunakan i18n (sudah ada di project):

```javascript
import { useTranslation } from 'react-i18next';

function SkillCard({ skill }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const name = currentLang === 'en' ? skill.name_en || skill.name : skill.name;
  const description = currentLang === 'en' 
    ? skill.keterangan_en || skill.keterangan 
    : skill.keterangan;

  return (
    <div className="skill-card">
      <img src={skill.image_url} alt={name} />
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}
```

## 📱 Responsive Design

```css
/* Tailwind CSS */
<img 
  src={image_url}
  className="
    w-full 
    h-auto 
    object-cover 
    rounded-lg
    sm:w-64 
    md:w-80 
    lg:w-96
  "
/>
```

## ✅ Checklist Implementation

- [ ] Update `src/services/profileService.js`
- [ ] Update `src/services/skillServices.js`
- [ ] Update `src/services/projectServices.js`
- [ ] Update Hero Section component
- [ ] Update Skills Section component
- [ ] Update Projects Section component
- [ ] Add lazy loading
- [ ] Add fallback images
- [ ] Test with real data from backend
- [ ] Deploy frontend

## 🚀 Deploy Frontend

```bash
cd frontend
npm install
npm run build
vercel --prod
```

## 📝 Notes

- ✅ `image_url` sudah include full Vercel Blob URL
- ✅ No need untuk transform atau resize (sudah di backend)
- ✅ Images served dari Vercel CDN (fast!)
- ✅ Support lazy loading dan caching
- ✅ Backward compatible dengan local storage URLs

## 🐛 Troubleshooting

### Images not loading

**Check:**
1. API response contains `image_url`
2. URL format: `https://xxx.public.blob.vercel-storage.com/...`
3. CORS enabled (Vercel Blob auto-enables)
4. Network tab in DevTools

### Slow loading

**Solutions:**
- Add lazy loading
- Use React Query for caching
- Optimize image size di backend
- Use CDN (Vercel Blob already uses CDN)

## 📚 Resources

- [React Image Best Practices](https://react.dev/learn/rendering-lists)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [React Query Documentation](https://tanstack.com/query/latest)
