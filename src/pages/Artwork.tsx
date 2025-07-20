import { useState } from 'react';

import ArtworkTile from '../components/ArtworkTile';

import {
  Box,
  Grid,
  Dialog
} from '@mui/material';

const imageList: string[] = [
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/AluminumTendril.png?alt=media&token=e1dc8d36-6a07-4dc2-9792-dc63e11ba0e7',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/AshenValley.png?alt=media&token=f95ae5c4-afe1-47af-a228-e5e66a66fb0e',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/buddhabrot.png?alt=media&token=c71096b1-2620-4cd5-abae-c3d8383f05a9',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/BuddhasRetreat.png?alt=media&token=a5b65b05-54f7-4f1a-8a22-fbccb6cbd139',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/CaterpillarFeet.png?alt=media&token=743f8d08-c142-4e2f-93a2-81bceab52f4d',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/EatYourGreens.png?alt=media&token=fa8dbe9b-d97b-49b0-bf66-686086ac34e0',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Endless%20Delta.png?alt=media&token=23e7bdab-02a5-4c10-b330-47ecdb7443ec',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Entanglement.png?alt=media&token=68f4bebc-8a85-432f-8f74-fb2b9732969b',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Flowering%20Hell.png?alt=media&token=9914cf74-fac1-4479-818e-5330f26b5961',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Honey%20Comb.png?alt=media&token=1a3e5e36-82bf-4f9c-a331-122170ca71c7',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/StaringIntoTheVoid.png?alt=media&token=9d8ab60f-5e0d-447f-8822-4b5a1b498092',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/LavanderField.png?alt=media&token=2d05b996-0f03-447d-91ca-f13cbc7f22ff',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/LizardWorld.png?alt=media&token=d95bcd3e-0285-4e8c-9df9-9a6861220966',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Oasis%20at%20Sunrise.png?alt=media&token=fc78f01e-8417-4ec7-903a-13e464aecc34',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Onyx.png?alt=media&token=b6ed1ad6-a57a-4349-a2b5-754369d42668',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Poisonous%20Forest.png?alt=media&token=1d6fc0bf-b7da-4d46-a7b2-610eca114fa7',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/RoseBush.png?alt=media&token=1c54c8ee-bb49-42f8-802c-4480cedc9b10',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/SkyHigh.png?alt=media&token=eb805653-ef64-482f-8b61-18a2007cccb9',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/StarrySky.png?alt=media&token=b0e0dda0-6569-436e-88d9-aaeeaa20b057',
  "https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Sun%20God's%20Banner.png?alt=media&token=99ef1957-7e3b-4816-91b1-36e3b7d3251d",
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/terminalBackground.png?alt=media&token=665f8cba-053c-4074-b18c-3704a316db5f',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/Tides%20of%20Time.png?alt=media&token=d06c7bb8-e792-41b8-8dc2-69df0a2cb3ff',
]

const thumbnailList: string[] = [
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FAluminumTendril_thumb.png?alt=media&token=a2961b62-b280-4409-9c19-5d514f60cd62',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FAshenValley_thumb.png?alt=media&token=3875d216-5bad-42a7-9911-d0967f09cbe5',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FBuddhaBrot_thumb.png?alt=media&token=68d4b273-ca0e-4e42-975e-518ceff687c2',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FBuddhasRetreat_thumb.png?alt=media&token=1f83398b-3c76-4feb-aec1-d5b6ab088bcd',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FCatapillar_thumb.png?alt=media&token=e0a8352d-fb9a-4049-bfac-77367ae0c812',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FEatYourGreens_thumb.png?alt=media&token=5636f270-824e-40ce-b05f-301fc22fb81f',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FEndlessDelta_thumb.png?alt=media&token=aad254ea-f8a2-4ac4-858c-a47ef007f142',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FEntanglement_thumb.png?alt=media&token=9fd8318e-34c0-4081-8836-9949a955aa3f',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FFloweringHell_thumb.png?alt=media&token=1dc7c752-4868-4c5b-bcc7-d132722661fc',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FHoneyComb_thumb.png?alt=media&token=f5de81a9-7e77-4bbf-be0d-b0bd652b3e49',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FIntoTheVoid_thumb.png?alt=media&token=5ce0d708-9a95-4aa7-8f8d-d5df9a11e569',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FLavanderField_thumb.png?alt=media&token=d1961c25-b945-44e5-9d7f-e4474b185654',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FLizardWorld_thumb.png?alt=media&token=8ed7d314-8579-4dd2-b175-e256fe92c23c',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FOasisAtSunrise_thumb.png?alt=media&token=41fcf227-6167-4bcc-abac-be6c4bd1c1b6',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FOnyx_thumb.png?alt=media&token=9b82dc50-cbf4-4b5b-a0fd-7fc586285fe9',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FPoisonousForest_thumb.png?alt=media&token=3e2f70ad-dcaf-4ede-99aa-418224bf7638',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FRoseBush_thumb.png?alt=media&token=95429958-008a-4551-b76a-15bce4b06929',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FSkyHigh_thumb.png?alt=media&token=c8a59ace-3a6b-419a-a30c-ff0364328e90',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FStarrySky_thumb.png?alt=media&token=73bb7690-19b3-4618-9098-5cc069718cc4',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FSunGodsBanner_thumb.png?alt=media&token=c17b211f-7b78-4ddd-8953-97a76baf9b9b',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FTerminalBackground_thumb.png?alt=media&token=b27c7146-34ca-41ef-b4c8-c6a4bec5638c',
  'https://firebasestorage.googleapis.com/v0/b/sorenschultz-2c08e.appspot.com/o/thumbnails%2FTidesOfTime_thumb.png?alt=media&token=f41dc0c2-acfb-4b04-8925-08ab108453e8',
]

function Artwork() {
  const [dialog, setDialog] = useState<string | null>(null)

  return (
    <Box
      px='16px'
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'>
      <Grid container spacing={0}>
        {
          thumbnailList.map((image, index) =>
            <Grid
              key={image}
              size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
              sx={{
                aspectRatio: '1/1',
              }}
            >
              <ArtworkTile
                name={image}
                src={image}
                onClick={() => setDialog(imageList[index])} />
            </Grid>
          )
        }
      </Grid>
      <Dialog
        open={dialog !== null}
        onClose={() => setDialog(null)}
        sx={{
          display: 'flex',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          p: '40px',
          lineHeight: 0.6,
        }}>
        <img
          src={dialog ?? ''}
          alt={dialog ?? ''}
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
      </Dialog>
    </Box>
  );
}

export default Artwork;