const {sequelize} = require('./db');
const {Band, Musician} = require('./index')

describe('Band and Musician Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
    })

    test('can create a Band', async () => {
        // TODO - test creating a band
        const testBand = await Band.create({name: "WHO", genre: "Pop", showCount: 1})
        expect(testBand.name).toBe("WHO");
        expect(testBand.showCount).toBe(1);
    })

    test('can delete instance', async () => {
        const testBand = await Band.create({name: "WHO", genre: "Pop", showCount: 1})
        const testMusician = await Musician.create({name: "Johnny", instrument: "flute"})
        expect(testBand.name).toBe("WHO");
        expect(testMusician.name).toBe("Johnny");

        await testBand.destroy();
        await testMusician.destroy();
        const band = await Band.findByPk(testBand.id);
        const music = await Musician.findByPk(testMusician.id);
  
        expect(band).toBeNull();
        expect(music).toBeNull();
    })

    test('can create a Musician', async () => {
        // TODO - test creating a musician
        const testMusician = await Musician.create({name: "Johnny", instrument: "flute"})
        expect(testMusician.name).toBe("Johnny");
    })

    test('can update', async () => {
        const testBand = await Band.create({name: "WHO", genre: "Pop", showCount: 1})
        const testMusician = await Musician.create({name: "Johnny", instrument: "flute"})
        expect(testBand.name).toBe("WHO");
        expect(testMusician.name).toBe("Johnny");

        const updatedBand = await testBand.update({name: "NOW"})
        const updatedMusician = await testMusician.update({name: "John"})
        expect(testBand.name).toBe("NOW");
        expect(testMusician.name).toBe("John");
    })
})