import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// GIVE ME IT 👺
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const ALERT_SECRET = process.env.ALERT_SECRET;
const PORT = process.env.PORT || 8080;

app.post('/gcp-alert', async (req, res) => {
  const token = req.query.auth_token;
  
  if (token !== ALERT_SECRET) {
    return res.status(403).send('Forbidden: Invalid token');
  }
  
  const incident = req.body?.incident;
  const isCreate = incident?.condition?.name?.includes('create');
  const condition = isCreate ? "Created" : "Down"
  const icon = isCreate ? "💚" : "💔"
  const color = isCreate ? 65280 : 16711680
  //   const condition = incident?.condition_name || 'Unnamed condition';
  const cluster = incident?.resource?.labels?.cluster_name || 'Unknown cluster';
  
  const message = {
    "content": `Alert from GKE`,
    "username": "GCP Monitor",
    "avatar_url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvenngage-wordpress.s3.amazonaws.com%2Fuploads%2F2022%2F09%2Fmeme_patrick_i_have_3_dollars-768x797.png&f=1&nofb=1&ipt=a7082e964a83ebcc7ea40dd35d9295f0ef8d6de42039566825f45a5c12eb23be",
    "embeds": [
      {
        "title": `GKE Cluster ${condition} ${icon}`,
        "description": `Cluster \`${cluster}\` is \`${condition}\``,
        "color": color,
        "fields": [
          {
            "name": "State",
            "value": `${condition}`,
            "inline": true
          },
          {
            "name": "Region",
            "value": "asia-northeast3",
            "inline": true
          }
        ]
      }
    ]
  };
  
  try {
    await axios.post(DISCORD_WEBHOOK, message);
    res.status(200).send('Sent to Discord');
  } catch (err) {
    console.error('Error sending to Discord:', err.message);
    res.status(500).send('Failed');
  }
});

// A A A A stayin alive 
app.listen(PORT, () => {
  console.log(`Server not listening on port ${PORT}`);
});
