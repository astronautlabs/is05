import 'source-map-support/register';
import { transformSchema } from './json-schema';

async function main(args : string[]) {
    let [inputDir, outputDir] = args;
    await transformSchema({ 
        inputDir, 
        outputDir,
        nameTransformer: (name : string) => ({
            'connectionapi-base': 'ConnectionApiBase',
            'connectionapi-bulk': 'ConnectionApiBulk',
            'connectionapi-receiver': 'ConnectionApiReceiver',
            'connectionapi-sender': 'ConnectionApiSender',
            'connectionapi-single': 'ConnectionApiSingle'
        }[name])
    });
}

main(process.argv.slice(2));