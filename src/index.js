import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('#search-form');
const input = form.querySelector('input');
const button = form.querySelector('button');
const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let item = '';
let page = 1;
const dataResult = {};

let searchInput = '';
input.addEventListener('input', () => {
    searchInput = input.value;
});

button.addEventListener('click', async (event) => {
    event.preventDefault();
    loadMore.classList.add('visually-hidden');
    try{
        page = 1;
        await search(40, page);
        const searchResults = dataResult.responses;
        console.log(dataResult.numberOfResponses);
        list (searchResults);
        gallery.innerHTML = item;
        libraryForGallery();
        page = 2;
        if(!gallery.firstChild){
            return error;
        }
        loadMore.classList.remove('visually-hidden');
    }
    catch(error){
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
});

loadMore.addEventListener('click', async () => {
    try{
        page += 1;
        await search(20, page);
        const moreResults = dataResult.responses;
        console.log(dataResult.numberOfResponses);
        list(moreResults);
        gallery.insertAdjacentHTML('beforeend', item);
        libraryForGallery();
    }
    catch{
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
})

async function search(perPage, page){
    const  answer = await fetch(`https://pixabay.com/api/?key=40289268-709deefe1360f0520e7e421a0&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    const result = await answer.json();
    dataResult.numberOfResponses = result.totalHits,
    dataResult.responses = result.hits;
};

function list (searchResults){ 
    item = searchResults.map(
    (searchResult) => 
    `<div class="photo-card">
    <a href="${searchResult.largeImageURL}">
    <img src="${searchResult.webformatURL}" alt="${searchResult.tags}" loading="lazy" />
    </a>
    <div class="info">
        <p class="info-item">
            <b>Likes</b>
            ${searchResult.likes}
        </p>
        <p class="info-item">
            <b>Views</b>
            ${searchResult.views}
        </p>
        <p class="info-item">
            <b>Comments</b>
            ${searchResult.comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>
            ${searchResult.downloads}
        </p>
    </div>
    </div>`
)
.join("");
return item;
};

function libraryForGallery(){
const options = {
    captions: true,
    captionSelector: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    close: false, 
};
const library  = new SimpleLightbox('.gallery a',  options );
};