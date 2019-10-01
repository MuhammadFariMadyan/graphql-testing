const { graphql, buildSchema } = require('graphql');

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

const query = `
query firstQuery {
    videos {
        id,
        title,
        watched,
        duration
    }
}
`;

async function main() {
    try {
        const result = await graphql(schema, query, resolvers);
        console.log(result);        
    } catch (error) {
        console.log(error);        
    }
}

main();