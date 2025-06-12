import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import ProjectCard from "../components/ProjectCard";
import { db } from "../firebaseConfig";
import { query, collection, getDocs, Timestamp } from "firebase/firestore";

type Project = {
  title: string;
  type: string;
  description: string;
  details: string;
  timestamp: Timestamp;
  src: string;
  link: string;
}

function Projects() {
  const getProjects = async () => {
    setLoading(true);
    const projCollection = collection(db, "projects");
    const projQuery = query(projCollection);
    const snapshot = await getDocs(projQuery);
    const projectList = snapshot.docs.map((doc) => doc.data());
    return projectList;
  };

  const [projectList, setProjectList] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const projectData = await getProjects();
      setProjectList(projectData as Project[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Box
      p='16px'
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {projectList?.map(
            (
              { title, type, description, details, timestamp, src, link },
              index
            ) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProjectCard
                  title={title}
                  type={type}
                  description={description}
                  details={details}
                  timestamp={timestamp}
                  src={src}
                  link={link}
                />
              </Grid>
            )
          )}
        </Grid>
      )}
    </Box>
  );
}

export default Projects;
