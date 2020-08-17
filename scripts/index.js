document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.lyrics.ovh/suggest/';
    const searchBox = document.querySelector('.search-box');
    
    const results = document.querySelector('.search-result');
    let lyricArea = document.querySelector('.lyric');
    // Adding result
    function singleResult(title, artist){
        const fancyResult = `<div class="single-result row align-items-center my-3 p-3">
                                <div class="col-md-9">
                                    <h3 class="lyrics-name" id="title">${title}</h3>
                                    <p class="author lead">Album by <span id="artist">${artist}</span></p>
                                </div>
                                <div class="col-md-3 text-md-right text-center">
                                    <button class="btn btn-success" id="get-lyrics">Get Lyrics</button>
                                </div>
                            </div>`;
        const div = document.createElement('div');
        div.innerHTML = fancyResult;
        results.appendChild(div);
    }

    // Fetch search data
    searchBox.children[1].addEventListener('click', () => {
        // Clear previous search results
        results.textContent = '';
        lyricArea.innerHTML = '';

        let inputValue = searchBox.children[0].value;
        if(inputValue){            
            fetch(apiUrl+inputValue)
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i <= 9; i++) {
                    let result = data['data'][i];
                    let title = result.title;
                    let artist = result.artist.name;
                    singleResult(title,artist);
                }
            }).catch(error => console.log("Something went wrong while fetching search data.", error))


        }
    })

    // Get and show lyrics
    function showLyrics(artist, title) {
        fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
        .then(res => res.json())
        .then(data => {
            if (data['error']){
                lyricArea.innerHTML = '';
                lyricArea.innerHTML = data.error;
            }
            else {
                document.getElementById('song-title').innerText = title;
                lyricArea.innerHTML = '';
                lyricArea.innerHTML = data.lyrics;
            }
        })
    }

    document.querySelector('.search-result').addEventListener('click', (e) => {
        if (e.target.id == 'get-lyrics'){
            let singleResult = e.target.closest('.single-result');

            let info = singleResult.children[0];
            let artist = info.children[1].children[0].innerHTML;
            let title = info.children[0].innerHTML;
            
            showLyrics(artist, title);
        }
    })
    
})