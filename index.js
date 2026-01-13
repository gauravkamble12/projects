const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    let videos = [];

    try {
        const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/videos',
            {
                params: {
                    part: 'snippet',
                    chart: 'mostPopular',
                    regionCode: 'US',
                    maxResults: 24,
                    key: YOUTUBE_API_KEY
                }
            }
        );

        videos = response.data.items.map(v => ({
            id: v.id,
            title: v.snippet.title,
            thumbnail: v.snippet.thumbnails.medium.url
        }));
    } catch (err) {
        console.error(err.message);
    }

    res.render('index', { videos });
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    let videos = [];

    try {
        const response = await axios.get(
            'https://www.googleapis.com/youtube/v3/search',
            {
                params: {
                    part: 'snippet',
                    q: query,
                    maxResults: 24,
                    type: 'video',
                    key: YOUTUBE_API_KEY
                }
            }
        );

        videos = response.data.items.map(v => ({
            id: v.id.videoId,
            title: v.snippet.title,
            thumbnail: v.snippet.thumbnails.medium.url
        }));
    } catch (err) {
        console.error(err.message);
    }

    res.json(videos);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
