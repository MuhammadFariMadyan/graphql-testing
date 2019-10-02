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
const { getAllVideos, getVideoById } = require('./data.js');

const PORT = process.env.PORT || 5678;
const server = express();

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
            args: {
                id: {
                    type: GraphQLID,
                    description: 'ID of the video.'
                }
            },
            resolve: (_, args) => {
                return getVideoById(args.id)
            }
        },
        videos: {
            type: new GraphQLList(videoType),
            resolve: getAllVideos
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