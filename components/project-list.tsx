import type { Project } from '../lib/portfolio';

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="portfolio-projects">
      {projects.map((project) => (
        <li key={project.url_link || project.title}>
          <h3 className="font-title-theme">
            <a href={project.url_link}>{project.title}</a>
          </h3>
          {project.each_explanation.map((description, index) => (
            <p key={index}>{description}</p>
          ))}
          {project.tags_project.length > 0 && (
            <p className="portfolio-project-tech">
              <span className="portfolio-stack-label">Stack</span>: {project.tags_project.join(' · ')}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
