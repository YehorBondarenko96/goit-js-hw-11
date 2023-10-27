import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#search-form');
    const input = form.querySelector('input');
    const button = form.querySelector('button');
    const loadMore = document.querySelector('.load-more');
    const gallery = document.querySelector('.gallery');
});


let searchInput = '';
input.addEventListener('input', () => {
    searchInput = input.value;
});

button.addEventListener('click', async (event) => {
    event.preventDefault()
    try{
        const searchResults = await search(40, 1);
        list (searchResults);
        libraryForGallery();
        if(!gallery.firstChild){
            return false;
        }
    }
    catch{
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
});

loadMore.addEventListener('click', async () => {
    console.log(1);
    try{
        const moreResults = await search(20, 2);
        list(moreResults);
        libraryForGallery();
    }
    catch{
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
})

async function search(perPage, page){
    const  answer = await fetch(`https://pixabay.com/api/?key=40289268-709deefe1360f0520e7e421a0&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    const result = await answer.json();
    return result.hits;
};

function list (searchResults){ 
    const item = searchResults.map(
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
gallery.innerHTML = item;
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