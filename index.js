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
                return server.get('db').videos.findOne({ id: args.id});
            }
        },
        videos: {
            type: new GraphQLList(videoType),
            resolve: () => server.get('db').videos.find({})
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