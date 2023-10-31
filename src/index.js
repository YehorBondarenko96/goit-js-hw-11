import axios from "axios";
import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const options = {
    captions: true,
    captionSelector: 'img',
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    close: false, 
};
const library  = new SimpleLightbox('.gallery a',  options );


const form = document.querySelector('#search-form');
const input = form.querySelector('input');
const button = form.querySelector('button');
//const loadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let item = '';
let page = 1;
const dataResult = {};
let allResultPages = 0;
let scrolled = false;

let searchInput = '';
input.addEventListener('input', () => {
    searchInput = input.value;
});

button.addEventListener('click', async (event) => {
    event.preventDefault();
    window.removeEventListener('wheel', forLittleResult);
    scrolled = false;
    allResultPages = 0;
    //loadMore.classList.add('visually-hidden');
    try{
        //loadMore.classList.remove('visually-hidden');
        page = 1;
        await search(40, page);
        const searchResults = dataResult.responses;
        list (searchResults);
        gallery.innerHTML = item;
        library.refresh();
        if(!gallery.firstChild){
            return error
        } else{
            Notiflix.Notify.success(`Hooray! We found ${dataResult.totalHits} images.`);
            page = 2;
            smoothScroll();
            window.addEventListener('scroll', infiniteScroll);
        }
    }
    catch(error){
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
});

//loadMore.addEventListener('click', loadMoreItems);

async function search(perPage, page){
    if(searchInput === ""){
        gallery.innerHTML = '';
        return error
    } else{
    const  answer = await axios.get(`https://pixabay.com/api/?key=40289268-709deefe1360f0520e7e421a0&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    const result = await answer.data;
    allResultPages += result.hits.length;
    if(allResultPages >= result.totalHits && result.totalHits > 0){
        //loadMore.classList.add('visually-hidden');
        window.removeEventListener('scroll', infiniteScroll);
        if(!scrolled){
        window.addEventListener('wheel', forLittleResult);
    } else{
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    }
    dataResult.responses = result.hits;
    dataResult.totalHits = result.totalHits;
}
};

function list (searchResults){ 
    item = searchResults.map(
    (searchResult) => 
    `<div class="photo-card">
    <a href="${searchResult.largeImageURL}">
    <img src="${searchResult.webformatURL}" alt="${searchResult.tags}" loading="lazy" />
    </a>
    <div class="info">
    <ul>
        <li>
        <p class="info-item">
            <b>Likes</b><br>
            <span class="info-value">${searchResult.likes}</span>
        </p>
        </li>
        <li>
        <p class="info-item">
            <b>Views</b><br>
            <span class="info-value">${searchResult.views}</span>
        </p>
        </li>
        <li>
        <p class="info-item">
            <b>Comments</b><br>
            <span class="info-value">${searchResult.comments}</span>
        </p>
        </li>
        <li>
        <p class="info-item">
            <b>Downloads</b><br>
            <span class="info-value">${searchResult.downloads}</span>
        </p>
        </li>
    </ul>    
    </div>
    </div>`
)
.join("");
return item;
};

function smoothScroll(){
    
const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
});
};

async function loadMoreItems(){
    try{
        page += 1;
        await search(20, page);
        const moreResults = dataResult.responses;
        list(moreResults);
        gallery.insertAdjacentHTML('beforeend', item);
        library.refresh();
        smoothScroll();
    }
    catch{
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
};

const infiniteScroll = () => {
    scrolled = true;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMoreItems();
    }
    };

const forLittleResult = 
    debounce(() => {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
}, 500,
{
    leading: true,
    trailing: false,
});    