'use strict';

const chai = require('chai');
const expect = chai.expect;

const schema = require( './../data/schema' );

function expectTable( catalog, table, schema )
{
    expect( catalog ).to.have.any.keys( table );
    expect( catalog[ table ], table ).to.have.length.above( 0 );

    const   columns = Object.keys( schema );
    catalog[ table ].forEach( ( row, r ) => {
        expect( row, `${table}[ ${r} ]` ).to.have.all.keys( columns );

        columns.forEach( column => {
            const   validate = schema[column];
            if ( validate ) expect( validate( row[ column ] ), column );
        });
    });
}

describe( 'Data', function() {
    it('should read the startup schema', function() {
        const   actual = schema.read();

        expect( actual ).to.have.all.keys( 'materials', 'resources', 'technologies', 'infrastructure', 'flows', 'phases', );
    });

    it('should have valid materials', function() {
        const   actual = schema.read();

        expectTable( actual, 'materials', {
            material: null,
            description: null,
            unit: null,
            urls: Array.isArray,
        });
    });

    it('should have valid technologies', function() {
        const   actual = schema.read();

        expectTable( actual, 'technologies', {
            technology: null,
            description: null,
            urls: Array.isArray,
        });
    });

    it('should have valid flows', function() {
        const   actual = schema.read();

        expectTable( actual, 'flows', {
            technology: null,
            phase: null,
            material: null,
            quantity: null,
        });
    });

    it('should have valid phases', function() {
        const   actual = schema.read();

        expectTable( actual, 'phases', {
            technology: null,
            phase: null,
            time: null,
        });
    });

    it('should have valid resources', function() {
        const   actual = schema.read();

        expectTable( actual, 'resources', {
            material: null,
            description: null,
            quantity: null,
            urls: Array.isArray,
        });
    });

    it('should have valid infrastructure', function() {
        const   actual = schema.read();

        expectTable( actual, 'infrastructure', {
            technology: null,
            description: null,
            quantity: null,
            begin: null,
            urls: Array.isArray,
        });
    });
});
