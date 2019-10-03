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
const massive = require('massive');

const PORT = process.env.PORT || 5678;
const DB_URL = 'postgres://postgres:rahasia@localhost:5432/kode-video';
const server = express();

massive({
    connectionString: DB_URL
}).then(db => {
    server.set('db', db);
})

const commmentType = new GraphQLObjectType({
    name: 'CommentType',
    description: 'Comment on a video',
    fields: {
        id: {
            type: GraphQLID
        },
        text: {
            type: GraphQLString
        }
    }
});

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
        },
        comments: {
            type: new GraphQLList(commmentType),
            description: 'Comments for certain video'
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
            resolve: async (_, args) => {
                const video = await server.get('db').videos.findOne({ id: args.id});
                video.comments = await server.get('db').comments.find({ video_id: video.id});
                return video;
            }
        },
        videos: {
            type: new GraphQLList(videoType),
            resolve: async () => {
                    const videos = await server.get('db').videos.find({});
                    for(let index=0; index<videos.length; index++){
                        videos[index].comments = await server.get('db').comments.find({video_id: videos[index].id});
                    }
                    return videos;
                }
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
                return server.get('db').videos.insert(args);
            }
        },
        deleteVideo: {
            type: videoType,
            description: 'Delete a video with an ID',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: (_, args) => {
                return server.get('db').videos.destroy(args.id);
            }
        },
        createComment: {
            type: commmentType,
            description: 'Create a new comment',
            args: {
                video_id: {
                    type: new GraphQLNonNull(GraphQLID)
                },
                text: {
                    type: GraphQLString
                }
            },
            resolve: (_, args) => server.get('db').comments.insert(args)
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