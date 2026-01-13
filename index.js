const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.get('/', (req, res) => {
    res.render('index', { videos: [] });   // 👈 IMPORTANT
});

app.post('/', async (req, res) => {
    const search = req.body.text;
    let videos = [];

    try {
        const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    part: 'snippet',
                    q: search,
                    key: YOUTUBE_API_KEY,
                    maxResults: 30,
                    type: 'video'
                }
            }
        );

        videos = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url
        }));

    } catch (err) {
        console.error(err.message);
    }

    res.render('index', { videos }); 
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
