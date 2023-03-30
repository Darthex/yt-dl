import React from "react";
import {motion} from "framer-motion"
import axios from "axios";
import arrow from '../assets/right-arrows.png'
import downloadImage from '../assets/download-white.png'
import youtube_parser from "./utils.js";

export default function Home() {

    const [link, setLink] = React.useState('')
    const [transitionBool, setTransitionBool] = React.useState(true)
    const [bool, setBool] = React.useState(true)
    const [thumbnail, setThumbnail] = React.useState('')
    const [title, setTitle] = React.useState('')
    const [redirect, setRedirect] = React.useState('')
    const [buttonBool, setButtonBool] = React.useState(false)


    function handleClick() {
        setTransitionBool(prevState => !prevState)
        setTimeout(() => setBool(prevState => !prevState), 1000)
    }

    function handleSubmit(e) {
        e.preventDefault()
        setButtonBool(prevState => !prevState)
        if(link.length > 0){

        let video_id = youtube_parser(link)
        axios({
            method: 'get',
            url: 'https://youtube-mp36.p.rapidapi.com/dl',
            params: {id: video_id},
            headers: {
                'X-RapidAPI-Key': '2c5ffafad3msheaf63ada2e54a71p122146jsnfa80303c4eab',
                'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            }
        }).then((res) => {
            setRedirect(res.data.link)
            axios({
                method: 'get',
                url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
                params: {id: video_id},
                headers: {
                    'X-RapidAPI-Key': '2c5ffafad3msheaf63ada2e54a71p122146jsnfa80303c4eab',
                    'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
                }
            })
                .then(res => {
                    setThumbnail(res.data.thumbnail[res.data.thubmnail.length - 1].url)
                    setTitle(res.data.title)
                    setLink('')
                    setButtonBool(prevState => !prevState)
                })
                .catch(err => console.log(err))
        })
            .catch(err => console.log(err))
        } else {
            alert('Enter a url first')
        }
    }

    function handleDownload() {
        window.location.href = redirect;
    }

    return (
        <div className='all--content'>
            {
                bool ?
                    <div className={transitionBool ? 'main--section' : 'main--section--after'}>
                        <div className='title--section'>
                            <h1 className='title'>Youtube MP3</h1>
                            <p>How does it work? Just paste the url from your favourite youtube video into the input box
                                and its
                                ready to download✨</p>
                        </div>

                        <motion.button
                            onClick={handleClick}
                            className="next--button"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.9}}
                            transition={{type: "spring", stiffness: 400, damping: 17}}>
                            <img src={arrow} alt='' className='arrow'/>
                        </motion.button>
                    </div>
                    :
                    <div className={bool ? 'section--2' : 'section--2--after'}>
                        <div className='section--2--content'>
                            <div className='form--section'>
                                <form onSubmit={handleSubmit} className='form'>
                                    <input type='text' value={link} onChange={(e) => setLink(e.target.value)}
                                           className='url--input'
                                           placeholder='Enter Url...'
                                    />
                                    <motion.button
                                        className="search--button"
                                        disabled={buttonBool}
                                        whileHover={{scale: 1.02}}
                                        whileTap={{scale: 1}}
                                        transition={{type: "spring", stiffness: 400, damping: 17}}>
                                        {buttonBool ? 'Searching...' : 'Search'}
                                    </motion.button>
                                </form>
                            </div>
                            <div className='result--section'>
                                {thumbnail &&
                                    <div className='image--container'>
                                        <img src={thumbnail} alt='' className='thumbnail'/>
                                        <a href={redirect} target='_blank'>
                                            <button className='download--button' onClick={handleDownload}>
                                                <img src={downloadImage} alt='' className='arrow'/>
                                            </button>
                                        </a>
                                    </div>
                                }
                                <p className='video--title'>{title}</p>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}
