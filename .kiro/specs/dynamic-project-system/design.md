# Design Document

## Overview

The Dynamic Project System will replace the current hardcoded project display with a flexible JSON-based architecture. The system will maintain backward compatibility with existing project pages while providing a scalable foundation for future project additions.

## Architecture

### High-Level Architecture

```
Portfolio Website
├── Static Assets
│   ├── assets/projects/
│   │   ├── projects-list.json (master project index)
│   │   ├── medicsearch/
│   │   │   ├── medicsearch.json (project data)
│   │   │   └── images/ (project images)
│   │   └── [other-projects]/
│   └── assets/js/
│       └── projects-loader.js (enhanced loader)
├── Project Pages
│   ├── projets/ (existing project detail pages)
│   └── project-detail.html (dynamic project detail template)
└── Main Page
    └── index.html (with dynamic project grid)
```

### Data Flow

1. **Page Load**: Homepage loads and initializes project loader
2. **Data Fetch**: System fetches `projects-list.json` to get project index
3. **Project Loading**: For each project, system fetches individual JSON files
4. **Rendering**: System generates HTML cards and inserts into DOM
5. **Language Support**: System applies current language preferences
6. **Error Handling**: System provides fallbacks for missing data

## Components and Interfaces

### 1. Project Data Schema

#### projects-list.json Structure
```json
{
  "version": "1.0",
  "lastUpdated": "2025-01-15",
  "projects": [
    {
      "id": "medicsearch",
      "enabled": true,
      "priority": 1,
      "path": "medicsearch/medicsearch.json"
    }
  ]
}
```

#### Individual Project JSON Structure
```json
{
  "id": "medicsearch",
  "title": "MedicSearch",
  "titleEn": "MedicSearch",
  "shortDescription": "Application d'agrégation et recherche de médicaments avec IA",
  "shortDescriptionEn": "AI-powered drug aggregation and search application",
  "tags": ["Python", "Flask", "MongoDB", "Mistral AI", "Web Scraping"],
  "images": [
    {
      "src": "https://placehold.co/600x400/EEE/31343C?text=MedicSearch+Dashboard",
      "alt": "MedicSearch Dashboard",
      "altEn": "MedicSearch Dashboard"
    }
  ],
  "metadata": {
    "period": "Janvier 2025 - Mars 2025",
    "periodEn": "January 2025 - March 2025",
    "duration": "3 mois",
    "durationEn": "3 months",
    "location": "IUT Créteil-Vitry, Ile-de-France, France",
    "locationEn": "IUT Créteil-Vitry, Ile-de-France, France"
  },
  "links": {
    "detail": "projets/medicsearch.html",
    "github": null,
    "demo": null
  },
  "content": {
    "sections": [
      {
        "title": "Synthèse Exécutive",
        "titleEn": "Executive Summary",
        "content": "HTML content here...",
        "contentEn": "English HTML content here..."
      }
    ]
  }
}
```

### 2. Enhanced Projects Loader

#### Core Functions
- `loadProjects()`: Main orchestration function
- `fetchProjectsList()`: Loads master project index
- `fetchProjectData(projectInfo)`: Loads individual project data
- `generateProjectCards(projectsData)`: Creates DOM elements
- `handleProjectErrors(error, projectId)`: Error handling
- `updateLanguageDisplay()`: Language switching support

#### Error Handling Strategy
- **Network Errors**: Retry mechanism with exponential backoff
- **Missing Files**: Graceful degradation with placeholder content
- **Invalid JSON**: Skip invalid projects and log errors
- **Image Loading**: Fallback to default project image

### 3. Project Detail System

#### Dynamic Project Detail Page
- Template-based approach using URL parameters
- Fetch project data based on URL parameter `?project=projectId`
- Generate page content dynamically from JSON data
- Support for image carousels and content sections

#### Existing Project Pages
- Maintain existing static project pages for SEO and performance
- Provide fallback links to static pages if dynamic loading fails

## Data Models

### Project Model
```typescript
interface Project {
  id: string;
  title: string;
  titleEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  tags: string[];
  images: ProjectImage[];
  metadata: ProjectMetadata;
  links: ProjectLinks;
  content?: ProjectContent;
}

interface ProjectImage {
  src: string;
  alt: string;
  altEn?: string;
}

interface ProjectMetadata {
  period: string;
  periodEn?: string;
  duration: string;
  durationEn?: string;
  location: string;
  locationEn?: string;
}

interface ProjectLinks {
  detail: string;
  github?: string;
  demo?: string;
}

interface ProjectContent {
  sections: ProjectSection[];
}

interface ProjectSection {
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
}
```

## Error Handling

### Error Categories
1. **Network Errors**: Connection issues, timeouts
2. **Data Errors**: Invalid JSON, missing required fields
3. **Resource Errors**: Missing images, broken links
4. **Runtime Errors**: JavaScript execution errors

### Error Recovery Strategies
1. **Graceful Degradation**: Show available projects even if some fail
2. **Fallback Content**: Use placeholder data for missing information
3. **User Feedback**: Clear error messages for users
4. **Logging**: Console logging for debugging purposes

### Error Display
- Show "Loading..." state during data fetch
- Display "No projects found" if no valid projects exist
- Show individual project errors without breaking the entire page
- Provide retry mechanisms for failed operations

## Testing Strategy

### Unit Testing
- Test individual functions in projects-loader.js
- Test JSON schema validation
- Test error handling scenarios
- Test language switching functionality

### Integration Testing
- Test complete project loading workflow
- Test interaction between project list and detail pages
- Test responsive behavior across devices
- Test performance with multiple projects

### Manual Testing
- Verify visual consistency with existing design
- Test user interactions (clicks, navigation)
- Verify accessibility compliance
- Test on various browsers and devices

## Performance Considerations

### Loading Optimization
- Lazy loading of project images
- Caching of project data in localStorage
- Minimize JSON file sizes
- Optimize image formats and sizes

### Runtime Performance
- Efficient DOM manipulation
- Debounced language switching
- Memory management for large project lists
- Progressive loading for better perceived performance

## Security Considerations

### Data Validation
- Validate JSON structure before processing
- Sanitize HTML content in project descriptions
- Validate image URLs and sources
- Prevent XSS through proper content handling

### Content Security
- Use relative URLs where possible
- Validate external links
- Implement proper CORS handling if needed
- Secure handling of user-generated content