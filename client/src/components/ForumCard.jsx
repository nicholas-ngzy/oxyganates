import React from 'react';
import { IconButton, Paper, Typography, Box, Link } from '@mui/material';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

export default function ForumCard(props) {
  return (
    <Paper sx={{ width: '70%', margin: '0.25em auto', border: 1, borderRadius: 4 }} elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4em', gap: 2 }}>
        <Typography variant='h4' paddingX={3}>
          {props.post.title}
        </Typography>
        <Link href={`/posts/${props.post._id}`}>
          <IconButton color='primary' size='large'>
            <ArrowForwardIosOutlinedIcon />
          </IconButton>
        </Link>
      </Box>
      <Box
        sx={{ width: '70%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginX: '1.5rem' }}
      >
        <Typography variant='h6'>By {props.post.user.name}</Typography>
        <Typography variant='h6'>{convertDate(props.post.date)}</Typography>
        {/* <Typography variant='h6'>{props.post.comments}</Typography> */}
      </Box>
    </Paper>
  );
}

const convertDate = (date) => {
  var newDate = new Date(date);
  return newDate.toLocaleString('en-GB');
};
