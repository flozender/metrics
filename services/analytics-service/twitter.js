require('dotenv').config();

import { trackPost } from '.';

const axios = require('axios');
const QUERY = "blockchain";

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://twitter.com/i/api/graphql/${TWITTER_GRAPHQL_ID}/SearchTimeline?variables=%7B%22rawQuery%22%3A%22${QUERY}%22%2C%22count%22%3A20%2C%22querySource%22%3A%22typed_query%22%2C%22product%22%3A%22Top%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`,
  headers: { 
    'authority': 'twitter.com', 
    'accept': '*/*', 
    'accept-language': 'en-US,en;q=0.9', 
    'authorization': `Bearer ${process.env.TWITTER_USER_BEARER}`, 
    'content-type': 'application/json', 
    'cookie': process.env.TWITTER_COOKIES, 
    'referer': `https://twitter.com/search?q=${QUERY}&src=typed_query&f=top`, 
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 
    'x-client-transaction-id': process.env.X_CLIENT_TRANSACTION_ID, 
    'x-client-uuid': process.env.X_CLIENT_UUID, 
    'x-csrf-token': process.env.X_CSRF_TOKEN, 
    'x-twitter-active-user': 'yes', 
    'x-twitter-auth-type': 'OAuth2Session', 
    'x-twitter-client-language': 'en'
  }
};

axios.request(config)
.then((response) => {
    try{
        let posts = response.data.data.search_by_raw_query.search_timeline.timeline.instructions[0].entries;
        const payload = posts.map(post=>{
            if (post.content.itemContent == undefined){
                return null;
            }
            const post_data = post.content.itemContent.tweet_results.result.legacy;
            return ({
                id: post.entryId,
                content: post_data.full_text,
                likes: post_data.favorite_count,
                comments: post_data.reply_count,
                source: 'Twitter'
            });
        }).filter(post => (post != null));
    } catch (exception){
        console.log("Error: " + exception);
    }
})
.catch((error) => {
  console.log(error);
});


// trackPost()