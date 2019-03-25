# notesPicker
Search interesting websites for current articles on web development

The specific model is searching on www.webdesigndepot.com, a website for UX design and trends.

## How it works:
First use Cheerio to scrape the desired website
npm install cheerio

Then use a mongo database to store the information using Mongoose.

Use basic ajax requests to pull in the scraped content to a new url "/articles"

Once there, you can select if you have read or not read the arcticle. 

Also you can leave notes for yourself on the article you have read.
