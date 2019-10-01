const { graphql, buildSchema } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');

const PORT = process.env.PORT || 5678;
const server = express();

const schema = buildSchema(`
type Video {
    id: ID,    
    title: String,
    duration: Int,
    watched: Boolean
}

type Query {
    videos: [Video]
}

type Schema {
    query: Query
}

`);

const resolvers = {
    videos: () => {
        return [
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
        ]
    }
};

server.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}));

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));