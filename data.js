let VIDEOS = [
    {
        id: '1',
        title: 'Learning GraphQL',
        duration: 180,
        watched: true
    },

    {
        id: '2',
        title: 'Learning JS',
        duration: 100,
        watched: true
    },

    {
        id: '3',
        title: 'Learning PHP',
        duration: 120,
        watched: false
    }
];

function getVideoById(id) {
    return new Promise((resolve) => {
        const [video] = VIDEOS.filter(video => video.id === id)
        resolve(video);
    })
}

function getAllVideos(){
    return new Promise((resolve) => {
        resolve(VIDEOS);
    })
}

function createVideo({title, duration, watched}) {
    const newVideo = {
        id: new Buffer(title, 'utf8').toString('base64'),
        title,
        duration,
        watched
    }
    VIDEOS.push(newVideo);
    return newVideo;
}

function deleteVideo(id) {
    const deletedVideo = VIDEOS.find(video => video.id === id);
    const newVideos = VIDEOS.filter(video => video.id !== id);
    VIDEOS = newVideos;
    return deletedVideo;
}

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    deleteVideo
}