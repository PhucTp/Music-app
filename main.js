/*
1. Render songs 
2. Scroll top 
3. play / pause /seek 
4. CD rotate 
5. Next / prev  
6. Random  
7. Next / repeat when ended
8. Active song 
9. scroll active sog into view
10. Play song when lick
*/

const $ = document.querySelector.bind(document); 
const $$ = document.querySelector.bind(document);

const heading = $('header h2') 
const cd = $('.cd')
const cdthum = $('.cd-thumb') 
const playBtn = $('.btn-toggle-play') 
const player = $('.player')
const audio = $('#audio')   
const progress = $('#progress')  
const prevBtn = $('.btn-prev') 
const nextBtn = $('.btn-next') 
const randomBtn = $('.btn-random') 
const repeatBtn = $('.btn-repeat') 


    const app = {
        currentIndex:0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        songs: [
            {
                name: 'Waiting for you', 
                singer: 'MONO', 
                path: './assets/music/song1.mp3',  
                img: './assets/img/imgsong1.jpg', 
            },
            {
                name: 'Chuyện đôi ta', 
                singer: 'Emcee L (Da LAB) ft Muộii', 
                path: './assets/music/song2.mp3',  
                img: './assets/img/imgsong2.jpg', 
            },
            {
                name: 'Kiếp má hồng', 
                singer: 'TLONG', 
                path: './assets/music/song3.mp3',  
                img: './assets/img/imgsong3.jpg',  
            },
            {
                name: 'Hãy trao cho anh', 
                singer: 'Sơn Tùng MTP', 
                path: './assets/music/song4.mp3',  
                img: './assets/img/imgsong4.jpg', 
            },
            {
                name: 'Chúng ta không thuộc về nhau', 
                singer: 'Sơn Tùng MTP', 
                path: './assets/music/song5.mp3',  
                img: './assets/img/imgsong5.jpg', 
            },
         
            
        ],
        render: function(){
            const htmls = this.songs.map((song,index)=>{
                return `
                    <div class="song ${index === this.currentIndex ? 'active' :''}">
                        <div class="thumb"
                            style="background-image: url('${song.img}')" >
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                `
            })
            $('.playlist').innerHTML = htmls.join ('')
        }, 
        defineProperties: function(){
            Object.defineProperty(this,'currentSong',{
                get: function(){
                    return this.songs[this.currentIndex]
                }
            })
        },

        handleEvents: function(){
            const _this = this
            const cdWidth = cd.offsetWidth 
            //Xử lí CD quay / dừng
            const cdthumpAnimate =  cdthum.animate([
                {transform: 'rotate(360deg)'}
            ],{
                duration:10000, //10 seconds
                iterations: Infinity,
            })
            cdthumpAnimate.pause() 


            // Xử lí phong to, thu nhỏ kéo lên kéo xún scroll CD
            document.onscroll= function(){
                const scrollTop = window.scrollY;
                // console.log(document.documentElement.scrollTop) (window.scrollY)
                const newCdWidth = cdWidth - scrollTop 
                // console.log(newCdWidth) 
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
                cd.style.opacity = newCdWidth / cdWidth
            }

            // Xử lí khi click play 
            playBtn.onclick = function(){
               if(_this.isPlaying){
                    audio.pause()
               }else{
                    audio.play() 
               }
            }
            //Khi song được play 
            audio.onplay = function(){
                _this.isPlaying=true 
                player.classList.add('playing') 
                cdthumpAnimate.play()
            } 
            //Khi song bị pause 
            audio.onpause = function(){
                _this.isPlaying=false 
                player.classList.remove('playing') 
                cdthumpAnimate.pause()
            }
            // Khi tua tiến độ bài hát thay đổi
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }
            }
            // Xử lí khi tua song
            progress.onchange = function(e){
               const seekTime = audio.duration / 100 * e.target.value 
               audio.currentTime = seekTime
            } 
            // Khi next song 
            nextBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong()
                }else{
                    _this.nextSong();
                }
                audio.play();
                _this.render();
            }
            //Khi prep song 
            prevBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playRandomSong();
                }else{
                    _this.prevSong() 
                }
                audio.play();
            } 

            // Xử lí bật tắt Random
            randomBtn.onclick = function(e){
                _this.isRandom = !_this.isRandom
                randomBtn.classList.toggle('active',_this.isRandom)
                _this.playRandomSong()
            } 

            // Xử lí lặp lại một song
            repeatBtn.onclick = function(e){
                _this.isRepeat = !_this.isRepeat 
                repeatBtn.classList.toggle('active',_this.isRepeat)
            }

            // Xử lí next song khi audio ended
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play()
                }else{
                    nextBtn.click()
                }
            } 

        }, 
        loadCurrentSong: function(){ // Đây là phương thức trong một đối tượng
               
            heading.textContent = this.currentSong.name  
            cdthum.style.background = `url('${this.currentSong.img}') top center / cover no-repeat`
            audio.src = this.currentSong.path
            console.log(heading, cdthum, audio)
        },
        nextSong: function(){ 
            this.currentIndex++; 
            console.log(this.currentIndex, this.songs.length)

            if(this.songs.length <= this.currentIndex){
                this.currentIndex= 0;
            }
            this.loadCurrentSong()
        }, 
        prevSong: function(){
            this.currentIndex--;  
            console.log(this.currentIndex, this.songs.length)
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length-1;
            }
            this.loadCurrentSong()
        },
        playRandomSong: function(){
            let newIndex;
            do{
                newIndex = Math.floor(Math.random() * this.songs.length);
            }while(newIndex === this.currentIndex) 
            console.log(newIndex)
            this.currentIndex = newIndex; 
            this.loadCurrentSong();
        },
        


        start: function(){
            // Định nghĩa các thuộc tính cho Object
            this.defineProperties(); 

            // Lắng nghe xử lí các sự kiện (DOM events)
            this.handleEvents();    

            // Tải thông tin bài hát đầu tiên vào UI khi chạy
            this.loadCurrentSong();

            // Render playlist
            this.render();
        }
    }
    app.start()
