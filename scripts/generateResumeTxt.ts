import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the Resume.tsx file
const resumeTsxPath = join(__dirname, '../src/pages/Resume.tsx');
const resumeTsxContent = readFileSync(resumeTsxPath, 'utf-8');

// Extract Professional Summary
function extractProfessionalSummary(content: string): string {
    const summaryRegex = /const ProfessionalSummary[\s\S]*?<Typography[^>]*>\s*([\s\S]*?)\s*<\/Typography>/;
    const match = content.match(summaryRegex);
    if (!match) return '';

    return match[1]
        .replace(/\s+/g, ' ')
        .trim();
}

// Extract Education info
function extractEducation(content: string): {
    school: string;
    dates: string;
    degree: string;
    minors: string;
    gpa: string;
    coursework: string[];
} {
    const schoolRegex = /<Typography color="text\.primary">([^<]+)<\/Typography>/;
    const schoolMatch = content.match(schoolRegex);

    // Extract details from the education section
    const datesRegex = /\{"(Sept \d{4} - \w+ \d{4})"\}/;
    const degreeRegex = /\{"(Computer Science B\.S\.[^"]+)"\}/;
    const minorsRegex = /\{"(Minors in[^"]+)"\}/;
    const gpaRegex = /\{"(GPA: [\d.]+\/[\d.]+)"\}/;

    const school = schoolMatch ? schoolMatch[1] : 'Case Western Reserve University';
    const dates = (content.match(datesRegex) || [])[1] || 'September 2020 - May 2025';
    const degree = (content.match(degreeRegex) || [])[1] || "Computer Science B.S. '24, M.S. '25";
    const minors = (content.match(minorsRegex) || [])[1] || 'Minors in Music & Mathematics';
    const gpa = (content.match(gpaRegex) || [])[1] || 'GPA: 3.8/4.0';

    // Extract all coursework from the coursework arrays
    const courseworkRegex = /const coursework: string\[\]\[\] = \[([\s\S]*?)\];/;
    const courseworkMatch = content.match(courseworkRegex);
    const coursework: string[] = [];

    if (courseworkMatch) {
        const allCoursework = courseworkMatch[1];
        const courseMatches = allCoursework.match(/"([^"]+)"/g);
        if (courseMatches) {
            const uniqueCourses = new Set(courseMatches.map(c => c.slice(1, -1)));
            coursework.push(...Array.from(uniqueCourses).sort());
        }
    }

    return { school, dates, degree, minors, gpa, coursework };
}

// Extract Job information
function extractJobs(content: string): Array<{
    company: string;
    title: string;
    dates: string;
    description: string[];
}> {
    const jobRegex = /Job\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*\[([\s\S]*?)\]\s*\)/g;
    const jobs: Array<{
        company: string;
        title: string;
        dates: string;
        description: string[];
    }> = [];

    let match;
    while ((match = jobRegex.exec(content)) !== null) {
        const [, company, title, dates, descContent] = match;

        // Extract strings, handling both single and double quotes
        // Match either single or double quoted strings in order
        const description: string[] = [];
        const combinedRegex = /(['"])((?:(?!\1)[^\\]|\\.)*)\1/g;
        let strMatch;

        while ((strMatch = combinedRegex.exec(descContent)) !== null) {
            const cleanedDesc = strMatch[2]
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .trim();
            if (cleanedDesc && cleanedDesc.length > 20) { // Only include substantial strings (bullet points)
                description.push(cleanedDesc);
            }
        }

        jobs.push({ company, title, dates, description });
    }

    return jobs;
}

// Extract Skills by category
function extractSkills(content: string): Record<string, string[]> {
    const skillsSection = content.match(/const Skills[\s\S]*?<\/ListItem>/);
    if (!skillsSection) return {};

    const sectionContent = skillsSection[0];
    const skills: Record<string, string[]> = {};

    // Find all skill categories
    const categoryRegex = /<Typography color="text\.primary">([^<]+)<\/Typography>\s*<Typography[^>]*>\s*\{\[([^\]]+)\]\.join\(/g;

    let match;
    while ((match = categoryRegex.exec(sectionContent)) !== null) {
        const category = match[1];
        const skillsArray = match[2];
        const skillMatches = skillsArray.match(/'([^']+)'|"([^"]+)"/g);
        if (skillMatches) {
            skills[category] = skillMatches.map(s => s.slice(1, -1));
        }
    }

    return skills;
}

// Extract Projects
function extractProjects(content: string): Array<{
    name: string;
    description: string;
    technologies: string[];
}> {
    const projects: Array<{
        name: string;
        description: string;
        technologies: string[];
    }> = [];

    // Match Project() calls with string concatenations
    const projectRegex = /Project\(\s*"([^"]+)",\s*((?:"[^"]*"|\s*\+\s*)+),\s*\[([\s\S]*?)\]\s*\)/g;

    let match;
    while ((match = projectRegex.exec(content)) !== null) {
        const [, name, descPart, techContent] = match;

        // Extract all quoted strings from description and concatenate them
        const descMatches = descPart.match(/"([^"]*)"/g);
        const description = descMatches
            ? descMatches.map(d => d.slice(1, -1)).join('')
            : '';

        // Extract technologies
        const techMatches = techContent.match(/"([^"]+)"/g);
        const technologies = techMatches
            ? techMatches.map(t => t.slice(1, -1))
            : [];

        projects.push({ name, description, technologies });
    }

    return projects;
}

// Extract Diplomas and Certifications
function extractDiplomasAndCertifications(content: string): string[] {
    const diplomasSection = content.match(/const DiplomasAndCertifications[\s\S]*?<\/ListItem\s*>/);
    if (!diplomasSection) return [];

    const sectionContent = diplomasSection[0];
    const diplomas: string[] = [];

    // Match content between > and < in Link components, handling multi-line
    const linkContentRegex = /<Link[\s\S]*?>\s*([A-Z][^<]*[a-zA-Z])\s*<\/Link>/g;

    let match;
    while ((match = linkContentRegex.exec(sectionContent)) !== null) {
        const text = match[1].trim();
        // Filter out empty strings and ensure it's substantial text
        if (text && text.length > 10) {
            diplomas.push(text);
        }
    }

    return diplomas;
}

// Extract contact info
function extractContactInfo(content: string): {
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
} {
    const info = {
        location: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        website: ''
    };

    // Extract from ProfileField components
    const profileSection = content.match(/const Profile[\s\S]*?<\/Grid >/);
    if (!profileSection) return info;

    const sectionContent = profileSection[0];

    // Extract location
    const locationMatch = sectionContent.match(/text="([^"]*Cleveland[^"]*)"/);
    if (locationMatch) {
        info.location = locationMatch[1].replace('Hts', 'Heights');
    }

    // Extract email
    const emailMatch = sectionContent.match(/text="([^"]*@[^"]*)"/);
    if (emailMatch) {
        info.email = emailMatch[1];
    }

    // Extract phone
    const phoneMatch = sectionContent.match(/text="\((\d{3})\) (\d{3})-(\d{4})"/);
    if (phoneMatch) {
        info.phone = `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}`;
    }

    // Extract LinkedIn from URL
    const linkedinMatch = sectionContent.match(/linkedin\.com\/in\/([^"/]+)/);
    if (linkedinMatch) {
        info.linkedin = `linkedin.com/in/${linkedinMatch[1]}/`;
    }

    // Extract GitHub username
    const githubMatch = sectionContent.match(/github\.com\/([^"]+)"/);
    if (githubMatch) {
        info.github = `github.com/${githubMatch[1]}`;
    }

    // Extract website from print-only header
    const websiteMatch = content.match(/href="sorenschultz\.com"/);
    if (websiteMatch) {
        info.website = 'sorenschultz.com';
    }

    return info;
}

// Generate the resume text
function generateResumeTxt(): string {
    let output = '';

    // Header
    output += 'SOREN SCHULTZ\n';
    const contact = extractContactInfo(resumeTsxContent);
    output += `${contact.location}\n`;
    output += `${contact.email}\n`;
    output += `${contact.phone}\n`;
    output += `${contact.linkedin}\n`;
    output += `${contact.github}\n`;
    output += `${contact.website}\n`;
    output += '\n';

    // Professional Summary
    output += 'PROFESSIONAL SUMMARY\n';
    const summary = extractProfessionalSummary(resumeTsxContent);
    output += `${summary}\n\n`;

    // Education
    output += 'EDUCATION\n';
    const education = extractEducation(resumeTsxContent);
    output += `${education.school}\n`;
    output += `${education.degree}\n`;
    output += `${education.minors}\n`;
    output += `${education.gpa}\n`;
    output += `${education.dates}\n\n`;

    if (education.coursework.length > 0) {
        output += 'Relevant Coursework:\n';
        education.coursework.forEach(course => {
            output += `- ${course}\n`;
        });
        output += '\n';
    }

    // Experience
    output += 'EXPERIENCE\n';
    const jobs = extractJobs(resumeTsxContent);
    jobs.forEach((job, index) => {
        output += `${job.title}\n`;
        output += `${job.company}\n`;
        output += `${job.dates}\n`;
        job.description.forEach(desc => {
            output += `- ${desc}\n`;
        });
        if (index < jobs.length - 1) {
            output += '\n';
        }
    });
    output += '\n';

    // Skills
    output += 'SKILLS\n';
    const skills = extractSkills(resumeTsxContent);
    Object.entries(skills).forEach(([category, skillList]) => {
        output += `${category}:\n`;
        output += `${skillList.join(', ')}\n\n`;
    });

    // Projects
    output += 'PROJECTS\n';
    const projects = extractProjects(resumeTsxContent);
    projects.forEach((project, index) => {
        output += `${project.name}\n`;
        output += `${project.technologies.join(', ')}\n`;
        output += `${project.description}\n`;
        if (index < projects.length - 1) {
            output += '\n';
        }
    });
    output += '\n';

    // Diplomas and Certifications
    output += 'DIPLOMAS AND CERTIFICATIONS\n';
    const diplomas = extractDiplomasAndCertifications(resumeTsxContent);
    diplomas.forEach(diploma => {
        output += `- ${diploma}\n`;
    });

    return output;
}

// Main execution
try {
    const resumeTxt = generateResumeTxt();
    const outputPath = join(__dirname, '../public/resume.txt');
    writeFileSync(outputPath, resumeTxt, 'utf-8');
    console.log('✅ resume.txt has been generated successfully!');
    console.log(`📄 Output: ${outputPath}`);
} catch (error) {
    console.error('❌ Error generating resume.txt:', error);
    process.exit(1);
}

