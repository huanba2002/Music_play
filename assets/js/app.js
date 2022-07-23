
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBnt = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prveBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playLists = $('.playlist')

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs: [
        {
            name: 'Cưới thôi',
            singer: 'Masew',
            path: './assets/music/Cưới Thôi  Masiu x Masew.mp3',
            img: './assets/img/Cuoi_thoi.jpg'
        },
        {
            name: 'Only',
            singer: 'Lee Hi',
            path: './assets/music/LeeHi  ONLY Lyrics.mp3',
            img: './assets/img/Only.jfif'
        },
        {
            name: '3107',
            singer: 'Nâu Dương',
            path: './assets/music/3107 full album ft  titie Nâu Dươngg .mp3',
            img: './assets/img/cuoi_thoi.jpg'
        },
        {
            name: 'Lần hẹn hò đầu tiên',
            singer: 'Huyền Tâm Môm',
            path: './assets/music/LẦN HẸN HÒ ĐẦU TIÊN REMIX.mp3',
            img: './assets/img/lan hen ho dau tien.jfif'
        },
        {
            name: 'Có em',
            singer: 'Madihu',
            path: './assets/music/Madihu  Có em Feat Low G Official MV.mp3',
            img: './assets/img/cuoi_thoi.jpg'
        },
        {
            name: 'Only Piano',
            singer: 'Lee Hi',
            path: './assets/music/Only  Lee Hi  이하이  Piano Cover.mp3',
            img: './assets/img/cuoi_thoi.jpg'
        },
    ],
    defileProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEnvents: function() {
        
        // Sử lý quay và dừng cd
        const cdThumbAnimation = cdThumb.animate([
            {
                transform : 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations: Infinity
        }
        )
        cdThumbAnimation.pause()
        
        // Sử lý thu nhỏ
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Sử lý chạy nhạc
        playBnt.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()

            }
            

            
            // Khi bài hát đang chạy
            audio.onplay = function() {
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimation.play()
            }
            // Khi bài hát dừng
            audio.onpause = function() {
                app.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimation.pause()    
            }
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercentage = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercentage
            }
        }
        // Sử lý tua bài hát
        progress.onchange = function(e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        } 
        // Khi next bài hát
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSongs()
            }
            else {

                app.nextSong()
            }
            audio.play()
            app.render()

        }
        // Khi prev bài hát
        prveBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSongs()
            }
            else {
                app.prveSong()
            }
            audio.play()
            app.render()
        }
        // Xử lý random
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active',app.isRandom)
        
        }
        // Xử lý nextSong
        audio.onended = function() {
            if(app.isRepeat) {
                audio.play()
            }
            else{
                nextBtn.click()
            }
        }
        // Xử lý repeat bài hát
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active',app.isRepeat)
        }
        // Xử lý play lists
        playLists.onclick = function (e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')) {
                app.currentIndex = Number(songNode.dataset.index)
                app.loadCurrentSong()
                app.render()
                audio.play()
            }
        }

    },
    playRandomSongs: function() {
        let newIndex
        
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
        
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index = "${index}" >
                <div class="thumb" 
                style="background-image: url('${song.img}')"> </div>
                <div class = "body">
                    <h3 class="title">${song.name}</h3>
                    <p class="auther">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `  
        })
        playLists.innerHTML = htmls.join('')
        
    },
    loadCurrentSong: function () {
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`
        audio.src = this.currentSong.path
        
        
    },
    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    
    },
    prveSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    
    },
    start: function(){
        // định nghĩa các thuộc tính cho object
        this.defileProperties()
        // Sử lý các sự kiện 
        this.handleEnvents()
        
        // tải bài hát dầu tiên 
        this.loadCurrentSong()

        // render bài hát
        this.render()
    }
}

app.start()
