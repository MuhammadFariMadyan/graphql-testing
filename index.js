const { 
    GraphQLID,
    GraphQLBoolean,
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
 } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { getAllVideos, getVideoById, createVideo } = require('./data.js');

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
                    type: new GraphQLNonNull(GraphQLID),
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

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root of mutation type',
    fields: {
        createVideo: {
            type: videoType,
            args:{
                title: {
                    type: GraphQLString
                },
                duration: {
                    type: GraphQLInt
                },
                watched: {
                    type: GraphQLBoolean
                },
            },
            resolve: (_, args) => {
                return createVideo(args);
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});


server.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));