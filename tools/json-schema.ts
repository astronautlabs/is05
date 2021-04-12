import * as path from 'path';
import { readDir, readJsonFile, writeFile } from './utils';

export type PrimitiveType = 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string';

export type Schema = SchemaReference | SchemaDefinition;
export interface SchemaReference {
    $ref : string;
}

export interface SchemaDefinition {
    id? : string;
    $schema : 'http://json-schema.org/draft-04/schema#';
    description? : string;
    definitions? : Record<string, Schema>;
    title : string;
    type : PrimitiveType | PrimitiveType[];
    required? : string[];
    properties? : Record<string, Schema>;
    patternProperties? : Record<string, Schema>;
    additionalProperties? : Schema;
    propertyNames? : Schema;
    allOf? : Schema[];
    anyOf? : Schema[];
    oneOf? : Schema[];
    enum? : any[];
    const? : any;
    not? : Schema;
    if? : Schema;
    then? : Schema;
    else? : Schema;
    dependentSchemas? : Record<string, Schema>;
    prefixItems? : Schema[];

    // ARRAYS
    items? : Schema;
    minItems? : number;

    contains? : Schema;

}

export interface Options {
    inputDir : string;
    outputDir : string;
    nameTransformer? : (name : string) => string;
}

export interface Reference {
    filename : string;
    definition : string;
}

export async function transformSchema(options : Options) {
    let { inputDir, outputDir, nameTransformer } = options;
    interface Import {
        symbol : string;
        from : string;
    }
    
    function toInterfaceName(name : string) {
        if (nameTransformer) {
            let result = nameTransformer(name);
            if (result !== undefined)
                return result;
        }

        return name
            .replace(/^(.)/, (_, c) => c.toUpperCase())
            .replace(/[_-](.)/g, (_, c) => c.toUpperCase())
        ;
    }

    function parseReference(ref : string): Reference {
        // ref=foobar.json#/definitions/blah
        // or ref=foobar.json#

        let [ filename, hash ] = ref.split('#');

        let interfaceFilename = toInterfaceName(path.basename(filename, '.json'));
        let definitionFilename = toInterfaceName(path.basename(filename, '.json'));

        if (hash?.startsWith('/definitions/')) {
            definitionFilename = toInterfaceName(hash.replace(/\/definitions\//, ''));
        }

        return {
            filename: interfaceFilename,
            definition: definitionFilename
        };
    }

    function schemaToTS(schema : Schema, imports : Import[], indent = '') {
        let indentUnit = `    `;
        let indented = `${indent}${indentUnit}`;

        if ('$ref' in schema) {
            if (schema.$ref.startsWith('#')) {
                throw new Error(`Local refs not yet implemented`);
            } else {
                //let interfaceName = toInterfaceName(path.basename(schema.$ref, '.json'));
                let ref = parseReference(schema.$ref);

                imports.push({ symbol: ref.definition, from: `./${ref.filename}` });
                return ref.definition;
            }
        } else {
            let defn = <SchemaDefinition>schema;

            let types : string[] = [];

            if (typeof defn.type === 'string') {
                types = defn.type.split(',');
            } else if (defn.type) {
                types = defn.type;
            } else {
                types = [ 'object' ];
            }

            return types.map(type => {
                switch (type) {
                    case 'object':
                        if (defn.allOf) {
                            return defn.allOf.map(x => schemaToTS(x, imports, indent)).join(' & ');
                        } else if (defn.anyOf) {
                            return defn.anyOf.map(x => schemaToTS(x, imports, indent)).join(' | ');
                        } else if (defn.oneOf) {
                            return defn.oneOf.map(x => schemaToTS(x, imports, indent)).join(' | ');
                        } else {
                            let props : string[] = [];
        
                            if (defn.properties) {
                                for (let name of Object.keys(defn.properties)) {
                                    let prop = defn.properties[name];
                                    let description = '';
                                    if (('description' in prop) && prop.description)
                                        description = `\n${indented}/**\n${indented} * ${prop.description}\n${indented} */\n${indented}`;
                                    
                                    let opt = '?';

                                    if (defn.required && defn.required.includes(name))
                                        opt = '';

                                    props.push(
                                        `${description}${name}${opt} : ${schemaToTS(prop, imports, indented)}`
                                    );
                                }
                            }
        
                            return `{\n${indented}${props.join(`,\n${indented}`)}\n${indent}}`;
                        }
                        break;
                    case 'null':
                        return 'null';
                    case 'string':
                        return 'string';
                    case 'boolean':
                        return 'boolean';
                    case 'number':
                        return 'number';
                    case 'array':
                        if (schema.items)
                            return `Array<${schemaToTS(schema.items, imports, indent)}>`;
                        else
                            return `any[]`;
                    case 'integer':
                        return 'number';
                    default:
                        throw new Error(`Unknown schema type ${type}`);
                }
            }).join(' | ');
            
        }
    }

    let files = await readDir(inputDir);
    let indexList : string[] = [];

    for (let file of files) {
        if (!file.endsWith('.json'))
            continue;

        let name = path.basename(file, '.json');
        
        let imports : Import[] = [];
        let schema = await readJsonFile<Schema>(path.join(inputDir, file));

        if ('definitions' in schema) {
            let declarations : string[] = [];
            let outputFilename = path.resolve(outputDir, `${toInterfaceName(name)}.ts`);

            for (let defnName of Object.keys(schema.definitions)) {
                let defn = schema.definitions[defnName];
                let decl = schemaToTS(defn, imports);
                let interfaceName = toInterfaceName(defnName);
                let description = '';

                if ('description' in schema) {
                    description = schema.description;
                }
        
                if (description) {
                    description = `/**\n * ${description}\n */\n`;
                }
        
                declarations.push(`${description}export type ${interfaceName} = ${decl}`);
            }

            let importMap : Record<string, string[]> = {};
            for (let impo of imports) {
                if (!importMap[impo.from])
                    importMap[impo.from] = [];
    
                if (!importMap[impo.from].includes(impo.symbol))
                    importMap[impo.from].push(impo.symbol);
            }
    
            let importStatements = Object
                .keys(importMap)
                .map(from => `import { ${importMap[from].join(', ')} } from ${JSON.stringify(from)};`)
            ;

            await writeFile(
                outputFilename,
                `${importStatements.join("\n")}\n`
                + `${declarations.join("\n")}`
            );

            indexList.push(toInterfaceName(name));

            continue;
        }

        let interfaceName = toInterfaceName(name);
        let outputFilename = path.resolve(outputDir, `${interfaceName}.ts`);

        console.log(`${file} => ${interfaceName}.ts`);

        let type = schemaToTS(schema, imports);

        // Deduplicate and format imports

        let importMap : Record<string, string[]> = {};
        for (let impo of imports) {
            if (!importMap[impo.from])
                importMap[impo.from] = [];

            if (!importMap[impo.from].includes(impo.symbol))
                importMap[impo.from].push(impo.symbol);
        }

        let importStatements = Object
            .keys(importMap)
            .map(from => `import { ${importMap[from].join(', ')} } from ${JSON.stringify(from)};`)
        ;

        let description = '';

        if ('description' in schema) {
            description = schema.description;
        }

        if (description) {
            description = `/**\n * ${description}\n */\n`;
        }

        await writeFile(
            outputFilename, 
            `${importStatements.join("\n")}\n`
            + `${description}`
            + `export type ${interfaceName} = ${type};`
        );

        indexList.push(interfaceName);
    }

    await writeFile(path.resolve(outputDir, `index.ts`), indexList.map(x => `export * from ${JSON.stringify(`./${x}`)};`).join("\n"));
}
