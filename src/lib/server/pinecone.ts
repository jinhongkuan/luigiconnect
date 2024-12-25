import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_API_KEY } from '$env/static/private';

export const pinecone = new Pinecone({
	apiKey: PINECONE_API_KEY
});

if (
	!(await pinecone
		.listIndexes()
		.then((indexes) => indexes.indexes?.find((index) => index.name === 'luigi-connect')))
) {
	await pinecone.createIndex({
		name: 'luigi-connect',
		dimension: 1024,
		metric: 'cosine',
		spec: {
			serverless: {
				cloud: 'aws',
				region: 'us-east-1'
			}
		}
	});
}

export const model = 'multilingual-e5-large';
