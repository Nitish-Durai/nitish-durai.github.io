// Portfolio Data Configuration
// All content is centralized here for easy customization

export interface NavItem {
  label: string;
  href: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveLink: string;
  githubLink: string;
}

export interface SocialLink {
  platform: string;
  link: string;
  icon: string;
}

export interface FormField {
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

export interface PortfolioData {
  // Personal Info
  name: string;
  title: string;
  subtitle: string;
  email: string;
  
  // Navigation
  navItems: NavItem[];
  
  // Hero Section
  hero: {
    greeting: string;
    name: string;
    role: string;
    description: string;
    resumeLink: string;
    profileImage: string;
  };
  
  // About Section
  about: {
    title: string;
    description: string;
    details: {
      label: string;
      value: string;
    }[];
    stats: {
      value: string;
      label: string;
    }[];
  };
  
  // Skills Section
  skills: {
    title: string;
    description: string;
    categories: SkillCategory[];
  };
  
  // Projects Section
  projects: {
    title: string;
    description: string;
    items: Project[];
  };
  
  // Contact Section
  contact: {
    title: string;
    description: string;
    formFields: FormField[];
    submitButtonText: string;
    socialLinks: SocialLink[];
  };
  
  // Footer
  footer: {
    text: string;
  };
}

export const portfolioData: PortfolioData = {
  // Personal Information
  name: "J Nitish Durai",
  title: "Aspiring Data Engineer specializing in data-driven systems and AI applications",
  subtitle: "Building Scalable Data Solutions",
  email: "nitishdurai.janakiraman2005@gmail.com",
  
  // Navigation Items
  navItems: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ],
  
  // Hero Section Data
  hero: {
    greeting: "Hi, I am",
    name: "J Nitish Durai",
    role: "Aspiring Data Engineer",
    description: "I specialize in data-driven systems and AI applications, with a strong foundation in Python, MySQL, and machine learning pipelines. Passionate about building scalable data solutions and intelligent systems.",
    resumeLink: "/resume.pdf",
    profileImage: "/images/profile.jpg"
  },
  
  // About Section Data
  about: {
    title: "About Me",
    description: "I am an aspiring Data Engineer with a strong foundation in Python, MySQL, and machine learning pipelines. I have hands-on experience in building scalable data solutions and intelligent systems. I demonstrate analytical thinking, leadership, and rapid prototyping skills.",
    details: [
      { label: "Name", value: "J Nitish Durai" },
      { label: "Email", value: "nitishdurai.janakiraman2005@gmail.com" },
      { label: "Location", value: "Bangalore, India" },
      { label: "Phone", value: "+91 6363459591" }
    ],
    stats: [
      { value: "8.01", label: "CGPA (B.Tech)" },
      { value: "4+", label: "Projects Completed" },
      { value: "1", label: "Internships" },
      { value: "3+", label: "Certifications" }
    ]
  },
  
  // Skills Section Data
  skills: {
    title: "Skills",
    description: "Technologies and tools I use to build scalable solutions",
    categories: [
      {
        category: "Languages & Databases",
        skills: [
          { name: "Python", level: 90 },
          { name: "MySQL", level: 85 },
          { name: "Java", level: 75 }
        ]
      },
      {
        category: "Data & Machine Learning",
        skills: [
          { name: "Pandas", level: 85 },
          { name: "NumPy", level: 85 },
          { name: "scikit-learn", level: 80 },
          { name: "Matplotlib", level: 80 }
        ]
      },
      {
        category: "Tools & Platforms",
        skills: [
          { name: "Git & GitHub", level: 85 },
          { name: "VS Code", level: 90 },
          { name: "AWS", level: 60 }
        ]
      }
    ]
  },
  
  // Projects Section Data
  projects: {
    title: "Experience & Projects",
    description: "A selection of my recent work and internship experience",
    items: [
      {
        id: "1",
        title: "Data Science Intern",
        description: "SkillCraft Technology: Built demographic visualizations, implemented K-Means clustering, developed an SVM-based image classification model, and designed a real-time hand gesture recognition system.",
        image: "/images/project1.jpg",
        technologies: ["Pandas", "Matplotlib", "OpenCV", "Deep Learning"],
        liveLink: "#",
        githubLink: "#"
      },
      {
        id: "2",
        title: "PhoneSense",
        description: "A smartphone recommendation system that translates complex specifications into personalized recommendations with intelligent filtering logic.",
        image: "/images/project2.jpg",
        technologies: ["Web App", "Filter Logic", "Data Analysis"],
        liveLink: "#",
        githubLink: "#"
      },
      {
        id: "3",
        title: "Personal Portfolio",
        description: "A fully responsive portfolio website showcasing projects and certifications.",
        image: "/images/project4.jpg",
        technologies: ["HTML", "CSS", "JavaScript"],
        liveLink: "#",
        githubLink: "https://github.com/Nitish-Durai"
      }
    ]
  },
  
  // Contact Section Data
  contact: {
    title: "Contact Me",
    description: "Have a project in mind? Let's work together to create something amazing.",
    formFields: [
      {
        label: "Name",
        type: "text",
        placeholder: "Enter your name",
        required: true
      },
      {
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        required: true
      },
      {
        label: "Message",
        type: "textarea",
        placeholder: "Enter your message",
        required: true
      }
    ],
    submitButtonText: "Send Message",
    socialLinks: [
      {
        platform: "LinkedIn",
        link: "https://linkedin.com/in/jnitishdurai425",
        icon: "linkedin"
      },
      {
        platform: "GitHub",
        link: "https://github.com/Nitish-Durai",
        icon: "github"
      },
      {
        platform: "Email",
        link: "mailto:nitishdurai.janakiraman2005@gmail.com",
        icon: "email"
      }
    ]
  },
  
  // Footer Data
  footer: {
    text: "© 2026 J Nitish Durai | All Rights Reserved"
  }
};

export default portfolioData;
