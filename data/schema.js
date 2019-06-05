const fs = require( 'fs' );
const path = require( 'path' );

function walk( dir )
{
    return fs.readdirSync( dir )
      .reduce( ( files, name ) => {
        const   entry = path.join( dir, name );

        if ( fs.statSync( entry ).isDirectory() )
            return files.concat( walk( entry ) );

        files.push( entry );
        return files;
        },
        []
        );
}

function readSchema( dir )
{
    const schema = fs.readdirSync( dir )
        .reduce( ( schema, table ) => {
            const   entry = path.join( dir, table );
            if ( !fs.statSync( entry ).isDirectory() ) return schema;

            schema[ table ] = walk( entry )
                .filter( name => ( /\.json$/.test( name ) ) )
                .reduce( ( rows, name ) => rows.concat( JSON.parse( fs.readFileSync( name ) ) ), [] )
                ;

            return schema;
        },
        {}
        );

    return schema.technologies.reduce( ( schema, technology ) => {
        schema.flows = technology.lifecycle.reduce( ( flows, phase ) => {
            flows = flows.concat(
                phase.flows.map( flow =>
                    Object.assign( { technology: technology.technology, phase: phase.phase, }, flow )
                )
            );
            delete phase.flows;
            return flows;
            },
            schema.flows || []
        );

        schema.phases = schema.phases || [];
        schema.phases = schema.phases.concat(
            technology.lifecycle.map( phase =>
                Object.assign( { technology: technology.technology, }, phase )
            )
        );

        delete technology.lifecycle;

        return schema;
        },
        schema
    );
}

module.exports.read = function()
{
    return readSchema( './data' );
}
