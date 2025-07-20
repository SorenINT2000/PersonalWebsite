import React, { useEffect, useState } from "react";
import { preload } from "react-dom";

import {
    Box, Grid, Typography, Divider, List, ListItem, ListItemAvatar,
    Avatar, Fade, Checkbox, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, IconButton, Link
} from "@mui/material";
import {
    School, Work, Code, Email, LinkedIn, GitHub, Print,
    FolderSpecial, Phone, Place, Person, WorkspacePremium
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import profile from "../images/profile.webp";
import bsDip from "/bsDip.pdf";
import msDip from "/msDip.pdf";

import soundFile from "../images/honk.mp3";
import "../styles/resume.css";
const honk = new Audio(soundFile);
honk.volume = 0.5;

const ProfileField = ({ icon, text, link, onClick }: { icon: React.ReactNode, text: string, link?: string, onClick?: () => void }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Grid size={1} sx={{ display: 'flex', justifyContent: 'center' }} className="resume-link">
            {isMobile ?
                <IconButton
                    color="primary"
                    size="large"
                    component={link ? 'a' : 'button'}
                    href={link}
                    target={link ? '_blank' : undefined}
                    onClick={onClick}
                >
                    {icon}
                </IconButton> :
                <>
                    <div className="animated-border-box-glow"></div>
                    <Box
                        className="animated-border-box"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:after': { background: theme.palette.background.default },
                            '&:before': {
                                background: `conic-gradient(
              rgba(0, 0, 0, 0),
              ${theme.palette.primary.main},
              rgba(0, 0, 0, 0) 25%
            )`,
                            }
                        }}>
                        {link ? (
                            <Button
                                startIcon={icon}
                                href={link}
                                target={link ? '_blank' : undefined}
                            >
                                {isMobile ? '' : text}
                            </Button>
                        ) : (
                            <Button
                                startIcon={icon}
                                onClick={onClick}
                            >
                                {isMobile ? '' : text}
                            </Button>
                        )}
                    </Box>
                </>
            }
        </Grid>
    )
}

const Profile = () => {
    preload(profile, { as: 'image' });
    const profileImg = profile;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Grid container spacing={{ xs: 0, sm: 2 }} columns={1}>
            <Grid size={1}>
                <Box
                    sx={{ mt: 2 }}
                    onClick={(e: React.MouseEvent<HTMLImageElement>) => {
                        const target = e.target as HTMLImageElement;
                        const x = (e.clientX - target.offsetLeft) / target.width;
                        const y = (e.clientY - target.offsetTop) / target.height;
                        if (0.45 < x && x < 0.55 && 0.45 < y && y < 0.55) honk.play();
                    }}>
                    <img
                        src={profileImg}
                        alt="profile"
                        width="100%"
                        height="auto"
                        style={{ borderRadius: '4px' }}
                    />
                </Box>
            </Grid>
            <Grid
                size={1}
                container
                spacing={1}
                columns={{ xs: 6, sm: 1 }}
                sx={{ display: { xs: 'flex', justifyContent: 'space-between' } }}
            >
                <ProfileField
                    icon={<Place fontSize="large" />}
                    text="Cleveland Hts, OH"
                    link="https://www.google.com/maps/place/Cleveland+Heights,+OH"
                />
                <ProfileField
                    icon={<Email fontSize="large" />}
                    text="sjschultz11@gmail.com"
                    link="mailto:sjschultz11+resume@gmail.com"
                />
                <ProfileField
                    icon={<Phone fontSize="large" />}
                    text="(503) 899-3141"
                    link="tel:5038993141"
                />
                <ProfileField
                    icon={<LinkedIn fontSize="large" />}
                    text="Soren Schultz"
                    link="https://www.linkedin.com/in/soren-schultz-3255b4191/"
                />
                <ProfileField
                    icon={<GitHub fontSize="large" />}
                    text="SorenINT2000"
                    link="https://github.com/SorenINT2000"
                />
                <ProfileField
                    icon={<Print fontSize="large" />}
                    text="Print Resume"
                    onClick={handlePrint}
                />
            </Grid >
        </Grid >
    );
}

const ProfessionalSummary = () => {
    return (
        <ListItem className='section-list-item' sx={{ pt: { xs: 0, sm: 2 } }}>
            <ListItemAvatar sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Avatar variant="rounded">
                    <Person />
                </Avatar>
            </ListItemAvatar>
            <Box>
                <Typography sx={{ fontSize: '16px', mb: 0.5 }}>
                    Innovative, analytical software engineer with graduate-level ML coursework and research—from
                    malware-image CNNs (improving classification accuracy by 6%) to reinforcement-learning agents.
                    This research complements experience shipping sleek, performant and user-friendly web apps
                    (personal website has 99% Lighthouse performance score). Targeting full-stack roles that
                    combine rigorous ML with user-centric software.
                </Typography>
            </Box>
        </ListItem>
    )
}

const Education = () => {
    // Relevant coursework lists in the same order as previously given:
    // 0 - Backend/Systems, 1 - Front-End/UI, 2 - Full-Stack,
    // 3 - Mobile, 4 - AI/ML, 5 - Data Engineering,
    // 6 - DevOps/SRE, 7 - Security-Focused

    const courseworkOptions: string[] = [
        "Backend/Systems",
        "Front-End/UI",
        "Full-Stack",
        "Mobile",
        "AI/ML",
        "Data Engineering",
        "DevOps/Cloud/Site-Reliability",
        "Security-Focused"
    ];

    const coursework: string[][] = [
        // Backend / Systems Engineer
        [
            "Algorithms",
            "Data Structures",
            "Operating Systems",
            "Computer Architecture",
            "Compiler Design",
            "Database Systems",
            "Software Engineering",
            "Security for ML"
        ],

        // Front-End / UI Developer
        [
            "Programming in Java",
            "Full-Stack Web Dev",
            "Software Craftsmanship",
            "Digital Image Processing",
            "Natural Language Processing"
        ],

        // Full-Stack Developer
        [
            "Data Structures",
            "Algorithms",
            "Full-Stack Web Dev",
            "Database Systems",
            "Software Engineering",
            "Operating Systems",
            "Machine Learning"
        ],

        // Mobile App Developer
        [
            "Programming in C/C++",
            "Data Structures",
            "Operating Systems",
            "Full-Stack Web Dev",
            "Software Craftsmanship",
            "Computer Vision"
        ],

        // AI / Machine-Learning Engineer
        [
            "Machine Learning",
            "Deep Generative Models",
            "AI for Sequential Decision-Making",
            "Probabilistic Graphical Models",
            "Natural Language Processing",
            "Computer Vision",
            "Causality & ML",
            "Security for ML"
        ],

        // Data Engineer / Big-Data Developer
        [
            "Algorithms",
            "Database Systems",
            "ML on Graphs",
            "Graph Theory",
            "Probability",
            "Operating Systems",
            "Software Engineering",
            "Linear Alg & Numerical Analysis"
        ],

        // DevOps / Cloud & Site-Reliability Engineer
        [
            "Operating Systems",
            "Computer Architecture",
            "Algorithms",
            "Database Systems",
            "Software Engineering",
            "Security for ML",
            "Full-Stack Web Dev"
        ],

        // Security-Focused Software Engineer
        [
            "Security for ML",
            "Operating Systems",
            "Compiler Design",
            "Algorithms",
            "Computer Architecture",
            "Database Systems",
            "Probability"
        ]
    ];

    const [selectedOptions, setSelectedOptions] = useState<number[]>([1, 2, 4, 6]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Get all unique courses from selected options
    const selectedCourses = [...new Set(selectedOptions.flatMap(option => coursework[option]))];

    return (
        <ListItem className='section-list-item'>
            <ListItemAvatar sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Avatar variant="rounded">
                    <School />
                </Avatar>
            </ListItemAvatar>
            <Box>
                <Typography variant="h6">Education</Typography>
                <Box sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                    <Box sx={{ flex: { md: '0 0 40%', lg: '0 0 35%' }, '@media print': { flex: '0 0 33%' } }}>
                        <Typography color="text.primary">Case Western Reserve Uni.</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '12px', px: '16px' }}>
                            {"Sept 2020 - May 2025"}
                            <br />
                            {"Computer Science B.S. '24, M.S. '25"}
                            <br />
                            {"Minors in Music & Mathematics"}
                            <br />
                            {"GPA: 3.8/4.0"}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: { md: '0 0 60%', lg: '0 0 65%' }, '@media print': { flex: '0 0 67%' } }}>
                        <Typography color="text.primary" onClick={handleClickOpen}>Relevant Coursework</Typography>
                        {selectedCourses.length > 0 && (
                            <Typography color="text.secondary" sx={{ fontSize: '12px', px: '16px' }}>
                                {selectedCourses.join(" • ")}
                            </Typography>
                        )}

                        <Dialog
                            open={open}
                            onClose={handleClose}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogTitle>Select Specializations</DialogTitle>
                            <DialogContent>
                                <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 4 }} sx={{ mt: 1 }}>
                                    {courseworkOptions.map((label, index) => (
                                        <Grid key={index} size={1}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox
                                                    checked={selectedOptions.includes(index)}
                                                    onChange={
                                                        (_, checked) => setSelectedOptions((prev) => checked ? [...prev, index] : prev.filter(item => item !== index))
                                                    }
                                                    size="small"
                                                />
                                                <Typography variant="body2">{label}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Done</Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </Box>
            </Box>
        </ListItem >
    )
}

const Job = (company: string, title: string, dates: string, description: string[]) => {
    return (
        <div className="job-section">
            <Box
                sx={{
                    flexDirection: { xs: 'column', lg: 'row' },
                    alignItems: { xs: 'flex-start', lg: 'center' },
                }}>
                <Box>
                    <Typography color="text.primary">{title}</Typography>
                    <Typography color="text.secondary">@ {company}</Typography>
                </Box>
                <Typography>{dates}</Typography>
            </Box>
            <Grid container direction="column" spacing={0}>
                {description.map((text, index) => (
                    <Grid key={index}>
                        {index !== 0 && <Divider sx={{ ml: 2 }} />}
                        <Typography
                            color="text.secondary"
                            sx={{ fontSize: '12px', px: '16px' }}>
                            {text}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </div >
    );
}

const Experience = () => {
    return (
        <ListItem className='section-list-item'>
            <ListItemAvatar sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Avatar variant="rounded">
                    <Work />
                </Avatar>
            </ListItemAvatar>
            <Box>
                <Typography variant="h6">Experience</Typography>
                {
                    Job("Magic Sheet Music Incorporated / Musa", "Junior Developer", "July 2022 - Current",
                        [
                            "Juggling many competing priorities in this two-engineer startup, managing Git workflows, writing technical docs, and presenting findings that guide architecture decisions.",
                            "Implemented the first browser MVP (React + OpenSheetMusicDisplay), which converts MusicXML to SVG and colors notes green/red as user plays, delivering real-time visual feedback in response to MIDI input.",
                            "Ported & documented adaptive note-alignment algorithm (invented by Kenrick Licorish, CEO) to JS. Wrote LaTeX spec & pseudocode for future devs.",
                            "Ran spike tests for low-latency audio streaming: built Python + Node POC (WebSocket signaling manages a WebRTC channel between the client and the server), showing drops from ~500 ms to sub-150 ms round-trip latency, shaping team's tech roadmap.",
                            "Explored cross-platform clients: produced React Native, Flutter, and Unity prototypes. Documented SVG-rendering limitations that led the team to adopt Unity C# for the production mobile app.",
                        ])
                }
                <Divider />
                {
                    Job("CWRU - Compiler Design", "Undergraduate Teaching Assistant", "Fall 2022 & 2023",
                        [
                            "Co-authored a new LLVM tutorial series (slides + code + write-ups) that replaces the steep llvm.org guide, letting first-time compiler students build and extend a mini-compiler with minimal prior background.",
                            "Wrote detailed design documents and sample solutions for six lab assignments, covering lexical analysis with Flex, parsing with Bison, and LLVM IR generation & optimization passes.",
                            'Delivered 3 guest lectures: "Intro to Programming in C++," "Object-Oriented Programming in C++," and "Introduction to Flex."',
                            "Hosted weekly Zoom office hours and Slack Q&A, mentoring ≈30 students per term on debugging clang errors, interpreting IR, and structuring compiler pipelines.",
                            'Collaborated with two fellow TAs & Department Chair to align grading rubrics and maintain consistent feedback across project milestones.'
                        ])
                }
            </Box>
        </ListItem >
    );
}

const Skills = () => {
    return (
        <ListItem className="section-list-item" sx={{ breakBefore: 'page' }}>
            <Divider variant="fullWidth"
                sx={{
                    display: 'none',
                    '@media print': {
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                    }
                }} />
            <ListItemAvatar sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Avatar variant="rounded">
                    <Code />
                </Avatar>
            </ListItemAvatar>
            <Box>
                <Typography variant="h6">Skills</Typography>
                <Grid container spacing={0} columns={1}>
                    <Grid size={1}>
                        <Typography color="text.primary">Programming Languages</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '12px', my: 0 }}>
                            {['JavaScript', 'TypeScript', 'Python', 'HTML/CSS', 'Java', 'MATLAB',
                                'C#', 'C/C++', 'GDScript', 'Markdown/LaTeX'].join(" • ")}
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Divider />
                        <Typography color="text.primary">Frameworks & Tools</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '12px', my: 0 }}>
                            {['React', 'Node.js', 'Git', 'Unity', 'Godot', 'Material UI',
                                'Pytorch', 'Firebase', 'Numpy', 'OpenCV', 'Matplotlib',
                                'Chakra UI', 'Mantine UI', 'WebRTC', 'WebSockets', 'Vite',
                                'Neo4j', 'JUnit', 'Flex/Bison', 'LLVM'].join(" • ")}
                        </Typography>
                    </Grid>
                    <Grid size={1}>
                        <Divider />
                        <Typography color="text.primary">Soft Skills</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '12px', my: 0 }}>
                            {['Problem Solving', 'Team Collaboration', 'Accountability',
                                'Time Management', 'Adaptability', 'Active Listening'].join(" • ")}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </ListItem>
    );
}

const Project = (name: string, description: string, technologies: string[]) => {
    return (
        <div className="project-section">
            <Box
                sx={{
                    flexDirection: { xs: 'column', lg: 'row' },
                    alignItems: { xs: 'left', lg: 'center' },
                    gap: { xs: '0px', lg: '10px' }
                }}>
                <Typography color="text.primary">{name}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: '12px' }}>{technologies.join(" • ")}</Typography>
            </Box>
            <Typography color="text.secondary" sx={{ fontSize: '12px', px: '16px' }}>{description}</Typography>
        </div >
    );
}

const Projects = () => {
    return (
        <ListItem className="section-list-item">
            <ListItemAvatar sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Avatar variant="rounded">
                    <FolderSpecial />
                </Avatar>
            </ListItemAvatar>
            <Box>
                <Typography variant="h6">Recent Projects</Typography>
                {
                    Project(
                        "WebRTC Videochat",
                        "A WebRTC videochat web-app that uses Firebase Realtime Database as a signaling server and the " +
                        "WebRTC protocol to stream video and audio data between clients. Uses Metered TURN server to relay " +
                        "traffic between clients and Firebase Security Rules to secure the database.",
                        ["TypeScript", "React", "Firebase Realtime DB", "WebRTC", "Metered TURN Server", "Chakra UI"]
                    )
                }
                <Divider variant="fullWidth" />
                {
                    Project(
                        "Oregon ACP Website",
                        "A website for the Oregon American College of Physicians (ACP). " +
                        "Intended to be an improved version of the current oregonacp.org website. " +
                        "Complete with an auth-protected admin dashboard where committee chairs can make announcements " +
                        "and executive members can manage permissions. Uses server-side pagination to load announcements " +
                        "and Firebase Functions to securely manage user claims.",
                        ["TypeScript", "React", "Firebase Auth, Firestore DB, Storage & Functions", "Mantine UI"]
                    )
                }
                <Divider variant="fullWidth" />
                {
                    Project(
                        "Variational Quantum Circuit for K-arm Bandit Solution Opt",
                        "Uses a simulated VQC to optimize a solution to K-arm bandit problems. " +
                        "Shown to provide a general improvement in accuracy of the final solution over a " +
                        "classical epsilon-greedy approach for large K.",
                        ["Python", "Numpy", "Matplotlib", "Qiskit"]
                    )
                }
                <Divider variant="fullWidth" />
                {
                    Project(
                        "Malware Image Classification with ESRGAN",
                        "Combines a baseline CNN with a pre-trained ESRGAN model to improve " +
                        "the accuracy of classification of malware images by ~6%. Uses the MalIMG dataset " +
                        "to train the CNN and connective network, keeping the ESRGAN model frozen.",
                        ["Python", "Numpy", "SkLearn", "Pytorch"]
                    )
                }
                <Divider variant="fullWidth" />
                {
                    Project(
                        "LLM Knowledge Graph Extraction & Bias Detection",
                        "Uses an LLM to extract knowledge graphs from reddit posts to build " +
                        "bipartite knowledge graphs between groups of people and trait nodes. " +
                        "Uses an Ollama sentence transformer to detect social biases in the text " +
                        "between two parametrized groups by analyzing the knowledge graph.",
                        ["Python", "Neo4j", "LLMs", "Ollama"]
                    )
                }
            </Box>
        </ListItem>
    );
}

const DiplomasAndCertifications = () => {
    return (
        <ListItem className="section-list-item">
            <ListItemAvatar sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Avatar variant="rounded">
                    <WorkspacePremium />
                </Avatar>
            </ListItemAvatar>
            <Box>
                <Typography variant="h6">Diplomas and Certifications</Typography>
                <div>
                    <Link
                        color="text.secondary"
                        href={bsDip}
                        target="_blank"
                    >
                        Bachelor of Science in Computer Science
                    </Link>
                    {" • "}
                    <Link
                        color="text.secondary"
                        href={msDip}
                        target="_blank">
                        Master of Science in Computer Science
                    </Link>
                    {" • "}
                    <Link
                        color="text.secondary"
                        href="https://www.credly.com/badges/54ee77b6-2d76-4145-9d82-469e1366ba42"
                        target="_blank">
                        Amazon Web Services - Cloud Practitioner
                    </Link>
                </div>
            </Box>
        </ListItem >
    );
}

function Resume() {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);
    }, []);

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            width='100%'
        >
            {/* Print-only header */}
            <Box sx={{
                display: 'none',
                '@media print': {
                    display: 'block',
                    width: '100%',
                    textAlign: 'center'
                }
            }}>
                <Typography variant="h6" fontSize={"24pt"}>Soren Schultz</Typography>
                <Divider variant="fullWidth" />
                <div>
                    <Link
                        color="text.secondary"
                        href="https://www.google.com/maps/place/Cleveland+Heights,+OH"
                        target="_blank">
                        Cleveland Heights, Ohio
                    </Link>
                    {" • "}
                    <Link
                        color="text.secondary"
                        href="mailto:sjschultz11+resume@gmail.com"
                        target="_blank">
                        sjschultz11@gmail.com
                    </Link>
                    {" • "}
                    <Link
                        color="text.secondary"
                        href="tel:5038993141"
                        target="_blank">
                        (503) 899-3141
                    </Link>
                </div>
                <div>
                    <Link
                        color="text.secondary"
                        href="linkedin.com/in/soren-schultz-3255b4191/"
                        target="_blank">
                        linkedin.com/in/soren-schultz-3255b4191/
                    </Link>
                    {" • "}
                    <Link
                        color="text.secondary"
                        href="sorenschultz.com"
                        target="_blank">
                        sorenschultz.com
                    </Link>
                    {" • "}
                    <Link
                        color="text.secondary"
                        href="github.com/SorenINT2000"
                        target="_blank">
                        github.com/SorenINT2000
                    </Link>
                </div>
                <Divider variant="fullWidth" />
            </Box>

            <Box sx={{ maxWidth: '1200px', width: '100%' }}>
                <Grid alignItems='left' mx={2} container spacing={{ xs: 0, sm: 2 }} columns={12} sx={{ mb: { sm: 0 } }}>
                    <Grid
                        className="profile-grid"
                        size={{ xs: 12, sm: 4, md: 3 }}
                        sx={{
                            position: { sm: 'sticky' },
                            top: { sm: '75px' },
                            height: { sm: 'fit-content' },
                            alignSelf: { sm: 'flex-start' },
                        }}
                    >
                        <Fade in={showContent} timeout={1200}>
                            {Profile()}
                        </Fade>
                    </Grid>
                    <Grid className="content-grid" size={{ xs: 12, sm: 8, md: 9 }}>
                        <List sx={{ pt: 0 }}>
                            <Fade in={showContent} timeout={800}>
                                {ProfessionalSummary()}
                            </Fade>
                            <Divider variant="fullWidth" component="li" />
                            <Fade in={showContent} timeout={1200}>
                                {Education()}
                            </Fade>
                            <Divider variant="fullWidth" component="li" />
                            <Fade in={showContent} timeout={1600}>
                                {Experience()}
                            </Fade>
                            <Divider variant="fullWidth" component="li" />
                            <Fade in={showContent} timeout={2000}>
                                {Skills()}
                            </Fade>
                            <Divider variant="fullWidth" component="li" />
                            <Fade in={showContent} timeout={2400}>
                                {Projects()}
                            </Fade>
                            <Divider variant="fullWidth" component="li" />
                            <Fade in={showContent} timeout={2800}>
                                {DiplomasAndCertifications()}
                            </Fade>
                        </List>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    );
}

export default Resume;
