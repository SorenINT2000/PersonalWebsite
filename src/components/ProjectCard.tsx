import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  ManageSearch,
  Terminal,
  CalendarMonth,
} from '@mui/icons-material';
import type { Project } from '../vite-env';

const projIcons = {
  'Research': <ManageSearch sx={{ pr: '5px' }} />,
  'Programming': <Terminal sx={{ pr: '5px' }} />,
};

/*@__NO_SIDE_EFFECTS__*/
function ProjectCard({ title, type, description, details, timestamp, src, link }: Project) {
  return (
    <Card variant='outlined' sx={{ borderRadius: 5 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={src}
        title={title}
      />
      <CardContent>
        <Typography variant='h6'>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary' display='flex' sx={{ alignItems: 'center' }}>
          {projIcons[type as keyof typeof projIcons]}
          {type}
        </Typography>
        <Typography variant='body2' color='text.secondary' display='flex' sx={{ alignItems: 'center' }}>
          <CalendarMonth sx={{ pr: '5px' }} />
          {timestamp.toDate().toLocaleDateString(undefined, { day: 'numeric', year: 'numeric', month: 'short' })}
        </Typography>
      </CardContent>
      <Accordion
        variant='outlined'
        disableGutters
        sx={{
          borderRadius: '0 !important',
          border: 0,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            {details}
          </Typography>
          <Button variant='outlined' href={link} target="_blank" sx={{ mt: '10px', borderRadius: '0' }}>
            Learn More
          </Button>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

export default ProjectCard;