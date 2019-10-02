const VIDEOS = [
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

module.exports = {
    getAllVideos,
    getVideoById
}