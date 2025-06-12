import { useState } from 'react'
import { Box, TextField, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Mail } from '@mui/icons-material';
import { db } from '../firebaseConfig';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

function Contact() {
  const [validEmail, setValidEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!validEmail || isSent) return;
    event.preventDefault();
    setLoading(true);
    const now = Timestamp.now();
    const [[, email], [, message]] = new FormData(event.currentTarget);

    const messageDoc = doc(db, "mail", email + '.' + now.seconds + '.' + now.nanoseconds);
    await setDoc(messageDoc, {
      message: message,
      email: email,
      timestamp: now,
    });
    setLoading(false);
    setIsSent(true);
  }

  return (
    <Box
      px='16px'
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'
      component='form'
      onSubmit={(event) => handleSubmit(event)}
    >
      <Box
        sx={{
          m: 1,
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'flex-end',
          width: { xs: '100%', sm: '564px' },
        }}
      >
        <TextField
          label='Email Address'
          name='email'
          variant='standard'
          sx={{ width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Mail />
              </InputAdornment>
            ),
          }}
          required
          onChange={(event) => {
            setIsSent(false);
            setValidEmail(!!event.target.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))
          }}
          error={!validEmail}
          helperText={validEmail ? '' : 'Please enter a valid email address'}
        />
      </Box>
      <TextField
        sx={{
          m: 1,
          width: { xs: '100%', sm: '564px' },
        }}
        InputProps={{
          sx: {
            borderRadius: '0px'
          }
        }}
        label='Message'
        name='message'
        multiline
        rows={4}
        required
        onChange={() => setIsSent(false)}
      />
      <LoadingButton
        type='submit'
        variant='outlined'
        sx={{
          m: 1,
          borderRadius: 0,
          width: { xs: '100%', sm: '564px' },
        }}
        loading={loading}
        color={isSent ? 'success' : 'primary'}
      >
        {isSent ? 'Submitted!' : 'Submit'}
      </LoadingButton>
    </Box>
  )
}

export default Contact