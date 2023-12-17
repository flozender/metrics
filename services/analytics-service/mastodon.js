require('dotenv').config();

const axios = require('axios');
const sanitizeHtml = require('sanitize-html');

const { trackPost } = require('./index.js');
const QUERY = "blockchain";

let config = {
    method: 'get',
    url: `https://mastodon.social/api/v2/search?q=${QUERY}&type=statuses`,
    headers: { 
      'authorization': `Bearer ${process.env.MASTODON_ACCESS_TOKEN}`, 
      'content-type': 'application/json', 
    }
  };

const fetchStatuses = async (config) => {
    console.log(new Date().toLocaleString() + ": Fetching Mastodon statuses!");
    axios.request(config)
    .then((response) => {
        try{
            let posts = response.data.statuses;
            const payload = posts.map(post => {
                const createdAt = new Date(post.created_at).toUTCString();
                return ({
                    id: post.id,
                    content: sanitizeHtml(post.content, {allowedTags: []}),
                    likes: post.favourites_count,
                    comments: post.replies_count,
                    createdAt,
                    createdBy: post.account.id,
                    source: 'Mastodon',
                    timestamp: new Date().toLocaleString()
                });
            })
            .filter(post => (post != null))
            .map(post => JSON.stringify(post));

            trackPost(payload, 'Mastodon');
        } catch (exception){
            console.log("Error: " + exception);
        }
    })
    .catch((error) => {
      console.log(error);
    });
}

// run immediately
fetchStatuses(config);
// then once every 10 mins
setInterval(() => fetchStatuses(config), 600000);