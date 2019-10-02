const { 
    GraphQLID,
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList
 } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');

const PORT = process.env.PORT || 5678;
const server = express();

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

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video for KODE platform',
    fields: {
        id: {
            type: GraphQLID,
            description: 'The id of the video'
        },
        title: {
            type: GraphQLString,
            description: 'The title of the video'
        },
        duration: {
            type: GraphQLInt,
            description: 'Duration of the video'
        },
        watched: {
            type: GraphQLBoolean,
            description: 'Whether or not the video has been watched.'
        }
    }
});

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root of query type',
    fields: {
        video: {
            type: videoType,
            resolve: () => new Promise((resolve) => {
                resolve({
                    id: '1',
                    title: `What's new in GraphQL`,
                    duration: 180,
                    watched: false
                })
            })
        },
        videos: {
            type: new GraphQLList(videoType),
            resolve: () => {
                return new Promise((resolve) => {
                    resolve(VIDEOS);
                })
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: queryType
});


server.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));