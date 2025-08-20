const newsAPIKey = "6851e86813c940fd8db108b28deedf70";
const nytAPIKey = "RyeSGFvcplrgN8nfPRBAFK9lDxtOntMG";
const guardianAPIkey = "a25b411b-f4f0-4076-b2e4-e4c1542397c2";

const form = document.querySelector('#searchBar');
const newsList = document.querySelector('#newsList');
const introText = document.querySelector('#introText');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelectorAll('.newsCard').forEach(card => {
        card.remove();})
    introText.classList.remove('hidden');
    form.className = 'before d-flex';

    const keyword = form.elements.query.value;
    const config = {
        params : {
            q: keyword
        }
    }
    const urlNewsAPI = `https://newsapi.org/v2/top-headlines?q=${keyword}&apiKey=${newsAPIKey}`;
    const urlNYTAPI = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${keyword}&api-key=${nytAPIKey}`;
    const urlGuardianAPI = `https://content.guardianapis.com/search?q=${keyword}&api-key=${guardianAPIkey}`;
    try{
        const responseNewsAPI = await axios.get(urlNewsAPI);
        const responseNYTAPI = await axios.get(urlNYTAPI, config);
        const responseGuardianAPI = await axios.get(urlGuardianAPI, config);
        getNews(normalizeNewsAPI(responseNewsAPI.data.articles));
        getNews(normalizeNYT(responseNYTAPI.data.response.docs));
        getNews(normalizeGuardian(responseGuardianAPI.data.response.results));
    } catch (error) {
        console.error("Error fetching news:", error);
    }
    form.elements.query.value = '';
})

const normalizeNewsAPI = (articles) => {
    return articles.map(a => ({
        title: a.title,
        timestamp: a.publishedAt,
        url: a.url,
    }));
};

const normalizeNYT = (article) => {
    return article.map(a => ({
        title: a.headline.main,
        timestamp: a.pub_date,
        url: a.web_url,
    }));
};

const normalizeGuardian = (results) => {
    return results.map(r => ({
        title: r.webTitle,
        timestamp: r.webPublicationDate,
        url: r.webUrl,
    }));
}

const getNews = (articles) => {
    articles.forEach(article => {
        let card = `
            <div class="newsCard col-12 col-sm-6 col-md-4 mb-3">
                <div class="card h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text small text-muted">${new Date(article.timestamp).toLocaleString()}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-outline-dark mt-auto">Read News</a>
                    </div>
                </div>
            </div>
        `;
        introText.classList.add('hidden');
        form.className = 'after d-flex';
        newsList.innerHTML += card;
    });
}